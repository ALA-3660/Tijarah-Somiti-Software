/**
 * TSS Safe Money Utility (TSS-P5.7-HARDEN-2026)
 * Centralized Financial Decimal & Integer Minor-Unit Arithmetic Engine.
 *
 * Principle:
 * - 1 BDT = 100 Minor Units (Poisha)
 * - All financial additions, subtractions, summations, comparisons, and balances
 *   operate strictly on 64-bit integer minor units, eliminating JavaScript floating-point artifacts.
 * - External UI and API contracts retain standard BDT `number` without breakage.
 */

export class SafeMoney {
  private static readonly SCALE = 100;

  /**
   * Convert monetary amount in BDT to integer minor units (Poisha).
   * E.g., 100.50 -> 10050
   */
  public static toMinorUnits(amount: number): number {
    if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
      return 0;
    }
    return Math.round(amount * SafeMoney.SCALE);
  }

  /**
   * Convert integer minor units back to standard BDT representation.
   * E.g., 10050 -> 100.5
   */
  public static fromMinorUnits(minorUnits: number): number {
    if (typeof minorUnits !== 'number' || isNaN(minorUnits) || !isFinite(minorUnits)) {
      return 0;
    }
    return minorUnits / SafeMoney.SCALE;
  }

  /**
   * Safe addition of two monetary amounts
   */
  public static add(a: number, b: number): number {
    const minorA = SafeMoney.toMinorUnits(a);
    const minorB = SafeMoney.toMinorUnits(b);
    return SafeMoney.fromMinorUnits(minorA + minorB);
  }

  /**
   * Safe subtraction of two monetary amounts (a - b)
   */
  public static sub(a: number, b: number): number {
    const minorA = SafeMoney.toMinorUnits(a);
    const minorB = SafeMoney.toMinorUnits(b);
    return SafeMoney.fromMinorUnits(minorA - minorB);
  }

  /**
   * Safe multiplication of a monetary amount by a scalar factor
   */
  public static mul(amount: number, factor: number): number {
    const minor = SafeMoney.toMinorUnits(amount);
    return SafeMoney.fromMinorUnits(Math.round(minor * factor));
  }

  /**
   * Safe sum of an array of monetary amounts
   */
  public static sum(amounts: number[]): number {
    let totalMinor = 0;
    for (const amt of amounts) {
      totalMinor += SafeMoney.toMinorUnits(amt);
    }
    return SafeMoney.fromMinorUnits(totalMinor);
  }

  /**
   * Compare two monetary amounts.
   * Returns:
   *  -1 if a < b
   *   0 if a === b (equal to nearest minor unit)
   *   1 if a > b
   */
  public static cmp(a: number, b: number): -1 | 0 | 1 {
    const minorA = SafeMoney.toMinorUnits(a);
    const minorB = SafeMoney.toMinorUnits(b);
    if (minorA < minorB) return -1;
    if (minorA > minorB) return 1;
    return 0;
  }

  /**
   * Check equality of two monetary amounts within minor unit precision.
   */
  public static eq(a: number, b: number): boolean {
    return SafeMoney.cmp(a, b) === 0;
  }

  /**
   * Check if amount is strictly positive (> 0)
   */
  public static isPositive(amount: number): boolean {
    return SafeMoney.toMinorUnits(amount) > 0;
  }

  /**
   * Check if amount is zero (= 0)
   */
  public static isZero(amount: number): boolean {
    return SafeMoney.toMinorUnits(amount) === 0;
  }

  /**
   * Absolute value of monetary amount
   */
  public static abs(amount: number): number {
    return SafeMoney.fromMinorUnits(Math.abs(SafeMoney.toMinorUnits(amount)));
  }

  /**
   * Standard 2-decimal formatting string: "100.50"
   */
  public static formatFixed(amount: number): string {
    const clean = SafeMoney.fromMinorUnits(SafeMoney.toMinorUnits(amount));
    return clean.toFixed(2);
  }
}
