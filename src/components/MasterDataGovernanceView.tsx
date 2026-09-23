import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  History,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Layers,
  ArrowRight,
  UserCheck,
  Lock,
  ChevronDown,
  ChevronRight,
  Database,
  Building2,
  Calendar,
  X,
  FileText,
  SlidersHorizontal,
  FolderTree,
  Coins,
  Users,
  Info
} from 'lucide-react';
import {
  OrganizationContext,
  MasterDataChangeHistoryRecord,
  MasterDataEntityType,
  GovernanceActionType,
  BulkGovernanceItem,
  BulkGovernanceResult,
  GovernanceFilterCriteria
} from '../types';

interface MasterDataGovernanceViewProps {
  organization: OrganizationContext;
  onRefreshOrgData?: () => void;
}

// Initial Sample Audit History Scoped to Organizations
const INITIAL_GOVERNANCE_HISTORY: MasterDataChangeHistoryRecord[] = [
  {
    id: 'gov-hist-001',
    organizationId: 'demo-org-khurushkul',
    entityType: 'head',
    entityId: 'head-001',
    entityCode: 'INC-001',
    entityName: 'ভর্তি ফি ও সদস্যপদ রেজিস্ট্রেশন',
    action: 'HEAD_CREATED',
    actorUserId: 'usr-admin-01',
    actorName: 'মুফতি আলাউদ্দীন (সুপার অ্যাডমিন)',
    actorRole: 'Super Admin',
    timestamp: '2026-09-18T10:30:00.000Z',
    reason: 'সমিতি উদ্বোধনে মূল আয়ের খাত প্রারম্ভিক কনফিগারেশন',
    effectiveFrom: '2026-09-18',
    beforeState: undefined,
    afterState: {
      headCode: 'INC-001',
      name: 'ভর্তি ফি ও সদস্যপদ রেজিস্ট্রেশন',
      headType: 'income',
      level: 1,
      status: 'active',
      isSystemDefined: true
    },
    changedFields: ['id', 'headCode', 'name', 'headType', 'level', 'status'],
    referenceId: 'REF-INIT-2026-01'
  },
  {
    id: 'gov-hist-002',
    organizationId: 'demo-org-khurushkul',
    entityType: 'head',
    entityId: 'head-002',
    entityCode: 'EXP-001',
    entityName: 'অফিস ও স্টেশনারি পরিচালন ব্যয়',
    action: 'HEAD_CREATED',
    actorUserId: 'usr-admin-01',
    actorName: 'মুফতি আলাউদ্দীন (সুপার অ্যাডমিন)',
    actorRole: 'Super Admin',
    timestamp: '2026-09-18T10:32:00.000Z',
    reason: 'দাপ্তরিক কার্যক্রম নির্বাহের প্রধান ব্যয়ের খাত অনুমোদন',
    effectiveFrom: '2026-09-18',
    beforeState: undefined,
    afterState: {
      headCode: 'EXP-001',
      name: 'অফিস ও স্টেশনারি পরিচালন ব্যয়',
      headType: 'expense',
      level: 1,
      status: 'active',
      isSystemDefined: true
    },
    changedFields: ['id', 'headCode', 'name', 'headType', 'level', 'status'],
    referenceId: 'REF-INIT-2026-02'
  },
  {
    id: 'gov-hist-003',
    organizationId: 'demo-org-khurushkul',
    entityType: 'fund',
    entityId: 'fnd-001',
    entityCode: 'FND-001',
    entityName: 'সাধারণ তহবিল',
    action: 'FUND_CREATED',
    actorUserId: 'usr-admin-01',
    actorName: 'মুফতি আলাউদ্দীন (সুপার অ্যাডমিন)',
    actorRole: 'Super Admin',
    timestamp: '2026-09-19T09:15:00.000Z',
    reason: 'সমিতির সাধারণ দৈনন্দিন আর্থিক উদ্দেশ্য ধারণে তহবিল সৃষ্টি',
    effectiveFrom: '2026-09-19',
    beforeState: undefined,
    afterState: {
      fundCode: 'FND-001',
      name: 'সাধারণ তহবিল',
      fundType: 'general',
      status: 'active',
      isSystemDefined: true
    },
    changedFields: ['id', 'fundCode', 'name', 'fundType', 'status'],
    referenceId: 'REF-FND-INIT-01'
  },
  {
    id: 'gov-hist-004',
    organizationId: 'demo-org-khurushkul',
    entityType: 'fund',
    entityId: 'fnd-002',
    entityCode: 'FND-002',
    entityName: 'শেয়ার মূলধন তহবিল',
    action: 'FUND_CREATED',
    actorUserId: 'usr-admin-01',
    actorName: 'মুফতি আলাউদ্দীন (সুপার অ্যাডমিন)',
    actorRole: 'Super Admin',
    timestamp: '2026-09-19T09:18:00.000Z',
    reason: 'সদস্যদের স্থায়ী ইকুইটি মূলধনের জন্য তহবিল সংরক্ষণ',
    effectiveFrom: '2026-09-19',
    beforeState: undefined,
    afterState: {
      fundCode: 'FND-002',
      name: 'শেয়ার মূলধন তহবিল',
      fundType: 'share',
      status: 'active',
      isSystemDefined: true
    },
    changedFields: ['id', 'fundCode', 'name', 'fundType', 'status'],
    referenceId: 'REF-FND-INIT-02'
  },
  {
    id: 'gov-hist-005',
    organizationId: 'demo-org-khurushkul',
    entityType: 'fund',
    entityId: 'fnd-004',
    entityCode: 'FND-004',
    entityName: 'উপকূলীয় মৎস্য চাষ প্রকল্প তহবিল',
    action: 'FUND_CREATED',
    actorUserId: 'usr-manager-02',
    actorName: 'মাওলানা মাহমুদ হাসান (ম্যানেজার)',
    actorRole: 'Manager',
    timestamp: '2026-09-20T11:40:00.000Z',
    reason: '২০২৬-২৭ অর্থবছরের বাণিজ্যিক প্রকল্প অনুমোদন',
    effectiveFrom: '2026-09-20',
    beforeState: undefined,
    afterState: {
      fundCode: 'FND-004',
      name: 'উপকূলীয় মৎস্য চাষ প্রকল্প তহবিল',
      fundType: 'project',
      status: 'active',
      isSystemDefined: false
    },
    changedFields: ['id', 'fundCode', 'name', 'fundType', 'status'],
    referenceId: 'REF-PROJ-FND-01'
  },
  {
    id: 'gov-hist-006',
    organizationId: 'demo-org-khurushkul',
    entityType: 'head',
    entityId: 'head-005',
    entityCode: 'INC-003',
    entityName: 'পুরাতন রসিদ বই বিক্রয়',
    action: 'HEAD_DEACTIVATED',
    actorUserId: 'usr-manager-02',
    actorName: 'মাওলানা মাহমুদ হাসান (ম্যানেজার)',
    actorRole: 'Manager',
    timestamp: '2026-09-21T14:20:00.000Z',
    reason: 'ডিজিটাল রসিদ ব্যবস্থা চালুর ফলে হস্তলিখিত রসিদ বই বিক্রয় খাত স্থগিত',
    effectiveFrom: '2026-09-21',
    beforeState: {
      headCode: 'INC-003',
      name: 'পুরাতন রসিদ বই বিক্রয়',
      status: 'active'
    },
    afterState: {
      headCode: 'INC-003',
      name: 'পুরাতন রসিদ বই বিক্রয়',
      status: 'inactive'
    },
    changedFields: ['status'],
    referenceId: 'REF-DEACT-01'
  },
  {
    id: 'gov-hist-007',
    organizationId: 'demo-org-khurushkul',
    entityType: 'fund',
    entityId: 'fnd-005',
    entityCode: 'FND-005',
    entityName: 'পুরাতন কম্পিউটার সরঞ্জাম ক্রয় তহবিল',
    action: 'FUND_ARCHIVED',
    actorUserId: 'usr-admin-01',
    actorName: 'মুফতি আলাউদ্দীন (সুপার অ্যাডমিন)',
    actorRole: 'Super Admin',
    timestamp: '2026-09-22T08:10:00.000Z',
    reason: 'ক্রয় কার্যক্রম সম্পূর্ণ শেষ হওয়ায় তহবিলটি স্থায়ীভাবে আর্কাইভ করা হলো',
    effectiveFrom: '2026-09-22',
    beforeState: {
      fundCode: 'FND-005',
      name: 'পুরাতন কম্পিউটার সরঞ্জাম ক্রয় তহবিল',
      status: 'inactive'
    },
    afterState: {
      fundCode: 'FND-005',
      name: 'পুরাতন কম্পিউটার সরঞ্জাম ক্রয় তহবিল',
      status: 'archived'
    },
    changedFields: ['status'],
    referenceId: 'REF-ARCH-01'
  },
  // Al-Falah Organization Sample History
  {
    id: 'gov-hist-101',
    organizationId: 'org-alfalah-01',
    entityType: 'head',
    entityId: 'alfalah-head-01',
    entityCode: 'INC-001',
    entityName: 'শেয়ার আবেদন ও ভর্তি ফি',
    action: 'HEAD_CREATED',
    actorUserId: 'usr-alfalah-admin',
    actorName: 'উসমান গণি (অ্যাডমিন)',
    actorRole: 'Admin',
    timestamp: '2026-09-17T11:00:00.000Z',
    reason: 'আল-ফালাহ সমিতির প্রাথমিক আয়ের খাত প্রস্তুত',
    effectiveFrom: '2026-09-17',
    beforeState: undefined,
    afterState: {
      headCode: 'INC-001',
      name: 'শেয়ার আবেদন ও ভর্তি ফি',
      status: 'active'
    },
    changedFields: ['headCode', 'name', 'status']
  }
];

// Sample Master Data pool for Bulk operations demo
const INITIAL_BULK_ITEMS: BulkGovernanceItem[] = [
  { id: 'b-01', code: 'INC-001', name: 'ভর্তি ফি ও সদস্যপদ রেজিস্ট্রেশন', entityType: 'head', status: 'active', isSystemDefined: true },
  { id: 'b-02', code: 'EXP-001', name: 'অফিস ও স্টেশনারি পরিচালন ব্যয়', entityType: 'head', status: 'active', isSystemDefined: true },
  { id: 'b-03', code: 'INC-004', name: 'প্রকল্প কনসালটেন্সি ফি', entityType: 'head', status: 'active', isSystemDefined: false },
  { id: 'b-04', code: 'EXP-005', name: 'অস্থায়ী মেহমানদারি খরচ', entityType: 'head', status: 'inactive', isSystemDefined: false },
  { id: 'b-05', code: 'FND-001', name: 'সাধারণ তহবিল', entityType: 'fund', status: 'active', isSystemDefined: true },
  { id: 'b-06', code: 'FND-002', name: 'শেয়ার মূলধন তহবিল', entityType: 'fund', status: 'active', isSystemDefined: true },
  { id: 'b-07', code: 'FND-004', name: 'উপকূলীয় মৎস্য চাষ প্রকল্প তহবিল', entityType: 'fund', status: 'active', isSystemDefined: false },
  { id: 'b-08', code: 'FND-005', name: 'পুরাতন সরঞ্জাম ক্রয় তহবিল', entityType: 'fund', status: 'inactive', isSystemDefined: false },
  { id: 'b-09', code: 'MCD-001', name: 'সাধারণ সদস্য শ্রেণি', entityType: 'member_classification', status: 'active', isSystemDefined: true },
  { id: 'b-10', code: 'MCD-002', name: 'আজীবন দাতা সদস্য শ্রেণি', entityType: 'member_classification', status: 'active', isSystemDefined: false }
];

export const MasterDataGovernanceView: React.FC<MasterDataGovernanceViewProps> = ({
  organization,
  onRefreshOrgData
}) => {
  // State
  const [historyList, setHistoryList] = useState<MasterDataChangeHistoryRecord[]>(INITIAL_GOVERNANCE_HISTORY);
  const [bulkPool, setBulkPool] = useState<BulkGovernanceItem[]>(INITIAL_BULK_ITEMS);
  const [selectedBulkIds, setSelectedBulkIds] = useState<string[]>([]);
  
  // Filter Criteria
  const [filters, setFilters] = useState<GovernanceFilterCriteria>({
    searchQuery: '',
    entityType: 'all',
    action: 'all',
    actorId: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // UI Modals & Views
  const [selectedRecord, setSelectedRecord] = useState<MasterDataChangeHistoryRecord | null>(null);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<'active' | 'inactive' | 'archived'>('inactive');
  const [bulkReason, setBulkReason] = useState<string>('');
  const [bulkEffectiveDate, setBulkEffectiveDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bulkResult, setBulkResult] = useState<BulkGovernanceResult | null>(null);

  // Role Simulation for RBAC Test
  const [simulatedRole, setSimulatedRole] = useState<'admin' | 'manager' | 'accountant' | 'viewer'>('admin');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Pagination & Sorting
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<'timestamp' | 'entityCode' | 'entityName' | 'action' | 'actorName'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Multi-tenant Scoped History Records
  const orgScopedHistory = useMemo(() => {
    return historyList.filter((item) => item.organizationId === organization.id);
  }, [historyList, organization.id]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    return orgScopedHistory.filter((item) => {
      // Search
      if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const codeMatch = item.entityCode.toLowerCase().includes(q);
        const nameMatch = item.entityName.toLowerCase().includes(q);
        const actorMatch = item.actorName.toLowerCase().includes(q);
        const reasonMatch = item.reason?.toLowerCase().includes(q) || false;
        const refMatch = item.referenceId?.toLowerCase().includes(q) || false;
        if (!codeMatch && !nameMatch && !actorMatch && !reasonMatch && !refMatch) {
          return false;
        }
      }

      // Entity Type
      if (filters.entityType && filters.entityType !== 'all') {
        if (item.entityType !== filters.entityType) return false;
      }

      // Action
      if (filters.action && filters.action !== 'all') {
        if (!item.action.includes(filters.action)) return false;
      }

      // Actor
      if (filters.actorId && filters.actorId !== 'all') {
        if (item.actorUserId !== filters.actorId) return false;
      }

      // Date Range
      if (filters.dateFrom) {
        if (new Date(item.timestamp) < new Date(filters.dateFrom)) return false;
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(item.timestamp) > to) return false;
      }

      return true;
    });
  }, [orgScopedHistory, filters]);

  // Sorted History
  const sortedHistory = useMemo(() => {
    return [...filteredHistory].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'timestamp') {
        valA = new Date(a.timestamp).getTime();
        valB = new Date(b.timestamp).getTime();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredHistory, sortField, sortDirection]);

  // Paginated History
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedHistory.slice(start, start + pageSize);
  }, [sortedHistory, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedHistory.length / pageSize) || 1;

  // Governance Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = orgScopedHistory.length;
    const creates = orgScopedHistory.filter((i) => i.action.includes('CREATED')).length;
    const statusChanges = orgScopedHistory.filter((i) => i.action.includes('ACTIVATED') || i.action.includes('DEACTIVATED')).length;
    const archivals = orgScopedHistory.filter((i) => i.action.includes('ARCHIVED')).length;
    const updates = orgScopedHistory.filter((i) => i.action.includes('UPDATED')).length;

    return {
      totalMasterDataCount: total,
      activeCount: creates - statusChanges,
      inactiveCount: statusChanges,
      archivedCount: archivals,
      recentChangesCount: updates + statusChanges + archivals,
      recentStatusChangesCount: statusChanges,
      recentArchiveCount: archivals
    };
  }, [orgScopedHistory]);

  // Unique Actors for filter dropdown
  const uniqueActors = useMemo(() => {
    const map = new Map<string, string>();
    orgScopedHistory.forEach((h) => {
      if (!map.has(h.actorUserId)) {
        map.set(h.actorUserId, h.actorName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [orgScopedHistory]);

  // Handlers
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      entityType: 'all',
      action: 'all',
      actorId: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
  };

  // Bulk Selection Handlers
  const toggleSelectAllBulk = () => {
    if (selectedBulkIds.length === bulkPool.length) {
      setSelectedBulkIds([]);
    } else {
      setSelectedBulkIds(bulkPool.map((b) => b.id));
    }
  };

  const toggleSelectBulkItem = (id: string) => {
    setSelectedBulkIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Execute Safe Bulk Status Operation
  const handleExecuteBulkOperation = () => {
    // RBAC Check
    if (simulatedRole === 'viewer' || simulatedRole === 'accountant') {
      setFeedbackMessage({
        type: 'error',
        text: '❌ অননুমোদিত অনুরোধ (HTTP 403 Forbidden): আপনার বর্তমান রোলে মাস্টার ডাটা স্ট্যাটাস বাল্ক পরিবর্তন করার অনুমতি নেই।'
      });
      return;
    }

    if (selectedBulkIds.length === 0) {
      setFeedbackMessage({
        type: 'warning',
        text: 'অনুগ্রহ করে অন্তত একটি মাস্টার ডাটা আইটেম নির্বাচন করুন।'
      });
      return;
    }

    if (!bulkReason.trim()) {
      setFeedbackMessage({
        type: 'error',
        text: '❌ পরিবর্তনের কারণ (Reason) বাধ্যতামূলক। অনুগ্রহ করে কারণ উল্লেখ করুন।'
      });
      return;
    }

    const itemsToProcess = bulkPool.filter((item) => selectedBulkIds.includes(item.id));
    const results: BulkGovernanceResult['items'] = [];
    let successCount = 0;
    let failedCount = 0;

    const newAuditEntries: MasterDataChangeHistoryRecord[] = [];

    itemsToProcess.forEach((item) => {
      // Validation 1: System-Defined item protection from Archival by Manager
      if (item.isSystemDefined && bulkTargetStatus === 'archived' && simulatedRole !== 'admin') {
        results.push({
          id: item.id,
          code: item.code,
          name: item.name,
          success: false,
          errorReason: 'সিস্টেম-নির্ধারিত সংরক্ষিত আইটেম শুধুমাত্র সুপার অ্যাডমিন আর্কাইভ করতে পারবেন।'
        });
        failedCount++;
        return;
      }

      // Validation 2: Already archived item terminal protection
      if (item.status === 'archived' && bulkTargetStatus !== 'archived') {
        results.push({
          id: item.id,
          code: item.code,
          name: item.name,
          success: false,
          errorReason: 'টার্মিনাল স্টেট প্রটেকশন: আর্কাইভকৃত আইটেম পুনরায় সক্রিয়/নিষ্ক্রিয় করা নিষিদ্ধ।'
        });
        failedCount++;
        return;
      }

      // Success
      results.push({
        id: item.id,
        code: item.code,
        name: item.name,
        success: true
      });
      successCount++;

      // Create Audit Log
      const actionName =
        bulkTargetStatus === 'active'
          ? 'BULK_ACTIVATE'
          : bulkTargetStatus === 'inactive'
          ? 'BULK_DEACTIVATE'
          : 'BULK_ARCHIVE';

      newAuditEntries.push({
        id: `gov-bulk-${Date.now()}-${item.id}`,
        organizationId: organization.id,
        entityType: item.entityType,
        entityId: item.id,
        entityCode: item.code,
        entityName: item.name,
        action: actionName,
        actorUserId: simulatedRole === 'admin' ? 'usr-admin-01' : 'usr-manager-02',
        actorName: simulatedRole === 'admin' ? 'মুফতি আলাউদ্দীন (সুপার অ্যাডমিন)' : 'মাওলানা মাহমুদ হাসান (ম্যানেজার)',
        actorRole: simulatedRole === 'admin' ? 'Super Admin' : 'Manager',
        timestamp: new Date().toISOString(),
        reason: bulkReason.trim(),
        effectiveFrom: bulkEffectiveDate,
        beforeState: { status: item.status },
        afterState: { status: bulkTargetStatus },
        changedFields: ['status'],
        referenceId: `BULK-REF-${Date.now().toString().slice(-6)}`
      });
    });

    // Update Bulk Pool Statuses
    setBulkPool((prev) =>
      prev.map((item) => {
        const res = results.find((r) => r.id === item.id);
        if (res && res.success) {
          return { ...item, status: bulkTargetStatus };
        }
        return item;
      })
    );

    // Append Immutable Audit Logs
    setHistoryList((prev) => [...newAuditEntries, ...prev]);

    setBulkResult({
      totalRequested: itemsToProcess.length,
      successfulCount: successCount,
      failedCount: failedCount,
      items: results
    });

    setSelectedBulkIds([]);
    setBulkReason('');
    setFeedbackMessage({
      type: successCount > 0 ? 'success' : 'error',
      text: `বাল্ক অপারেশন সম্পন্ন: ${successCount}টি সফল, ${failedCount}টি ব্যর্থ। অডিট লগ যুক্ত করা হয়েছে।`
    });
  };

  // CSV Export
  const handleExportCSV = () => {
    if (simulatedRole === 'viewer') {
      setFeedbackMessage({
        type: 'error',
        text: '❌ অননুমোদিত অনুরোধ (HTTP 403 Forbidden): এক্সপোর্ট করার অনুমতি নেই।'
      });
      return;
    }

    const headers = [
      'ক্রমিক',
      'তারিখ ও সময়',
      'ডাইমেনশন / এনটিটি',
      'কোড',
      'নাম',
      'সম্পাদিত একশন',
      'সম্পাদনকারী',
      'পদবি',
      'পরিবর্তনের কারণ',
      'কার্যকর তারিখ',
      'রেফারেন্স আইডি'
    ];

    const rows = sortedHistory.map((item, idx) => [
      idx + 1,
      new Date(item.timestamp).toLocaleString('bn-BD'),
      item.entityType === 'head'
        ? 'খাত (Head)'
        : item.entityType === 'fund'
        ? 'তহবিল (Fund)'
        : item.entityType === 'member_classification'
        ? 'সদস্য শ্রেণি'
        : 'কাস্টম মাস্টার',
      item.entityCode,
      `"${item.entityName.replace(/"/g, '""')}"`,
      item.action,
      `"${item.actorName.replace(/"/g, '""')}"`,
      item.actorRole || 'N/A',
      `"${(item.reason || '').replace(/"/g, '""')}"`,
      item.effectiveFrom || 'N/A',
      item.referenceId || 'N/A'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `tijarah_master_data_governance_audit_${organization.code}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedbackMessage({
      type: 'success',
      text: 'মাস্টার ডাটা গভর্ন্যান্স অডিট রেজিস্টার সফলভাবে CSV আকারে ডাউনলোড হয়েছে।'
    });
  };

  // A4 Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Accounting Dimensions Guard */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 text-white p-5 rounded-2xl shadow-sm border border-emerald-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Phase 4.5 — Master Data Governance
                </span>
                <span className="text-xs text-slate-300">অপরিবর্তনীয় অডিট ও লাইফসাইকেল কন্ট্রোল</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1 font-heading">
                মাস্টার ডাটা গভর্ন্যান্স, চেঞ্জ হিস্ট্রি ও সেন্ট্রালাইজড অডিট
              </h2>
              <p className="text-xs text-slate-300 max-w-3xl mt-0.5 leading-relaxed">
                মাস্টার ডাটার স্বত্ব, অপরিবর্তনীয় কোড প্রটেকশন, নিরাপদ লাইফসাইকেল ট্রানজিশন এবং অ্যাপেন্ড-অনলি অডিট হিস্ট্রি সংরক্ষণ।
              </p>
            </div>
          </div>

          {/* Dimension Rule Pill */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15 text-xs flex flex-col gap-1 shrink-0">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              হিসাবের ৩টি স্বাধীন মাত্রা (Strict Isolation):
            </span>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-200">
              <span className="bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-200 font-semibold">খাত (Head)</span>
              <span>≠</span>
              <span className="bg-teal-800/80 px-2 py-0.5 rounded text-teal-200 font-semibold">তহবিল (Fund)</span>
              <span>≠</span>
              <span className="bg-slate-800/80 px-2 py-0.5 rounded text-slate-200 font-semibold">হিসাব (Account)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role & Org Context Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-700" />
          <span className="text-slate-500 font-medium">সক্রিয় সমিতি:</span>
          <span className="font-bold text-slate-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {organization.name} ({organization.code})
          </span>
        </div>

        {/* RBAC Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">সিমুলেটেড রোল (RBAC):</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(['admin', 'manager', 'accountant', 'viewer'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSimulatedRole(r);
                  setFeedbackMessage({
                    type: 'success',
                    text: `রোল পরিবর্তন করা হয়েছে: ${
                      r === 'admin'
                        ? 'সুপার অ্যাডমিন (পূর্ণ ক্ষমতা)'
                        : r === 'manager'
                        ? 'ম্যানেজার (এডিট/বাল্ক চেঞ্জ)'
                        : r === 'accountant'
                        ? 'হিসাবরক্ষক (ভিউ ও এক্সপোর্ট)'
                        : 'দর্শক (কেবল পাঠযোগ্য)'
                    }`
                  });
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition ${
                  simulatedRole === r
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'admin'
                  ? 'অ্যাডমিন'
                  : r === 'manager'
                  ? 'ম্যানেজার'
                  : r === 'accountant'
                  ? 'হিসাবরক্ষক'
                  : 'দর্শক (Viewer)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Alert Message */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-medium animate-fadeIn ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : feedbackMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Governance Summary Dashboard Cards (NO FINANCIAL BALANCE) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">মোট অডিট রেকর্ড</p>
            <h3 className="text-lg font-bold text-slate-900 font-numeric">
              {summaryMetrics.totalMasterDataCount}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">সাম্প্রতিক পরিবর্তন</p>
            <h3 className="text-lg font-bold text-teal-700 font-numeric">
              {summaryMetrics.recentChangesCount}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">অবস্থা ট্রানজিশন</p>
            <h3 className="text-lg font-bold text-amber-700 font-numeric">
              {summaryMetrics.recentStatusChangesCount}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">আর্কাইভকৃত আইটেম</p>
            <h3 className="text-lg font-bold text-slate-700 font-numeric">
              {summaryMetrics.recentArchiveCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Governance Workspace & Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header & Action Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-700" />
              মাস্টার ডাটা অডিট ও চেঞ্জ হিস্ট্রি রেজিস্টার
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              খাত, তহবিল ও অন্যান্য মাস্টার ডাটার পরিবর্তন, সৃষ্টি ও নিষ্ক্রিয়করণের অপরিবর্তনীয় প্রমাণ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Safe Bulk Operations Button */}
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              নিরাপদ বাল্ক স্ট্যাটাস অপারেশন
            </button>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
              title="UTF-8 CSV ডাউনলোড"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              CSV এক্সপোর্ট
            </button>

            {/* A4 Print */}
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
              title="অফিসিয়াল A4 প্রিন্ট"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              প্রিন্ট লেআউট
            </button>

            {/* Refresh */}
            <button
              onClick={() => {
                if (onRefreshOrgData) onRefreshOrgData();
                setFeedbackMessage({ type: 'success', text: 'অডিট ডেটা রিফ্রেশ করা হয়েছে।' });
              }}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
              title="রিফ্রেশ"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="কোড, নাম, সম্পাদনকারী বা কারণ খুঁজুন..."
              value={filters.searchQuery || ''}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-600 text-slate-800"
            />
          </div>

          {/* Entity Type Filter */}
          <div>
            <select
              value={filters.entityType || 'all'}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, entityType: e.target.value as any }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-600 text-slate-800"
            >
              <option value="all">সকল ডাইমেনশন (All Dimensions)</option>
              <option value="head">খাত ব্যবস্থাপনা (Head Management)</option>
              <option value="fund">তহবিল ব্যবস্থাপনা (Fund Management)</option>
              <option value="member_classification">সদস্য শ্রেণি মাস্টার</option>
              <option value="custom_master">অন্যান্য কাস্টম মাস্টার</option>
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <select
              value={filters.action || 'all'}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, action: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-600 text-slate-800"
            >
              <option value="all">সকল একশন (All Actions)</option>
              <option value="CREATED">সৃষ্টি (CREATED)</option>
              <option value="UPDATED">সংশোধন (UPDATED)</option>
              <option value="ACTIVATED">সক্রিয়করণ (ACTIVATED)</option>
              <option value="DEACTIVATED">নিষ্ক্রিয়করণ (DEACTIVATED)</option>
              <option value="ARCHIVED">আর্কাইভকরণ (ARCHIVED)</option>
              <option value="BULK">বাল্ক অপারেশন (BULK)</option>
            </select>
          </div>

          {/* Actor Filter */}
          <div>
            <select
              value={filters.actorId || 'all'}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, actorId: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-600 text-slate-800"
            >
              <option value="all">সকল সম্পাদনকারী (All Actors)</option>
              {uniqueActors.map((actor) => (
                <option key={actor.id} value={actor.id}>
                  {actor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-3 h-3" />
              রিসেট ফিল্টার
            </button>
          </div>
        </div>

        {/* Audit Records Table (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-heading">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-emerald-700 transition"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center gap-1">
                    <span>তারিখ ও সময়</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4">ডাইমেনশন</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-emerald-700 transition"
                  onClick={() => handleSort('entityCode')}
                >
                  <div className="flex items-center gap-1">
                    <span>কোড</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-emerald-700 transition"
                  onClick={() => handleSort('entityName')}
                >
                  <div className="flex items-center gap-1">
                    <span>আইটেমের নাম</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4">একশন</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-emerald-700 transition"
                  onClick={() => handleSort('actorName')}
                >
                  <div className="flex items-center gap-1">
                    <span>সম্পাদনকারী</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4">পরিবর্তনের কারণ</th>
                <th className="py-3 px-4 text-center w-20">বিস্তারিত</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 font-body">
              {paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FolderTree className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-medium">কোনো অডিট রেকর্ড পাওয়া যায়নি</p>
                      <p className="text-xs text-slate-400">ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedHistory.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                  const isCreated = item.action.includes('CREATED');
                  const isDeactivated = item.action.includes('DEACTIVATED');
                  const isArchived = item.action.includes('ARCHIVED');
                  const isUpdated = item.action.includes('UPDATED');

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-center text-slate-400 font-numeric">
                        {globalIdx}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-numeric whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {new Date(item.timestamp).toLocaleDateString('bn-BD')}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString('bn-BD')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            item.entityType === 'head'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : item.entityType === 'fund'
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {item.entityType === 'head' ? (
                            <Layers className="w-3 h-3" />
                          ) : item.entityType === 'fund' ? (
                            <Coins className="w-3 h-3" />
                          ) : (
                            <Users className="w-3 h-3" />
                          )}
                          {item.entityType === 'head'
                            ? 'খাত (Head)'
                            : item.entityType === 'fund'
                            ? 'তহবিল (Fund)'
                            : 'সদস্য মাস্টার'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {item.entityCode}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 max-w-[200px] truncate">
                        {item.entityName}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCreated
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isDeactivated
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : isArchived
                              ? 'bg-slate-200 text-slate-800 border border-slate-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {item.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="font-semibold">{item.actorName}</div>
                        <div className="text-[10px] text-slate-400">{item.actorRole || 'কর্মকর্তা'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-[240px] truncate" title={item.reason}>
                        {item.reason || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedRecord(item)}
                          className="p-1.5 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg transition"
                          title="বিস্তারিত ও Before/After Diff দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="block md:hidden divide-y divide-slate-200">
          {paginatedHistory.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">কোনো অডিট রেকর্ড নেই।</div>
          ) : (
            paginatedHistory.map((item, idx) => (
              <div key={item.id} className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {item.entityCode}
                  </span>
                  <span className="text-[10px] text-slate-400 font-numeric">
                    {new Date(item.timestamp).toLocaleDateString('bn-BD')}
                  </span>
                </div>
                <div className="font-bold text-slate-900">{item.entityName}</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{item.actorName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {item.action}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {item.reason}
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => setSelectedRecord(item)}
                    className="text-xs text-emerald-700 font-semibold flex items-center gap-1"
                  >
                    বিস্তারিত ও Diff দেখুন <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            মোট <span className="font-bold text-slate-800 font-numeric">{sortedHistory.length}</span>টি অডিট রেকর্ড
            (পৃষ্ঠা <span className="font-bold text-slate-800 font-numeric">{currentPage}</span> /{' '}
            <span className="font-bold text-slate-800 font-numeric">{totalPages}</span>)
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-slate-500">পৃষ্ঠা প্রতি:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <option value={5}>৫</option>
                <option value={10}>১০</option>
                <option value={20}>২০</option>
                <option value={50}>৫০</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg disabled:opacity-50 transition"
              >
                পূর্ববর্তী
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg disabled:opacity-50 transition"
              >
                পরবর্তী
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Safe Bulk Status Operations Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    নিরাপদ বাল্ক স্ট্যাটাস অপারেশন (Bulk Governance)
                  </h3>
                  <p className="text-xs text-slate-500">
                    একাধিক মাস্টার ডাটা আইটেমের স্ট্যাটাস নিরাপদ ট্রানজিশন ও অডিট লগিং
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkResult(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Target Status Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">লক্ষ্য স্ট্যাটাস (Target Action):</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkTargetStatus('active')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      bulkTargetStatus === 'active'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    সক্রিয়করণ (Activate)
                  </button>

                  <button
                    type="button"
                    onClick={() => setBulkTargetStatus('inactive')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      bulkTargetStatus === 'inactive'
                        ? 'bg-amber-50 border-amber-600 text-amber-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    নিষ্ক্রিয়করণ (Deactivate)
                  </button>

                  <button
                    type="button"
                    onClick={() => setBulkTargetStatus('archived')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      bulkTargetStatus === 'archived'
                        ? 'bg-slate-800 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    আর্কাইভকরণ (Archive)
                  </button>
                </div>
                {bulkTargetStatus === 'archived' && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    ⚠️ সতর্কতা: আর্কাইভ একটি টার্মিনাল স্টেট। একবার আর্কাইভ হলে তা পুনরায় সক্রিয় করা যায় না।
                  </p>
                )}
              </div>

              {/* Mandatory Reason */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  পরিবর্তনের কারণ (Mandatory Audit Reason) <span className="text-rose-600">*</span>:
                </label>
                <textarea
                  rows={2}
                  placeholder="স্ট্যাটাস পরিবর্তনের নীতিগত কারণ সংক্ষেপে উল্লেখ করুন..."
                  value={bulkReason}
                  onChange={(e) => setBulkReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Master Data Pool Selection Table */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">আইটেম নির্বাচন ({selectedBulkIds.length}টি নির্বাচিত):</span>
                  <button
                    type="button"
                    onClick={toggleSelectAllBulk}
                    className="text-xs text-emerald-700 font-semibold hover:underline"
                  >
                    {selectedBulkIds.length === bulkPool.length ? 'সব আনচেক করুন' : 'সব চেক করুন'}
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {bulkPool.map((item) => {
                    const isSelected = selectedBulkIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleSelectBulkItem(item.id)}
                        className={`p-2.5 flex items-center justify-between cursor-pointer transition ${
                          isSelected ? 'bg-emerald-50/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-0"
                          />
                          <div>
                            <div className="font-mono font-bold text-slate-800">{item.code}</div>
                            <div className="text-slate-600 font-medium">{item.name}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {item.entityType}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              item.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'inactive'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bulk Results Panel */}
              {bulkResult && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center justify-between">
                    <span>প্রক্রিয়াকরণ ফলাফল:</span>
                    <span className="text-xs">
                      সফল: <strong className="text-emerald-700">{bulkResult.successfulCount}</strong>, ব্যর্থ:{' '}
                      <strong className="text-rose-700">{bulkResult.failedCount}</strong>
                    </span>
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {bulkResult.items.map((r) => (
                      <div
                        key={r.id}
                        className={`p-1.5 rounded text-[11px] flex items-center justify-between ${
                          r.success ? 'bg-emerald-100/50 text-emerald-900' : 'bg-rose-100/50 text-rose-900'
                        }`}
                      >
                        <span>
                          <strong>{r.code}</strong> — {r.name}
                        </span>
                        <span>{r.success ? '✓ সফল' : `✗ ${r.errorReason}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkResult(null);
                }}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl font-semibold text-xs text-slate-700 transition"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={handleExecuteBulkOperation}
                disabled={selectedBulkIds.length === 0 || !bulkReason.trim()}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-xs disabled:opacity-50 transition"
              >
                নিরাপদ বাল্ক এক্সিকিউট
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Audit & Before/After Diff Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    মাস্টার ডাটা অডিট বিবরণ ও Before/After Diff
                  </h3>
                  <p className="text-xs text-slate-500">
                    রেকর্ড আইডি: <span className="font-mono">{selectedRecord.id}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-numeric">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">ডাইমেনশন</span>
                  <p className="font-bold text-slate-800">{selectedRecord.entityType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">কোড</span>
                  <p className="font-mono font-bold text-emerald-800">{selectedRecord.entityCode}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">একশন</span>
                  <p className="font-bold text-slate-800">{selectedRecord.action}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">কার্যকর তারিখ</span>
                  <p className="font-bold text-slate-800">{selectedRecord.effectiveFrom}</p>
                </div>
              </div>

              {/* Actor & Reason */}
              <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[11px]">সম্পাদনকারী:</span>
                    <p className="font-bold text-slate-900">{selectedRecord.actorName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[11px]">টাইমস্ট্যাম্প:</span>
                    <p className="font-numeric text-slate-700">
                      {new Date(selectedRecord.timestamp).toLocaleString('bn-BD')}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 text-[11px] font-semibold">পরিবর্তনের কারণ (Audit Reason):</span>
                  <p className="text-slate-800 italic mt-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                    "{selectedRecord.reason}"
                  </p>
                </div>
              </div>

              {/* Field-level Before / After State Diff Viewer */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  ফিল্ড-লেভেল স্টেট পরিবর্তন (State Snapshot Diff)
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {/* Before State */}
                  <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200 space-y-1">
                    <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                      পূর্ববর্তী অবস্থা (Before State):
                    </span>
                    {selectedRecord.beforeState ? (
                      <pre className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-rose-100 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(selectedRecord.beforeState, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-slate-400 italic text-[11px] p-2 bg-white rounded-lg border border-rose-100">
                        (কোনো পূর্ববর্তী অবস্থা নেই — নতুন সৃষ্টি)
                      </p>
                    )}
                  </div>

                  {/* After State */}
                  <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      পরবর্তী অবস্থা (After State):
                    </span>
                    {selectedRecord.afterState ? (
                      <pre className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-100 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(selectedRecord.afterState, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-slate-400 italic text-[11px] p-2 bg-white rounded-lg border border-emerald-100">
                        (কোনো ডেটা নেই)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Immutable Fields Notice */}
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-[11px] flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-slate-500" />
                <span>
                  <strong>অপরিবর্তনীয় ফিল্ড সুরক্ষা:</strong> মাস্টার ডাটা সৃষ্টি হওয়ার পর আইডি, কোড, অর্গানাইজেশন রেফারেন্স
                  ও সৃষ্টির সময় সম্পূর্ণভাবে লকড থাকে।
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs transition"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Informational Separation of Duties & Architecture Guide */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold font-heading text-sm">
          <Info className="w-4 h-4 text-emerald-700" />
          মাস্টার ডাটা গভর্ন্যান্স নীতি ও আর্কিটেকচারাল গাইড (Phase 4.5)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600 leading-relaxed">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <strong className="text-slate-800 block">১. স্বত্ব ও অপরিবর্তনীয় কোড নীতি</strong>
            <p>
              মাস্টার ডাটা এনটিটি একবার সৃষ্টি হলে তার কোড (`INC-001`, `FND-001`), অর্গানাইজেশন আইডি ও সিস্টেম আইডি
              কখনোই পরিবর্তিত হতে পারে না।
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <strong className="text-slate-800 block">২. জিরো হার্ড-ডিলিট ও লাইফসাইকেল</strong>
            <p>
              সিস্টেমে কোনো ডাটা মুছে ফেলার সুযোগ নেই। শুধুমাত্র `Active ↔ Inactive → Archived` স্টেট ট্রানজিশন দিয়ে
              হিস্টোরিক্যাল ডাটা অখণ্ড রাখা হয়।
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <strong className="text-slate-800 block">৩. দায়িত্ব পৃথকীকরণ (Separation of Duties)</strong>
            <p>
              সৃষ্টিকারী ও অনুমোদনকারী ব্যক্তি পৃথক (Creator ≠ Approver)। স্পর্শকাতর প্রতিটি পরিবর্তনে সুনির্দিষ্ট কারণ
              (Mandatory Reason) অডিট লগে লিপিবদ্ধ হয়।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
