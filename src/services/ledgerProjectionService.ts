// TSS Unified Ledger Projection Service (Phase 5.7 & 5.8 - TSS-P5.8-REV-COR-2026)
// The Official Ledger is the authoritative financial projection of POSTED source events.
// Sources: OPENING_BALANCE | INCOME | EXPENSE | TRANSFER | REVERSAL
// Core Principle: Balances are derived, NOT stored on Account or Fund objects.
// Financial Precision: All calculations execute via SafeMoney (integer minor-unit arithmetic).

import {
  LedgerEntry,
  LedgerSourceType,
  LedgerDirection,
  OpeningBalanceEntry,
  IncomeEntry,
  ExpenseEntry,
  TransferEntry,
  ReversalEntry,
  Account,
  Fund,
  AccountBalanceSummary,
  FundBalanceSummary,
  AccountFundBalanceSummary,
  RunningBalanceEntry,
  FinancialStatementSummary,
  ReconciliationCheckResult,
  LedgerReconciliationReport,
  LedgerRebuildResult
} from '../types';
import { SafeMoney } from '../utils/safeMoney';

export interface SourceEventContainer {
  openingBalances: OpeningBalanceEntry[];
  incomes: IncomeEntry[];
  expenses: ExpenseEntry[];
  transfers: TransferEntry[];
  reversals?: ReversalEntry[];
}

export class LedgerProjectionService {
  /**
   * Safe decimal addition (via centralized SafeMoney integer minor-unit arithmetic)
   */
  public static safeAdd(a: number, b: number): number {
    return SafeMoney.add(a, b);
  }

  /**
   * Safe decimal subtraction (via centralized SafeMoney integer minor-unit arithmetic)
   */
  public static safeSub(a: number, b: number): number {
    return SafeMoney.sub(a, b);
  }

  /**
   * Safe decimal summation
   */
  public static safeSum(amounts: number[]): number {
    return SafeMoney.sum(amounts);
  }

  /**
   * Safe decimal comparison
   */
  public static safeCmp(a: number, b: number): -1 | 0 | 1 {
    return SafeMoney.cmp(a, b);
  }

  /**
   * Safe decimal equality
   */
  public static safeEq(a: number, b: number): boolean {
    return SafeMoney.eq(a, b);
  }

  /**
   * Project a single Opening Balance into a LedgerEntry
   * Must be POSTED (or isFinancialPosted === true).
   */
  public static projectOpeningBalance(
    ob: OpeningBalanceEntry,
    seq: number
  ): LedgerEntry[] {
    if (ob.status !== 'POSTED' && !ob.isFinancialPosted) {
      return [];
    }

    const code = `LED-2026-${seq.toString().padStart(6, '0')}`;
    const desc = ob.reasonDetails
      ? `প্রারম্ভিক স্থিতি: ${ob.reasonDetails}`
      : `প্রারম্ভিক স্থিতি গ্রহণ (${ob.reasonCode})`;

    const entry: LedgerEntry = {
      id: `led-ob-${ob.id}`,
      organizationId: ob.organizationId,
      ledgerCode: code,
      sourceType: 'OPENING_BALANCE',
      sourceId: ob.id,
      sourceCode: ob.openingBalanceCode,
      accountId: ob.accountId,
      fundId: ob.fundId,
      entryDate: ob.openingDate,
      direction: 'IN',
      amount: SafeMoney.fromMinorUnits(SafeMoney.toMinorUnits(ob.amount)),
      description: desc,
      version: ob.version || 1,
      postedAt: ob.postedAt || ob.updatedAt || ob.createdAt,
      postedBy: ob.postedBy || ob.approvedBy || ob.createdBy,
      createdAt: ob.createdAt
    };

    return [entry];
  }

  /**
   * Project a single Income entry into a LedgerEntry
   * Must be POSTED (or isFinancialPosted === true or status === 'APPROVED').
   */
  public static projectIncome(
    inc: IncomeEntry,
    seq: number
  ): LedgerEntry[] {
    // Phase 5.3 income is officially posted upon approval or explicit POSTED status
    if (inc.status !== 'POSTED' && inc.status !== 'APPROVED' && !inc.isFinancialPosted) {
      return [];
    }

    const code = `LED-2026-${seq.toString().padStart(6, '0')}`;
    const desc = inc.description || `আয় প্রাপ্তি (রশিদ নং: ${inc.receiptNo})`;

    const entry: LedgerEntry = {
      id: `led-inc-${inc.id}`,
      organizationId: inc.organizationId,
      ledgerCode: code,
      sourceType: 'INCOME',
      sourceId: inc.id,
      sourceCode: inc.receiptNo || inc.transactionCode,
      accountId: inc.accountId,
      fundId: inc.fundId,
      entryDate: inc.entryDate,
      direction: 'IN',
      amount: SafeMoney.fromMinorUnits(SafeMoney.toMinorUnits(inc.amount)),
      description: desc,
      version: inc.version || 1,
      postedAt: inc.postedAt || inc.approvedAt || inc.updatedAt || inc.createdAt,
      postedBy: inc.postedBy || inc.approvedBy || inc.createdBy,
      createdAt: inc.createdAt
    };

    return [entry];
  }

  /**
   * Project a single Expense entry into a LedgerEntry
   * Must be POSTED (or isFinancialPosted === true or status === 'APPROVED').
   */
  public static projectExpense(
    exp: ExpenseEntry,
    seq: number
  ): LedgerEntry[] {
    // Phase 5.4 expense is officially posted upon approval or explicit POSTED status
    if (exp.status !== 'POSTED' && exp.status !== 'APPROVED' && !exp.isFinancialPosted) {
      return [];
    }

    const code = `LED-2026-${seq.toString().padStart(6, '0')}`;
    const desc = exp.description || `সাধারণ ব্যয় (ভাউচার: ${exp.voucherNumber || exp.expenseCode})`;

    const entry: LedgerEntry = {
      id: `led-exp-${exp.id}`,
      organizationId: exp.organizationId,
      ledgerCode: code,
      sourceType: 'EXPENSE',
      sourceId: exp.id,
      sourceCode: exp.voucherNumber || exp.expenseCode,
      accountId: exp.accountId,
      fundId: exp.fundId,
      entryDate: exp.expenseDate,
      direction: 'OUT',
      amount: SafeMoney.fromMinorUnits(SafeMoney.toMinorUnits(exp.amount)),
      description: desc,
      version: exp.version || 1,
      postedAt: exp.postedAt || exp.approvedAt || exp.updatedAt || exp.createdAt,
      postedBy: exp.postedBy || exp.approvedBy || exp.createdBy,
      createdAt: exp.createdAt
    };

    return [entry];
  }

  /**
   * Project a Transfer entry into exactly TWO Ledger entries (Atomic Pair).
   * 1: Source Account OUT
   * 2: Destination Account IN
   * Fund is preserved across both entries (Source Fund === Destination Fund).
   */
  public static projectTransfer(
    trf: TransferEntry,
    seqStart: number
  ): LedgerEntry[] {
    if (trf.status !== 'POSTED' && !trf.isFinancialPosted) {
      return [];
    }

    const code1 = `LED-2026-${seqStart.toString().padStart(6, '0')}`;
    const code2 = `LED-2026-${(seqStart + 1).toString().padStart(6, '0')}`;
    const safeAmount = SafeMoney.fromMinorUnits(SafeMoney.toMinorUnits(trf.amount));

    const outEntry: LedgerEntry = {
      id: `led-trf-out-${trf.id}`,
      organizationId: trf.organizationId,
      ledgerCode: code1,
      sourceType: 'TRANSFER',
      sourceId: trf.id,
      sourceCode: trf.transferCode,
      accountId: trf.sourceAccountId,
      fundId: trf.fundId,
      entryDate: trf.transferDate,
      direction: 'OUT',
      amount: safeAmount,
      description: `হিসাব স্থানান্তর বহির্মুখী: ${trf.transferPurpose}`,
      version: trf.version || 1,
      postedAt: trf.postedAt || trf.approvedAt || trf.updatedAt || trf.createdAt,
      postedBy: trf.postedBy || trf.approvedBy || trf.createdBy,
      createdAt: trf.createdAt
    };

    const inEntry: LedgerEntry = {
      id: `led-trf-in-${trf.id}`,
      organizationId: trf.organizationId,
      ledgerCode: code2,
      sourceType: 'TRANSFER',
      sourceId: trf.id,
      sourceCode: trf.transferCode,
      accountId: trf.destinationAccountId,
      fundId: trf.fundId,
      entryDate: trf.transferDate,
      direction: 'IN',
      amount: safeAmount,
      description: `হিসাব স্থানান্তর অন্তর্মুখী: ${trf.transferPurpose}`,
      version: trf.version || 1,
      postedAt: trf.postedAt || trf.approvedAt || trf.updatedAt || trf.createdAt,
      postedBy: trf.postedBy || trf.approvedBy || trf.createdBy,
      createdAt: trf.createdAt
    };

    return [outEntry, inEntry];
  }

  /**
   * Project a Reversal entry into LedgerEntry (Phase 5.8)
   * Must be POSTED (or isFinancialPosted === true).
   * - Income Reversal: Original IN -> Reversal OUT (1 entry)
   * - Expense Reversal: Original OUT -> Reversal IN (1 entry)
   * - Opening Balance Reversal: Original IN -> Reversal OUT (1 entry)
   * - Transfer Reversal: Original Dest OUT + Original Source IN (2 entries, Atomic Pair)
   */
  public static projectReversal(
    rev: ReversalEntry,
    seqStart: number
  ): LedgerEntry[] {
    if (rev.status !== 'POSTED' && !rev.isFinancialPosted) {
      return [];
    }

    const code1 = `LED-2026-${seqStart.toString().padStart(6, '0')}`;
    const safeAmount = SafeMoney.fromMinorUnits(SafeMoney.toMinorUnits(rev.reversalAmount));
    const postedAt = rev.postedAt || rev.approvedAt || rev.updatedAt || rev.createdAt;
    const postedBy = rev.postedBy || rev.approvedBy || rev.createdBy;

    if (rev.sourceType === 'INCOME') {
      const entry: LedgerEntry = {
        id: `led-rev-inc-${rev.id}`,
        organizationId: rev.organizationId,
        ledgerCode: code1,
        sourceType: 'REVERSAL',
        sourceId: rev.id,
        sourceCode: rev.reversalCode,
        accountId: rev.accountId,
        fundId: rev.fundId,
        entryDate: rev.reversalDate,
        direction: 'OUT',
        amount: safeAmount,
        description: `আয় রিভার্সাল / বাতিল (মূল: ${rev.sourceCode})`,
        version: rev.version || 1,
        postedAt,
        postedBy,
        createdAt: rev.createdAt
      };
      return [entry];
    } else if (rev.sourceType === 'EXPENSE') {
      const entry: LedgerEntry = {
        id: `led-rev-exp-${rev.id}`,
        organizationId: rev.organizationId,
        ledgerCode: code1,
        sourceType: 'REVERSAL',
        sourceId: rev.id,
        sourceCode: rev.reversalCode,
        accountId: rev.accountId,
        fundId: rev.fundId,
        entryDate: rev.reversalDate,
        direction: 'IN',
        amount: safeAmount,
        description: `ব্যয় রিভার্সাল / ফেরত (মূল: ${rev.sourceCode})`,
        version: rev.version || 1,
        postedAt,
        postedBy,
        createdAt: rev.createdAt
      };
      return [entry];
    } else if (rev.sourceType === 'OPENING_BALANCE') {
      const entry: LedgerEntry = {
        id: `led-rev-ob-${rev.id}`,
        organizationId: rev.organizationId,
        ledgerCode: code1,
        sourceType: 'REVERSAL',
        sourceId: rev.id,
        sourceCode: rev.reversalCode,
        accountId: rev.accountId,
        fundId: rev.fundId,
        entryDate: rev.reversalDate,
        direction: 'OUT',
        amount: safeAmount,
        description: `প্রারম্ভিক স্থিতি রিভার্সাল / প্রত্যাহার (মূল: ${rev.sourceCode})`,
        version: rev.version || 1,
        postedAt,
        postedBy,
        createdAt: rev.createdAt
      };
      return [entry];
    } else if (rev.sourceType === 'TRANSFER') {
      const code2 = `LED-2026-${(seqStart + 1).toString().padStart(6, '0')}`;
      const destAccountId = rev.destinationAccountId || rev.accountId;

      const outEntry: LedgerEntry = {
        id: `led-rev-trf-out-${rev.id}`,
        organizationId: rev.organizationId,
        ledgerCode: code1,
        sourceType: 'REVERSAL',
        sourceId: rev.id,
        sourceCode: rev.reversalCode,
        accountId: destAccountId, // Original Destination Account OUT
        fundId: rev.fundId,
        entryDate: rev.reversalDate,
        direction: 'OUT',
        amount: safeAmount,
        description: `স্থানান্তর রিভার্সাল বহির্মুখী (গন্তব্য হিসাব হতে প্রত্যাহার): ${rev.sourceCode}`,
        version: rev.version || 1,
        postedAt,
        postedBy,
        createdAt: rev.createdAt
      };

      const inEntry: LedgerEntry = {
        id: `led-rev-trf-in-${rev.id}`,
        organizationId: rev.organizationId,
        ledgerCode: code2,
        sourceType: 'REVERSAL',
        sourceId: rev.id,
        sourceCode: rev.reversalCode,
        accountId: rev.accountId, // Original Source Account IN
        fundId: rev.fundId,
        entryDate: rev.reversalDate,
        direction: 'IN',
        amount: safeAmount,
        description: `স্থানান্তর রিভার্সাল অন্তর্মুখী (উৎস হিসাবে পুনঃজমা): ${rev.sourceCode}`,
        version: rev.version || 1,
        postedAt,
        postedBy,
        createdAt: rev.createdAt
      };

      return [outEntry, inEntry];
    }

    return [];
  }

  /**
   * Project all posted source events into a complete unified ledger
   */
  public static projectAll(
    organizationId: string,
    sources: SourceEventContainer
  ): LedgerEntry[] {
    const entries: LedgerEntry[] = [];
    let seq = 1;

    // Filter by organization
    const orgOBs = (sources.openingBalances || []).filter(o => o.organizationId === organizationId);
    const orgIncomes = (sources.incomes || []).filter(i => i.organizationId === organizationId);
    const orgExpenses = (sources.expenses || []).filter(e => e.organizationId === organizationId);
    const orgTransfers = (sources.transfers || []).filter(t => t.organizationId === organizationId);
    const orgReversals = (sources.reversals || []).filter(r => r.organizationId === organizationId);

    // 1. Opening Balances
    for (const ob of orgOBs) {
      const projected = this.projectOpeningBalance(ob, seq);
      if (projected.length > 0) {
        entries.push(...projected);
        seq += projected.length;
      }
    }

    // 2. Incomes
    for (const inc of orgIncomes) {
      const projected = this.projectIncome(inc, seq);
      if (projected.length > 0) {
        entries.push(...projected);
        seq += projected.length;
      }
    }

    // 3. Expenses
    for (const exp of orgExpenses) {
      const projected = this.projectExpense(exp, seq);
      if (projected.length > 0) {
        entries.push(...projected);
        seq += projected.length;
      }
    }

    // 4. Transfers (two entries each)
    for (const trf of orgTransfers) {
      const projected = this.projectTransfer(trf, seq);
      if (projected.length > 0) {
        entries.push(...projected);
        seq += projected.length;
      }
    }

    // 5. Reversals (Phase 5.8)
    for (const rev of orgReversals) {
      const projected = this.projectReversal(rev, seq);
      if (projected.length > 0) {
        entries.push(...projected);
        seq += projected.length;
      }
    }

    // Deterministic chronological ordering:
    // 1. entryDate
    // 2. source priority (OPENING_BALANCE -> INCOME -> TRANSFER -> EXPENSE -> REVERSAL)
    // 3. createdAt
    // 4. ledgerCode
    const sourcePriority: Record<LedgerSourceType, number> = {
      OPENING_BALANCE: 1,
      INCOME: 2,
      TRANSFER: 3,
      EXPENSE: 4,
      REVERSAL: 5
    };

    return entries.sort((a, b) => {
      if (a.entryDate !== b.entryDate) {
        return a.entryDate.localeCompare(b.entryDate);
      }
      const pA = sourcePriority[a.sourceType] || 99;
      const pB = sourcePriority[b.sourceType] || 99;
      if (pA !== pB) {
        return pA - pB;
      }
      if (a.createdAt !== b.createdAt) {
        return a.createdAt.localeCompare(b.createdAt);
      }
      return a.ledgerCode.localeCompare(b.ledgerCode);
    });
  }

  /**
   * Check if an account has sufficient balance before posting an OUT movement.
   */
  public static checkSufficientBalance(
    accountId: string,
    fundId: string | null,
    requiredAmount: number,
    existingEntries: LedgerEntry[]
  ): { isAllowed: boolean; availableBalance: number; shortfall: number } {
    let balance = 0;
    for (const entry of existingEntries) {
      if (entry.accountId === accountId) {
        if (!fundId || entry.fundId === fundId) {
          if (entry.direction === 'IN') {
            balance = SafeMoney.add(balance, entry.amount);
          } else {
            balance = SafeMoney.sub(balance, entry.amount);
          }
        }
      }
    }

    if (SafeMoney.cmp(balance, requiredAmount) < 0) {
      return {
        isAllowed: false,
        availableBalance: balance,
        shortfall: SafeMoney.sub(requiredAmount, balance)
      };
    }

    return {
      isAllowed: true,
      availableBalance: balance,
      shortfall: 0
    };
  }

  /**
   * Calculate derived Account-Fund Balances (The most granular balance view)
   */
  public static calculateAccountFundBalances(
    accounts: Account[],
    funds: Fund[],
    ledgerEntries: LedgerEntry[]
  ): AccountFundBalanceSummary[] {
    const accMap = new Map(accounts.map(a => [a.id, a]));
    const fndMap = new Map(funds.map(f => [f.id, f]));

    // Map: `${accountId}:${fundId}` -> summary
    const map = new Map<string, AccountFundBalanceSummary>();

    for (const entry of ledgerEntries) {
      const key = `${entry.accountId}:${entry.fundId}`;
      let item = map.get(key);
      if (!item) {
        const acc = accMap.get(entry.accountId);
        const fnd = fndMap.get(entry.fundId);
        item = {
          accountId: entry.accountId,
          accountCode: acc?.accountCode || entry.accountId,
          accountName: acc?.accountName || entry.accountId,
          accountType: acc?.accountType || 'cash',
          fundId: entry.fundId,
          fundCode: fnd?.fundCode || entry.fundId,
          fundName: fnd?.name || entry.fundId,
          totalIn: 0,
          totalOut: 0,
          balance: 0,
          entryCount: 0,
          lastPostedDate: entry.entryDate
        };
        map.set(key, item);
      }

      if (entry.direction === 'IN') {
        item.totalIn = SafeMoney.add(item.totalIn, entry.amount);
        item.balance = SafeMoney.add(item.balance, entry.amount);
      } else {
        item.totalOut = SafeMoney.add(item.totalOut, entry.amount);
        item.balance = SafeMoney.sub(item.balance, entry.amount);
      }
      item.entryCount++;
      if (entry.entryDate > (item.lastPostedDate || '')) {
        item.lastPostedDate = entry.entryDate;
      }
    }

    return Array.from(map.values()).sort((a, b) => a.accountCode.localeCompare(b.accountCode));
  }

  /**
   * Calculate derived Account Balances (Total position of an Account across all Funds)
   */
  public static calculateAccountBalances(
    accounts: Account[],
    funds: Fund[],
    ledgerEntries: LedgerEntry[]
  ): AccountBalanceSummary[] {
    const afBalances = this.calculateAccountFundBalances(accounts, funds, ledgerEntries);

    const result: AccountBalanceSummary[] = [];

    for (const acc of accounts) {
      const related = afBalances.filter(af => af.accountId === acc.id);
      let totalIn = 0;
      let totalOut = 0;
      let totalBalance = 0;

      const breakdown = related.map(af => {
        totalIn = SafeMoney.add(totalIn, af.totalIn);
        totalOut = SafeMoney.add(totalOut, af.totalOut);
        totalBalance = SafeMoney.add(totalBalance, af.balance);
        return {
          fundId: af.fundId,
          fundCode: af.fundCode,
          fundName: af.fundName,
          balance: af.balance,
          totalIn: af.totalIn,
          totalOut: af.totalOut,
          entryCount: af.entryCount
        };
      });

      result.push({
        accountId: acc.id,
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        accountType: acc.accountType,
        totalIn,
        totalOut,
        totalBalance,
        fundBreakdown: breakdown
      });
    }

    return result.sort((a, b) => a.accountCode.localeCompare(b.accountCode));
  }

  /**
   * Calculate derived Fund Balances (Total position of a Fund across all Accounts)
   */
  public static calculateFundBalances(
    accounts: Account[],
    funds: Fund[],
    ledgerEntries: LedgerEntry[]
  ): FundBalanceSummary[] {
    const afBalances = this.calculateAccountFundBalances(accounts, funds, ledgerEntries);

    const result: FundBalanceSummary[] = [];

    for (const fnd of funds) {
      const related = afBalances.filter(af => af.fundId === fnd.id);
      let totalIn = 0;
      let totalOut = 0;
      let totalBalance = 0;

      const breakdown = related.map(af => {
        totalIn = SafeMoney.add(totalIn, af.totalIn);
        totalOut = SafeMoney.add(totalOut, af.totalOut);
        totalBalance = SafeMoney.add(totalBalance, af.balance);
        return {
          accountId: af.accountId,
          accountCode: af.accountCode,
          accountName: af.accountName,
          accountType: af.accountType,
          balance: af.balance,
          totalIn: af.totalIn,
          totalOut: af.totalOut,
          entryCount: af.entryCount
        };
      });

      result.push({
        fundId: fnd.id,
        fundCode: fnd.fundCode,
        fundName: fnd.name,
        fundType: fnd.fundType,
        totalIn,
        totalOut,
        totalBalance,
        accountBreakdown: breakdown
      });
    }

    return result.sort((a, b) => a.fundCode.localeCompare(b.fundCode));
  }

  /**
   * Calculate chronological Running Balances for ledger register / statements
   */
  public static calculateRunningBalances(
    entries: LedgerEntry[]
  ): RunningBalanceEntry[] {
    let running = 0;
    return entries.map(entry => {
      if (entry.direction === 'IN') {
        running = SafeMoney.add(running, entry.amount);
      } else {
        running = SafeMoney.sub(running, entry.amount);
      }
      return {
        entry,
        runningBalance: running
      };
    });
  }

  /**
   * Calculate As-Of derived balances (filtering by entryDate <= targetDate)
   */
  public static calculateAsOfBalances(
    targetDate: string,
    accounts: Account[],
    funds: Fund[],
    ledgerEntries: LedgerEntry[]
  ): {
    accountBalances: AccountBalanceSummary[];
    fundBalances: FundBalanceSummary[];
    accountFundBalances: AccountFundBalanceSummary[];
  } {
    const filteredEntries = ledgerEntries.filter(e => e.entryDate <= targetDate);
    return {
      accountBalances: this.calculateAccountBalances(accounts, funds, filteredEntries),
      fundBalances: this.calculateFundBalances(accounts, funds, filteredEntries),
      accountFundBalances: this.calculateAccountFundBalances(accounts, funds, filteredEntries)
    };
  }

  /**
   * Generate Financial Statement summary derived purely from posted ledger entries
   */
  public static generateFinancialStatement(
    dateFrom: string,
    dateTo: string,
    accounts: Account[],
    funds: Fund[],
    ledgerEntries: LedgerEntry[]
  ): FinancialStatementSummary {
    const priorEntries = ledgerEntries.filter(e => e.entryDate < dateFrom);
    const periodEntries = ledgerEntries.filter(e => e.entryDate >= dateFrom && e.entryDate <= dateTo);

    // 1. Opening Position (all entries before dateFrom)
    let openingPosition = 0;
    for (const e of priorEntries) {
      if (e.direction === 'IN') {
        openingPosition = SafeMoney.add(openingPosition, e.amount);
      } else {
        openingPosition = SafeMoney.sub(openingPosition, e.amount);
      }
    }

    // 2. Period IN & OUT
    let periodIn = 0;
    let periodOut = 0;

    const sourceStats: Record<LedgerSourceType, { inAmount: number; outAmount: number; inCount: number; outCount: number }> = {
      OPENING_BALANCE: { inAmount: 0, outAmount: 0, inCount: 0, outCount: 0 },
      INCOME: { inAmount: 0, outAmount: 0, inCount: 0, outCount: 0 },
      EXPENSE: { inAmount: 0, outAmount: 0, inCount: 0, outCount: 0 },
      TRANSFER: { inAmount: 0, outAmount: 0, inCount: 0, outCount: 0 },
      REVERSAL: { inAmount: 0, outAmount: 0, inCount: 0, outCount: 0 }
    };

    for (const e of periodEntries) {
      if (e.direction === 'IN') {
        periodIn = SafeMoney.add(periodIn, e.amount);
        sourceStats[e.sourceType].inAmount = SafeMoney.add(sourceStats[e.sourceType].inAmount, e.amount);
        sourceStats[e.sourceType].inCount++;
      } else {
        periodOut = SafeMoney.add(periodOut, e.amount);
        sourceStats[e.sourceType].outAmount = SafeMoney.add(sourceStats[e.sourceType].outAmount, e.amount);
        sourceStats[e.sourceType].outCount++;
      }
    }

    const closingPosition = SafeMoney.sub(SafeMoney.add(openingPosition, periodIn), periodOut);

    // Source breakdown
    const sourceBreakdown = [
      {
        sourceType: 'OPENING_BALANCE' as LedgerSourceType,
        sourceLabelBn: 'প্রারম্ভিক স্থিতি (Opening Balance)',
        direction: 'IN' as LedgerDirection,
        totalAmount: sourceStats.OPENING_BALANCE.inAmount,
        entryCount: sourceStats.OPENING_BALANCE.inCount
      },
      {
        sourceType: 'INCOME' as LedgerSourceType,
        sourceLabelBn: 'আয় প্রাপ্তি (Income Receipt)',
        direction: 'IN' as LedgerDirection,
        totalAmount: sourceStats.INCOME.inAmount,
        entryCount: sourceStats.INCOME.inCount
      },
      {
        sourceType: 'EXPENSE' as LedgerSourceType,
        sourceLabelBn: 'সাধারণ ব্যয় (Expense Disbursement)',
        direction: 'OUT' as LedgerDirection,
        totalAmount: sourceStats.EXPENSE.outAmount,
        entryCount: sourceStats.EXPENSE.outCount
      },
      {
        sourceType: 'TRANSFER' as LedgerSourceType,
        sourceLabelBn: 'হিসাব স্থানান্তর (Transfer In / Out)',
        direction: 'IN' as LedgerDirection,
        totalAmount: sourceStats.TRANSFER.inAmount, // equal to outAmount
        entryCount: sourceStats.TRANSFER.inCount + sourceStats.TRANSFER.outCount
      },
      {
        sourceType: 'REVERSAL' as LedgerSourceType,
        sourceLabelBn: 'রিভার্সাল ও সমন্বয় (Reversals & Corrections)',
        direction: 'OUT' as LedgerDirection,
        totalAmount: SafeMoney.add(sourceStats.REVERSAL.inAmount, sourceStats.REVERSAL.outAmount),
        entryCount: sourceStats.REVERSAL.inCount + sourceStats.REVERSAL.outCount
      }
    ];

    // Account Breakdown
    const accountBreakdown = accounts.map(acc => {
      let accPrior = 0;
      let accIn = 0;
      let accOut = 0;

      for (const e of priorEntries) {
        if (e.accountId === acc.id) {
          accPrior = e.direction === 'IN' ? SafeMoney.add(accPrior, e.amount) : SafeMoney.sub(accPrior, e.amount);
        }
      }
      for (const e of periodEntries) {
        if (e.accountId === acc.id) {
          if (e.direction === 'IN') accIn = SafeMoney.add(accIn, e.amount);
          else accOut = SafeMoney.add(accOut, e.amount);
        }
      }

      return {
        accountId: acc.id,
        accountName: acc.accountName,
        openingBalance: accPrior,
        totalIn: accIn,
        totalOut: accOut,
        closingBalance: SafeMoney.sub(SafeMoney.add(accPrior, accIn), accOut)
      };
    });

    // Fund Breakdown
    const fundBreakdown = funds.map(fnd => {
      let fndPrior = 0;
      let fndIn = 0;
      let fndOut = 0;

      for (const e of priorEntries) {
        if (e.fundId === fnd.id) {
          fndPrior = e.direction === 'IN' ? SafeMoney.add(fndPrior, e.amount) : SafeMoney.sub(fndPrior, e.amount);
        }
      }
      for (const e of periodEntries) {
        if (e.fundId === fnd.id) {
          if (e.direction === 'IN') fndIn = SafeMoney.add(fndIn, e.amount);
          else fndOut = SafeMoney.add(fndOut, e.amount);
        }
      }

      return {
        fundId: fnd.id,
        fundName: fnd.name,
        openingBalance: fndPrior,
        totalIn: fndIn,
        totalOut: fndOut,
        closingBalance: SafeMoney.sub(SafeMoney.add(fndPrior, fndIn), fndOut)
      };
    });

    return {
      dateFrom,
      dateTo,
      openingPosition,
      totalIn: periodIn,
      totalOut: periodOut,
      closingPosition,
      sourceBreakdown,
      accountBreakdown,
      fundBreakdown
    };
  }

  /**
   * Run automated Reconciliation Checks (7 checks A to G)
   */
  public static reconcile(
    organizationId: string,
    accounts: Account[],
    funds: Fund[],
    ledgerEntries: LedgerEntry[],
    sources: SourceEventContainer
  ): LedgerReconciliationReport {
    const checks: ReconciliationCheckResult[] = [];

    // Filter by organization
    const orgAccounts = accounts.filter(a => a.organizationId === organizationId);
    const orgFunds = funds.filter(f => f.organizationId === organizationId);
    const orgEntries = ledgerEntries.filter(e => e.organizationId === organizationId);

    const afBalances = this.calculateAccountFundBalances(orgAccounts, orgFunds, orgEntries);
    const accBalances = this.calculateAccountBalances(orgAccounts, orgFunds, orgEntries);
    const fndBalances = this.calculateFundBalances(orgAccounts, orgFunds, orgEntries);

    const totalAcc = accBalances.reduce((sum, a) => SafeMoney.add(sum, a.totalBalance), 0);
    const totalFnd = fndBalances.reduce((sum, f) => SafeMoney.add(sum, f.totalBalance), 0);
    const totalAf = afBalances.reduce((sum, af) => SafeMoney.add(sum, af.balance), 0);

    // Check A: Account total = sum(Account-Fund totals)
    const diffA = SafeMoney.abs(SafeMoney.sub(totalAcc, totalAf));
    const isPassedA = SafeMoney.isZero(diffA);
    checks.push({
      checkId: 'CHK-A',
      checkNameBn: 'হিসাব বনাম হিসাব-তহবিল স্থিতি সমতা (Check A)',
      isPassed: isPassedA,
      detailsBn: isPassedA
        ? `উভয় স্থিতি হুবহু মিলেছে (৳${totalAcc})`
        : `অমিল শনাক্ত হয়েছে: হিসাব স্থিতি ৳${totalAcc}, কিন্তু হিসাব-তহবিল স্থিতি ৳${totalAf}`,
      expectedValue: totalAf,
      actualValue: totalAcc,
      discrepancy: diffA
    });

    // Check B: Fund total = sum(Account-Fund totals)
    const diffB = SafeMoney.abs(SafeMoney.sub(totalFnd, totalAf));
    const isPassedB = SafeMoney.isZero(diffB);
    checks.push({
      checkId: 'CHK-B',
      checkNameBn: 'তহবিল বনাম হিসাব-তহবিল স্থিতি সমতা (Check B)',
      isPassed: isPassedB,
      detailsBn: isPassedB
        ? `উভয় স্থিতি হুবহু মিলেছে (৳${totalFnd})`
        : `অমিল শনাক্ত হয়েছে: তহবিল স্থিতি ৳${totalFnd}, কিন্তু হিসাব-তহবিল স্থিতি ৳${totalAf}`,
      expectedValue: totalAf,
      actualValue: totalFnd,
      discrepancy: diffB
    });

    // Check C: Ledger source posting count = expected source posting count
    const postedOBs = (sources.openingBalances || []).filter(o => o.organizationId === organizationId && (o.status === 'POSTED' || o.isFinancialPosted));
    const postedIncs = (sources.incomes || []).filter(i => i.organizationId === organizationId && (i.status === 'POSTED' || i.status === 'APPROVED' || i.isFinancialPosted));
    const postedExps = (sources.expenses || []).filter(e => e.organizationId === organizationId && (e.status === 'POSTED' || e.status === 'APPROVED' || e.isFinancialPosted));
    const postedTrfs = (sources.transfers || []).filter(t => t.organizationId === organizationId && (t.status === 'POSTED' || t.isFinancialPosted));
    const postedRevs = (sources.reversals || []).filter(r => r.organizationId === organizationId && (r.status === 'POSTED' || r.isFinancialPosted));

    const expectedSourceCount = postedOBs.length + postedIncs.length + postedExps.length + postedTrfs.length + postedRevs.length;
    const uniqueSourceIdsInLedger = new Set(orgEntries.map(e => `${e.sourceType}:${e.sourceId}`)).size;

    const diffC = expectedSourceCount - uniqueSourceIdsInLedger;
    checks.push({
      checkId: 'CHK-C',
      checkNameBn: 'পোস্টকৃত উৎস ঘটনা বনাম লেজার এন্ট্রি গণনা (Check C)',
      isPassed: diffC === 0,
      detailsBn: diffC === 0
        ? `সকল পোস্টকৃত উৎস ঘটনা লেজারে প্রতিফলিত হয়েছে (মোট ${expectedSourceCount}টি ঘটনা)`
        : `গণনায় গরমিল: পোস্টকৃত উৎস ${expectedSourceCount}টি, কিন্তু লেজারে উপস্থিত ${uniqueSourceIdsInLedger}টি`,
      expectedValue: expectedSourceCount,
      actualValue: uniqueSourceIdsInLedger,
      discrepancy: diffC
    });

    // Check D: Transfer / Transfer Reversal: OUT amount = IN amount
    const trfOutAmount = orgEntries.filter(e => (e.sourceType === 'TRANSFER' || (e.sourceType === 'REVERSAL' && e.description.includes('স্থানান্তর'))) && e.direction === 'OUT').reduce((s, e) => SafeMoney.add(s, e.amount), 0);
    const trfInAmount = orgEntries.filter(e => (e.sourceType === 'TRANSFER' || (e.sourceType === 'REVERSAL' && e.description.includes('স্থানান্তর'))) && e.direction === 'IN').reduce((s, e) => SafeMoney.add(s, e.amount), 0);
    const diffD = SafeMoney.abs(SafeMoney.sub(trfOutAmount, trfInAmount));
    const isPassedD = SafeMoney.isZero(diffD);
    checks.push({
      checkId: 'CHK-D',
      checkNameBn: 'স্থানান্তর অন্তর্মুখী ও বহির্মুখী সমতা (Check D)',
      isPassed: isPassedD,
      detailsBn: isPassedD
        ? `স্থানান্তরের উভয় দিক সমান (৳${trfOutAmount})`
        : `স্থানান্তরে ভারসাম্যহীনতা: বহির্মুখী ৳${trfOutAmount} বনাম অন্তর্মুখী ৳${trfInAmount}`,
      expectedValue: trfOutAmount,
      actualValue: trfInAmount,
      discrepancy: diffD
    });

    // Check E: No duplicate organization + sourceType + sourceId (+ direction for transfer/reversal)
    const seenPostingKeys = new Set<string>();
    let duplicateCount = 0;
    for (const e of orgEntries) {
      const pKey = `${e.organizationId}:${e.sourceType}:${e.sourceId}:${e.direction}`;
      if (seenPostingKeys.has(pKey)) {
        duplicateCount++;
      } else {
        seenPostingKeys.add(pKey);
      }
    }
    checks.push({
      checkId: 'CHK-E',
      checkNameBn: 'ডুপ্লিকেট পোস্টিং প্রতিরোধ ও আইডেমপোটেন্সি (Check E)',
      isPassed: duplicateCount === 0,
      detailsBn: duplicateCount === 0
        ? 'কোনো ডুপ্লিকেট লেজার পোস্টিং পাওয়া যায়নি।'
        : `সতর্কতা: ${duplicateCount}টি ডুপ্লিকেট পোস্টিং শনাক্ত হয়েছে!`,
      expectedValue: 0,
      actualValue: duplicateCount,
      discrepancy: duplicateCount
    });

    // Check F: No invalid cross-organization ledger reference
    const crossOrgCount = orgEntries.filter(e => e.organizationId !== organizationId).length;
    checks.push({
      checkId: 'CHK-F',
      checkNameBn: 'মাল্টি-টেন্যান্ট অর্গানাইজেশন আইসোলেশন (Check F)',
      isPassed: crossOrgCount === 0,
      detailsBn: crossOrgCount === 0
        ? 'সকল লেজার এন্ট্রি বর্তমান অর্গানাইজেশনের সীমানায় সংরক্ষিত।'
        : `গুরুতর ত্রুটি: ${crossOrgCount}টি ক্রস-অর্গানাইজেশন এন্ট্রি পাওয়া গেছে!`,
      expectedValue: 0,
      actualValue: crossOrgCount,
      discrepancy: crossOrgCount
    });

    // Check G: No invalid Account–Fund association
    const accMap = new Map(orgAccounts.map(a => [a.id, a]));
    let invalidAfAssociationCount = 0;
    for (const e of orgEntries) {
      const acc = accMap.get(e.accountId);
      if (acc && acc.associatedFundIds && acc.associatedFundIds.length > 0) {
        if (!acc.associatedFundIds.includes(e.fundId)) {
          invalidAfAssociationCount++;
        }
      }
    }
    checks.push({
      checkId: 'CHK-G',
      checkNameBn: 'হিসাব ও তহবিল সংগতি যাচাই (Check G)',
      isPassed: invalidAfAssociationCount === 0,
      detailsBn: invalidAfAssociationCount === 0
        ? 'সকল এন্ট্রি অনুমোদিত তহবিল-হিসাব সংগতি অনুযায়ী সংরক্ষিত।'
        : `ত্রুটি: ${invalidAfAssociationCount}টি এন্ট্রিতে অমিল তহবিল পাওয়া গেছে!`,
      expectedValue: 0,
      actualValue: invalidAfAssociationCount,
      discrepancy: invalidAfAssociationCount
    });

    const isAllPassed = checks.every(c => c.isPassed);

    return {
      timestamp: new Date().toISOString(),
      organizationId,
      overallStatus: isAllPassed ? 'BALANCED' : 'RECONCILIATION_ERROR',
      checks,
      totalAccountBalances: totalAcc,
      totalFundBalances: totalFnd,
      totalAccountFundBalances: totalAf,
      postedSourceCount: expectedSourceCount,
      ledgerEntriesCount: orgEntries.length
    };
  }

  /**
   * Rebuild simulation: reconstruct derived ledger projection purely from POSTED sources.
   * Original source events are NEVER modified or deleted.
   */
  public static rebuildLedger(
    organizationId: string,
    sources: SourceEventContainer,
    accounts: Account[],
    funds: Fund[]
  ): {
    rebuiltEntries: LedgerEntry[];
    rebuildResult: LedgerRebuildResult;
  } {
    const timestamp = new Date().toISOString();
    const previousEntries = this.projectAll(organizationId, sources);

    // Reconstruct
    const rebuiltEntries = this.projectAll(organizationId, sources);

    // Reconcile
    const report = this.reconcile(organizationId, accounts, funds, rebuiltEntries, sources);

    const isSuccess = report.overallStatus === 'BALANCED';

    const result: LedgerRebuildResult = {
      timestamp,
      organizationId,
      previousEntryCount: previousEntries.length,
      newEntryCount: rebuiltEntries.length,
      sourcesProcessed: report.postedSourceCount,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      reconciliationPassed: isSuccess,
      messageBn: isSuccess
        ? `লেজার সফলভাবে পুনর্গঠিত হয়েছে। মোট ${rebuiltEntries.length}টি এন্ট্রি সমন্বিত ও পুনর্মিলিত।`
        : 'লেজার পুনর্গঠনে অসঙ্গতি পাওয়া গেছে; পুনর্মিলন ব্যর্থ।'
    };

    return {
      rebuiltEntries,
      rebuildResult: result
    };
  }
}
