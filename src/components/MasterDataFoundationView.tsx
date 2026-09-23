import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Archive,
  History,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Layers,
  Lock,
  Tag,
  Info,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import {
  MasterDataDefinition,
  MasterDataItem,
  MasterDataLifecycleStatus,
  MasterDataAuditLog,
  MasterDataFilterCriteria,
  OrganizationContext
} from '../types';

interface MasterDataFoundationViewProps {
  currentOrg: OrganizationContext;
  onOrgChange?: (orgId: string) => void;
}

// ============================================================================
// Seed Definitions & Items for Multi-Tenant Scoping (DEMO / SAMPLE DATA)
// ============================================================================

export const INITIAL_MASTER_DEFINITIONS: Record<string, MasterDataDefinition[]> = {
  'demo-org-khurushkul': [
    {
      id: 'def-001',
      organizationId: 'demo-org-khurushkul',
      masterDataType: 'occupation',
      code: 'OCCUPATION',
      name: 'পেশা ও জীবিকা',
      displayName: 'সদস্যদের পেশা তালিকা',
      description: 'সমিতির সদস্য ও গ্রাহকদের পেশাগত ক্যাটাগরি',
      isSystemDefined: true,
      isActive: true,
      sortOrder: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    },
    {
      id: 'def-002',
      organizationId: 'demo-org-khurushkul',
      masterDataType: 'gender',
      code: 'GENDER',
      name: 'লিঙ্গ পরিচয়',
      displayName: 'লিঙ্গ তালিকা',
      description: 'সদস্যের জেন্ডার আইডেন্টিটি',
      isSystemDefined: true,
      isActive: true,
      sortOrder: 2,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    },
    {
      id: 'def-003',
      organizationId: 'demo-org-khurushkul',
      masterDataType: 'relation_type',
      code: 'RELATION_TYPE',
      name: 'পারিবারিক ও প্রাতিষ্ঠানিক সম্পর্ক',
      displayName: 'সদস্য সম্পর্কের ধরন',
      description: 'সদস্যদের পরস্পরিক ও নমিনির সম্পর্ক নির্ধারণ',
      isSystemDefined: true,
      isActive: true,
      sortOrder: 3,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    },
    {
      id: 'def-004',
      organizationId: 'demo-org-khurushkul',
      masterDataType: 'member_classification',
      code: 'MEMBER_CLASS',
      name: 'সদস্য শ্রেণিবিন্যাস',
      displayName: 'সদস্যপদ ক্যাটাগরি',
      description: 'সমিতির বিধিবদ্ধ সদস্যপদ গ্রেড ও শ্রেণি',
      isSystemDefined: true,
      isActive: true,
      sortOrder: 4,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    },
    {
      id: 'def-005',
      organizationId: 'demo-org-khurushkul',
      masterDataType: 'document_type',
      code: 'DOC_TYPE',
      name: 'নথিপত্র ও সনদের ধরন',
      displayName: 'ডকুমেন্ট প্রকারভেদ',
      description: 'এনআইডি, জন্ম নিবন্ধন, পাসপোর্ট ও সনদপত্র',
      isSystemDefined: true,
      isActive: true,
      sortOrder: 5,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    }
  ],
  'demo-org-alfalah': [
    {
      id: 'def-af-001',
      organizationId: 'demo-org-alfalah',
      masterDataType: 'occupation',
      code: 'OCCUPATION',
      name: 'পেশা তালিকা (আল-ফালাহ)',
      displayName: 'সদস্যদের পেশা ক্যাটাগরি',
      description: 'আল-ফালাহ সমিতির অনুমোদিত পেশা তালিকা',
      isSystemDefined: true,
      isActive: true,
      sortOrder: 1,
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    },
    {
      id: 'def-af-002',
      organizationId: 'demo-org-alfalah',
      masterDataType: 'member_classification',
      code: 'MEMBER_CLASS',
      name: 'সদস্য শ্রেণি (আল-ফালাহ)',
      displayName: 'সদস্যপদ স্তর',
      description: 'আল-ফালাহ সমিতির মেম্বার গ্রেড',
      isSystemDefined: true,
      isActive: true,
      sortOrder: 2,
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    }
  ]
};

export const INITIAL_MASTER_ITEMS: Record<string, MasterDataItem[]> = {
  'demo-org-khurushkul': [
    // Occupation Items
    {
      id: 'item-001',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-001',
      code: 'TEACHER',
      name: 'মাদ্রাসা শিক্ষক ও খতিব',
      description: 'দ্বীনি শিক্ষা ও মসজিদের খতিব বা ইমামতি পেশা',
      isSystemDefined: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin',
      usageCount: 14
    },
    {
      id: 'item-002',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-001',
      code: 'BUSINESS_HALAL',
      name: 'ব্যবসায়ী ও খামার পরিচালক',
      description: 'হাঁস-মুরগি, মৎস্য ও খুচরা হালাল ব্যবসা',
      isSystemDefined: true,
      status: 'active',
      sortOrder: 2,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin',
      usageCount: 28
    },
    {
      id: 'item-003',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-001',
      code: 'SALT_FARMER',
      name: 'লবণ চাষী ও মৎস্যজীবী',
      description: 'উপকূলীয় এলাকার লবণ ও চিংড়ি ঘের চাষী',
      isSystemDefined: false,
      status: 'active',
      sortOrder: 3,
      createdAt: '2023-01-15T00:00:00.000Z',
      updatedAt: '2023-01-15T00:00:00.000Z',
      createdBy: 'usr-admin-01',
      usageCount: 9
    },
    {
      id: 'item-004',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-001',
      code: 'SEASONAL_LABOR',
      name: 'মৌসুমি শ্রমিক',
      description: 'সাময়িক বা চুক্তিভিত্তিক কৃষি/নির্মাণ শ্রমিক',
      isSystemDefined: false,
      status: 'inactive',
      sortOrder: 4,
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
      createdBy: 'usr-admin-01',
      usageCount: 2
    },
    // Gender Items
    {
      id: 'item-005',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-002',
      code: 'MALE',
      name: 'পুরুষ',
      description: 'পুরুষ সদস্য',
      isSystemDefined: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin',
      usageCount: 85
    },
    {
      id: 'item-006',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-002',
      code: 'FEMALE',
      name: 'মহিলা',
      description: 'মহিলা সদস্য',
      isSystemDefined: true,
      status: 'active',
      sortOrder: 2,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin',
      usageCount: 22
    },
    // Relation Types
    {
      id: 'item-007',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-003',
      code: 'FATHER',
      name: 'পিতা',
      description: 'পিতা-সন্তান সম্পর্ক',
      isSystemDefined: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin',
      usageCount: 30
    },
    {
      id: 'item-008',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-003',
      code: 'BROTHER',
      name: 'সহোদর ভাই',
      description: 'ভাই-ভাই বা ভাই-বোন সম্পর্ক',
      isSystemDefined: true,
      status: 'active',
      sortOrder: 2,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin',
      usageCount: 12
    },
    {
      id: 'item-009',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-003',
      code: 'BUSINESS_PARTNER',
      name: 'ব্যবসায়িক অংশীদার (শরীক)',
      description: 'মুশারাকা বা যৌথ ব্যবসার পার্টনার',
      isSystemDefined: false,
      status: 'active',
      sortOrder: 3,
      createdAt: '2023-02-10T00:00:00.000Z',
      updatedAt: '2023-02-10T00:00:00.000Z',
      createdBy: 'usr-admin-01',
      usageCount: 4
    },
    // Member Classifications
    {
      id: 'item-010',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-004',
      code: 'FOUNDER',
      name: 'প্রতিষ্ঠাতা সদস্য',
      description: 'সমিতির উদ্যোক্তা ও প্রতিষ্ঠাতা পর্ষদ সদস্য',
      isSystemDefined: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin',
      usageCount: 11
    },
    {
      id: 'item-011',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-004',
      code: 'GENERAL',
      name: 'সাধারণ সদস্য',
      description: 'নিয়মিত সাধারণ শেয়ারহোল্ডার সদস্য',
      isSystemDefined: true,
      status: 'active',
      sortOrder: 2,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin',
      usageCount: 65
    },
    {
      id: 'item-012',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-004',
      code: 'HONORARY',
      name: 'সম্মানিত উপদেষ্টা সদস্য',
      description: 'বিশেষ অবদানের জন্য সম্মানিত অ-ভোটিং সদস্য',
      isSystemDefined: false,
      status: 'active',
      sortOrder: 3,
      createdAt: '2023-03-01T00:00:00.000Z',
      updatedAt: '2023-03-01T00:00:00.000Z',
      createdBy: 'usr-admin-01',
      usageCount: 3
    },
    // Document Types
    {
      id: 'item-013',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-005',
      code: 'NID',
      name: 'জাতীয় পরিচয়পত্র (NID)',
      description: 'স্মার্ট কার্ড বা এনআইডি কপি',
      isSystemDefined: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin',
      usageCount: 95
    },
    {
      id: 'item-014',
      organizationId: 'demo-org-khurushkul',
      definitionId: 'def-005',
      code: 'BIRTH_CERT',
      name: 'জন্ম নিবন্ধন সনদ',
      description: 'ডিজিটাল জন্ম সনদপত্র',
      isSystemDefined: true,
      status: 'active',
      sortOrder: 2,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin',
      usageCount: 40
    }
  ],
  'demo-org-alfalah': [
    {
      id: 'item-af-001',
      organizationId: 'demo-org-alfalah',
      definitionId: 'def-af-001',
      code: 'ENGINEER',
      name: 'প্রকৌশলী ও প্রযুক্তিবিদ',
      description: 'আইটি ও সিভিল ইঞ্জিনিয়ারিং পেশাজীবী',
      isSystemDefined: false,
      status: 'active',
      sortOrder: 1,
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
      createdBy: 'usr-af-admin',
      usageCount: 15
    },
    {
      id: 'item-af-002',
      organizationId: 'demo-org-alfalah',
      definitionId: 'def-af-002',
      code: 'LIFETIME',
      name: 'আজীবন সদস্য (আল-ফালাহ)',
      description: 'এককালীন অনুদানভিত্তিক আজীবন সদস্যপদ',
      isSystemDefined: false,
      status: 'active',
      sortOrder: 1,
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
      createdBy: 'usr-af-admin',
      usageCount: 8
    }
  ]
};

export const MasterDataFoundationView: React.FC<MasterDataFoundationViewProps> = ({
  currentOrg,
  onOrgChange,
}) => {
  const orgId = currentOrg.id;

  // Local State for Multi-Tenant Management
  const [definitions, setDefinitions] = useState<Record<string, MasterDataDefinition[]>>(INITIAL_MASTER_DEFINITIONS);
  const [items, setItems] = useState<Record<string, MasterDataItem[]>>(INITIAL_MASTER_ITEMS);
  const [auditLogs, setAuditLogs] = useState<MasterDataAuditLog[]>([
    {
      id: 'log-001',
      organizationId: 'demo-org-khurushkul',
      entityId: 'item-003',
      entityType: 'item',
      action: 'CREATE',
      actorUserId: 'usr-admin-01',
      actorName: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
      timestamp: '2023-01-15T11:20:00.000Z',
      reason: 'উপকূলীয় সদস্যদের অন্তর্ভুক্তির জন্য কাস্টম পেশা সংযোজন',
      changesSummary: 'নতুন আইটেম: লবণ চাষী ও মৎস্যজীবী (SALT_FARMER)'
    },
    {
      id: 'log-002',
      organizationId: 'demo-org-khurushkul',
      entityId: 'item-004',
      entityType: 'item',
      action: 'DEACTIVATE',
      actorUserId: 'usr-admin-01',
      actorName: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
      timestamp: '2023-02-10T14:45:00.000Z',
      reason: 'মৌসুমি পেশা সাময়িক নিষ্ক্রিয়করণ',
      changesSummary: 'স্ট্যাটাস পরিবর্তিত: active -> inactive'
    }
  ]);

  // Selected Active Definition Tab
  const currentOrgDefinitions = definitions[orgId] || [];
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string>('all');

  // Filters & Search
  const [filters, setFilters] = useState<MasterDataFilterCriteria>({
    searchQuery: '',
    definitionId: 'all',
    status: 'all',
    origin: 'all'
  });

  // UI State: Modals & Actions
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);
  const [statusConfirmItem, setStatusConfirmItem] = useState<{
    item: MasterDataItem;
    targetStatus: MasterDataLifecycleStatus;
  } | null>(null);
  const [statusChangeReason, setStatusChangeReason] = useState('');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedItemAudit, setSelectedItemAudit] = useState<MasterDataItem | null>(null);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    definitionId: currentOrgDefinitions[0]?.id || '',
    code: '',
    name: '',
    description: '',
    sortOrder: 1,
    reason: ''
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Simulated RBAC Role for Testing
  const [simulatedRole, setSimulatedRole] = useState<'admin' | 'manager' | 'viewer'>('admin');

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [sortAsc, setSortAsc] = useState(true);

  // Current Org Items
  const currentOrgItems = items[orgId] || [];

  // Filtered Items Computation
  const filteredItems = useMemo(() => {
    let result = [...currentOrgItems];

    // Filter by Definition
    if (selectedDefinitionId !== 'all') {
      result = result.filter(item => item.definitionId === selectedDefinitionId);
    }

    // Filter by Search Query (Name, Code, Description)
    if (filters.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    // Filter by Status
    if (filters.status && filters.status !== 'all') {
      result = result.filter(item => item.status === filters.status);
    }

    // Filter by Origin (System vs Custom)
    if (filters.origin && filters.origin !== 'all') {
      if (filters.origin === 'system') {
        result = result.filter(item => item.isSystemDefined);
      } else {
        result = result.filter(item => !item.isSystemDefined);
      }
    }

    // Sort by sortOrder and code
    result.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return sortAsc ? a.sortOrder - b.sortOrder : b.sortOrder - a.sortOrder;
      }
      return sortAsc ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code);
    });

    return result;
  }, [currentOrgItems, selectedDefinitionId, filters, sortAsc]);

  // Paginated Items
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Handlers for Create/Edit
  const handleOpenCreateModal = () => {
    if (simulatedRole === 'viewer') {
      alert('সীমাবদ্ধ অ্যাক্সেস (403): শুধুমাত্র অ্যাডমিন ও ম্যানেজার মাস্টার ডাটা তৈরি করতে পারেন।');
      return;
    }
    setFormData({
      definitionId: selectedDefinitionId !== 'all' ? selectedDefinitionId : currentOrgDefinitions[0]?.id || '',
      code: '',
      name: '',
      description: '',
      sortOrder: currentOrgItems.length + 1,
      reason: ''
    });
    setFormError(null);
    setEditingItem(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (item: MasterDataItem) => {
    if (simulatedRole === 'viewer') {
      alert('সীমাবদ্ধ অ্যাক্সেস (403): শুধুমাত্র অ্যাডমিন ও ম্যানেজার মাস্টার ডাটা সম্পাদনা করতে পারেন।');
      return;
    }
    setFormData({
      definitionId: item.definitionId,
      code: item.code,
      name: item.name,
      description: item.description || '',
      sortOrder: item.sortOrder,
      reason: ''
    });
    setFormError(null);
    setEditingItem(item);
    setIsCreateModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formData.code.trim().toUpperCase().replace(/\s+/g, '_');
    const cleanName = formData.name.trim();

    if (!cleanCode) {
      setFormError('মাস্টার ডাটা কোড আবশ্যক।');
      return;
    }
    if (!cleanName) {
      setFormError('মাস্টার ডাটার নাম আবশ্যক।');
      return;
    }
    if (!formData.definitionId) {
      setFormError('মাস্টার ডাটা টাইপ নির্বাচন করুন।');
      return;
    }

    // Duplicate Check within the same Definition and Organization
    const isDuplicateCode = currentOrgItems.some(
      it => it.definitionId === formData.definitionId &&
            it.code.toUpperCase() === cleanCode &&
            (!editingItem || it.id !== editingItem.id)
    );

    if (isDuplicateCode) {
      setFormError(`কোড "${cleanCode}" এই ক্যাটাগরিতে ইতোমধ্যে বিদ্যমান। ভিন্ন কোড ব্যবহার করুন।`);
      return;
    }

    const timestamp = new Date().toISOString();

    if (editingItem) {
      // Update
      const updatedList = currentOrgItems.map(it => {
        if (it.id === editingItem.id) {
          return {
            ...it,
            name: cleanName,
            description: formData.description.trim() || undefined,
            sortOrder: Number(formData.sortOrder) || 1,
            updatedAt: timestamp,
            updatedBy: simulatedRole === 'admin' ? 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল' : 'কারী ফজলুল করিম'
          };
        }
        return it;
      });

      setItems(prev => ({ ...prev, [orgId]: updatedList }));

      // Add Audit
      const newAudit: MasterDataAuditLog = {
        id: `log-${Date.now()}`,
        organizationId: orgId,
        entityId: editingItem.id,
        entityType: 'item',
        action: 'UPDATE',
        actorUserId: 'usr-001',
        actorName: simulatedRole === 'admin' ? 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল' : 'কারী ফজলুল করিম',
        timestamp,
        reason: formData.reason.trim() || 'মাস্টার ডাটা তথ্য হালনাগাদ',
        changesSummary: `নাম: "${editingItem.name}" -> "${cleanName}"`
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    } else {
      // Create
      const newItem: MasterDataItem = {
        id: `item-${Date.now()}`,
        organizationId: orgId,
        definitionId: formData.definitionId,
        code: cleanCode,
        name: cleanName,
        description: formData.description.trim() || undefined,
        isSystemDefined: false,
        status: 'active',
        sortOrder: Number(formData.sortOrder) || 1,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: simulatedRole === 'admin' ? 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল' : 'কারী ফজলুল করিম',
        usageCount: 0
      };

      setItems(prev => ({ ...prev, [orgId]: [...(prev[orgId] || []), newItem] }));

      // Add Audit
      const newAudit: MasterDataAuditLog = {
        id: `log-${Date.now()}`,
        organizationId: orgId,
        entityId: newItem.id,
        entityType: 'item',
        action: 'CREATE',
        actorUserId: 'usr-001',
        actorName: simulatedRole === 'admin' ? 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল' : 'কারী ফজলুল করিম',
        timestamp,
        reason: formData.reason.trim() || 'নতুন কাস্টম মাস্টার ডাটা আইটেম তৈরি',
        changesSummary: `নতুন আইটেম: ${cleanName} (${cleanCode})`
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    }

    setIsCreateModalOpen(false);
  };

  // Status Change Handler (Activate, Deactivate, Archive)
  const handleExecuteStatusChange = () => {
    if (!statusConfirmItem) return;
    if (simulatedRole === 'viewer') {
      alert('সীমাবদ্ধ অ্যাক্সেস (403): শুধুমাত্র অ্যাডমিন ও ম্যানেজার স্ট্যাটাস পরিবর্তন করতে পারেন।');
      return;
    }

    const { item, targetStatus } = statusConfirmItem;
    const timestamp = new Date().toISOString();

    let actionName: 'ACTIVATE' | 'DEACTIVATE' | 'ARCHIVE' = 'ACTIVATE';
    if (targetStatus === 'inactive') actionName = 'DEACTIVATE';
    if (targetStatus === 'archived') actionName = 'ARCHIVE';

    const updatedList = currentOrgItems.map(it => {
      if (it.id === item.id) {
        return {
          ...it,
          status: targetStatus,
          updatedAt: timestamp,
          updatedBy: simulatedRole === 'admin' ? 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল' : 'কারী ফজলুল করিম'
        };
      }
      return it;
    });

    setItems(prev => ({ ...prev, [orgId]: updatedList }));

    // Add Audit
    const newAudit: MasterDataAuditLog = {
      id: `log-${Date.now()}`,
      organizationId: orgId,
      entityId: item.id,
      entityType: 'item',
      action: actionName,
      actorUserId: 'usr-001',
      actorName: simulatedRole === 'admin' ? 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল' : 'কারী ফজলুল করিম',
      timestamp,
      reason: statusChangeReason.trim() || `স্ট্যাটাস পরিবর্তন: ${item.status} -> ${targetStatus}`,
      changesSummary: `স্ট্যাটাস ট্রানজিশন: ${item.status} -> ${targetStatus} (${item.name})`
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    setStatusConfirmItem(null);
    setStatusChangeReason('');
  };

  // CSV Export Handler (Privacy-Safe UTF-8)
  const handleExportCsv = () => {
    const headers = ['আইডি', 'ক্যাটাগরি', 'কোড', 'নাম', 'বিবরণ', 'টাইপ', 'স্ট্যাটাস', 'ব্যবহার সংখ্যা', 'তৈরির তারিখ'];
    const rows = filteredItems.map(it => {
      const def = currentOrgDefinitions.find(d => d.id === it.definitionId);
      return [
        it.id,
        def ? def.displayName : 'সাধারণ',
        it.code,
        `"${it.name.replace(/"/g, '""')}"`,
        `"${(it.description || '').replace(/"/g, '""')}"`,
        it.isSystemDefined ? 'সিস্টেম নির্ধারিত' : 'কাস্টম',
        it.status === 'active' ? 'সক্রিয়' : it.status === 'inactive' ? 'নিষ্ক্রিয়' : 'আর্কাইভকৃত',
        it.usageCount || 0,
        it.createdAt.split('T')[0]
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Master_Data_${orgId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find definition name helper
  const getDefinitionName = (defId: string) => {
    const found = currentOrgDefinitions.find(d => d.id === defId);
    return found ? found.displayName : 'সাধারণ মাস্টার ডাটা';
  };

  return (
    <div className="space-y-6 pb-12 font-hind">
      {/* 1. Header & Architecture Clarity Notice */}
      <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Phase 4.1 — Foundation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                LOCKED BASELINE RESPECTED
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-mono bg-amber-100 text-amber-900 border border-amber-300">
                DEMO / SAMPLE DATA
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-7 h-7 text-emerald-600" />
              মাস্টার ডাটা আর্কিটেকচার ও রেজিস্টার (Master Data Architecture)
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              প্রতিষ্ঠানভিত্তিক কনফিগারেবল মাস্টার ডাটা ও ডোমেন সেপারেশন: <strong className="text-slate-800">Head ≠ Fund ≠ Account</strong>
            </p>
          </div>

          {/* Org Selector & Role Simulator */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <Building2 className="w-4 h-4 text-slate-500" />
              <select
                value={orgId}
                onChange={(e) => onOrgChange && onOrgChange(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-800 focus:outline-hidden"
              >
                <option value="demo-org-khurushkul">খুরুশকুল ওলামা সমিতি (ডেমো)</option>
                <option value="demo-org-alfalah">আল-ফালাহ বহুমুখী সমবায় (ডেমো)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
              <span className="text-slate-500 font-medium">সিমুলেটেড রোল:</span>
              <select
                value={simulatedRole}
                onChange={(e) => setSimulatedRole(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden"
              >
                <option value="admin">অ্যাডমিন (Admin - Full)</option>
                <option value="manager">ম্যানেজার (Manager - Edit)</option>
                <option value="viewer">ভিউয়ার (Viewer - Read Only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Domain Isolation & Shariah Foundation Info Banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">1</div>
            <div>
              <p className="font-bold text-slate-800">খাত (Head)</p>
              <p className="text-slate-500">টাকা কেন এসেছে বা কেন খরচ হয়েছে তার কারণ।</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">2</div>
            <div>
              <p className="font-bold text-slate-800">তহবিল (Fund)</p>
              <p className="text-slate-500">কোন উদ্দেশ্য বা শ্রেণির অর্থ সংরক্ষিত আছে।</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">3</div>
            <div>
              <p className="font-bold text-slate-800">হিসাব (Account - Future)</p>
              <p className="text-slate-500">টাকা বর্তমানে কোথায় (ক্যাশ/ব্যাংক) গচ্ছিত রয়েছে।</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Definition Category Pills (Navigation) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => { setSelectedDefinitionId('all'); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedDefinitionId === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          সকল মাস্টার ডাটা ({currentOrgItems.length})
        </button>

        {currentOrgDefinitions.map(def => {
          const count = currentOrgItems.filter(it => it.definitionId === def.id).length;
          return (
            <button
              key={def.id}
              onClick={() => { setSelectedDefinitionId(def.id); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedDefinitionId === def.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{def.displayName}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-xs ${
                selectedDefinitionId === def.id ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Search, Filter & Action Bar */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="মাস্টার ডাটার নাম, কোড বা বিবরণ দিয়ে খুঁজুন..."
              value={filters.searchQuery || ''}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-1.5 transition-colors"
              title="CSV এক্সপোর্ট"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">এক্সপোর্ট</span>
            </button>

            <button
              onClick={() => setIsPrintViewOpen(true)}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-1.5 transition-colors"
              title="A4 প্রিন্ট ভিউ"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">প্রিন্ট</span>
            </button>

            <button
              onClick={() => { setSelectedItemAudit(null); setIsAuditModalOpen(true); }}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-1.5 transition-colors"
              title="অডিট ট্রেইল"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">অডিট লগ</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              disabled={simulatedRole === 'viewer'}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              নতুন আইটেম
            </button>
          </div>
        </div>

        {/* Sub-Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">স্ট্যাটাস:</span>
            <select
              value={filters.status || 'all'}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, status: e.target.value as any }));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="all">সকল স্থিতি</option>
              <option value="active">সক্রিয় (Active)</option>
              <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
              <option value="archived">আর্কাইভকৃত (Archived)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">উৎস:</span>
            <select
              value={filters.origin || 'all'}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, origin: e.target.value as any }));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="all">সকল উৎস</option>
              <option value="system">সিস্টেম নির্ধারিত</option>
              <option value="custom">প্রতিষ্ঠান কাস্টম</option>
            </select>
          </div>

          <div className="ml-auto text-slate-500">
            মোট রেকর্ড: <strong className="text-slate-800 font-semibold">{filteredItems.length}</strong> টি
          </div>
        </div>
      </div>

      {/* 4. Master Data Register Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">ক্রম</th>
                <th className="py-3 px-4">ক্যাটাগরি</th>
                <th className="py-3 px-4">কোড (Code)</th>
                <th className="py-3 px-4">মাস্টার ডাটার নাম</th>
                <th className="py-3 px-4">বিবরণ</th>
                <th className="py-3 px-4 text-center">উৎস</th>
                <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-center">ব্যবহার</th>
                <th className="py-3 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Database className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="font-semibold text-slate-600">কোনো মাস্টার ডাটা পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-400 mt-0.5">নতুন আইটেম তৈরি করতে উপরের বোতামে ক্লিক করুন</p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-500 font-mono text-xs">
                        {globalIdx}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 text-xs">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60">
                          {getDefinitionName(item.definitionId)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 text-xs">
                        {item.code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs max-w-xs truncate" title={item.description}>
                        {item.description || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.isSystemDefined ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            <Lock className="w-3 h-3 text-slate-400" />
                            সিস্টেম
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Tag className="w-3 h-3 text-indigo-500" />
                            কাস্টম
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            সক্রিয়
                          </span>
                        )}
                        {item.status === 'inactive' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <XCircle className="w-3 h-3 text-amber-500" />
                            নিষ্ক্রিয়
                          </span>
                        )}
                        {item.status === 'archived' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            <Archive className="w-3 h-3 text-slate-400" />
                            আর্কাইভকৃত
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-600">
                        {item.usageCount || 0}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setSelectedItemAudit(item); setIsAuditModalOpen(true); }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                            title="ইতিহাস ও অডিট"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(item)}
                            disabled={simulatedRole === 'viewer'}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded disabled:opacity-30 transition-colors"
                            title="সম্পাদনা"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {item.status === 'active' && (
                            <button
                              onClick={() => setStatusConfirmItem({ item, targetStatus: 'inactive' })}
                              disabled={simulatedRole === 'viewer'}
                              className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded disabled:opacity-30 transition-colors"
                              title="নিষ্ক্রিয় করুন"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {item.status === 'inactive' && (
                            <button
                              onClick={() => setStatusConfirmItem({ item, targetStatus: 'active' })}
                              disabled={simulatedRole === 'viewer'}
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded disabled:opacity-30 transition-colors"
                              title="সক্রিয় করুন"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {item.status !== 'archived' && (
                            <button
                              onClick={() => setStatusConfirmItem({ item, targetStatus: 'archived' })}
                              disabled={simulatedRole === 'viewer'}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded disabled:opacity-30 transition-colors"
                              title="আর্কাইভ করুন (স্থায়ী মুছবে না)"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-slate-100 p-3 space-y-3">
          {paginatedItems.map((item) => (
            <div key={item.id} className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {item.code}
                  </span>
                  <h4 className="font-bold text-slate-900 mt-1">{item.name}</h4>
                  <p className="text-xs text-slate-500">{getDefinitionName(item.definitionId)}</p>
                </div>
                <div>
                  {item.status === 'active' && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">সক্রিয়</span>
                  )}
                  {item.status === 'inactive' && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">নিষ্ক্রিয়</span>
                  )}
                  {item.status === 'archived' && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-200 text-slate-700">আর্কাইভ</span>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200/60">
                  {item.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500">
                <span>ব্যবহার: {item.usageCount || 0} টি রেকর্ড</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    disabled={simulatedRole === 'viewer'}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-blue-600 font-medium"
                  >
                    সম্পাদনা
                  </button>
                  {item.status === 'active' ? (
                    <button
                      onClick={() => setStatusConfirmItem({ item, targetStatus: 'inactive' })}
                      disabled={simulatedRole === 'viewer'}
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-amber-600 font-medium"
                    >
                      নিষ্ক্রিয়
                    </button>
                  ) : (
                    <button
                      onClick={() => setStatusConfirmItem({ item, targetStatus: 'active' })}
                      disabled={simulatedRole === 'viewer'}
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-emerald-600 font-medium"
                    >
                      সক্রিয়
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="py-3 px-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            পৃষ্ঠা <strong className="text-slate-900">{currentPage}</strong> / <strong className="text-slate-900">{totalPages}</strong> (মোট {filteredItems.length} টি আইটেম)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Create / Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                {editingItem ? 'মাস্টার ডাটা সম্পাদনা' : 'নতুন মাস্টার ডাটা আইটেম'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4 text-sm">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  মাস্টার ডাটা টাইপ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.definitionId}
                  onChange={(e) => setFormData(prev => ({ ...prev, definitionId: e.target.value }))}
                  disabled={!!editingItem}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 disabled:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                >
                  {currentOrgDefinitions.map(def => (
                    <option key={def.id} value={def.id}>
                      {def.displayName} ({def.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    অনন্য কোড (Code) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: SALT_FARMER"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    disabled={!!editingItem}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs uppercase bg-white disabled:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">তৈরির পর কোড অপরিবর্তনীয় থাকবে।</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ক্রম নম্বর (Sort Order)
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  মাস্টার ডাটার নাম (বাংলা) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: লবণ চাষী ও মৎস্যজীবী"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  বিস্তারিত বিবরণ (ঐচ্ছিক)
                </label>
                <textarea
                  placeholder="মাস্টার ডাটার উদ্দেশ্য বা ব্যবহারের ক্ষেত্র..."
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  পরিবর্তনের কারণ (অডিট ট্রেইল)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: নতুন পেশা অন্তর্ভুক্তি..."
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  {editingItem ? 'হালনাগাদ সংরক্ষণ' : 'আইটেম তৈরি করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Status Change Confirmation Modal */}
      {statusConfirmItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  স্ট্যাটাস পরিবর্তনের নিশ্চিতকরণ
                </h3>
                <p className="text-xs text-slate-500">
                  আইটেম: <span className="font-semibold text-slate-800">{statusConfirmItem.item.name}</span>
                </p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200/80 text-xs text-amber-800 space-y-1">
              <p className="font-semibold">সতর্কতা ও লাইফসাইকেল নিয়ম:</p>
              <p>• নিষ্ক্রিয় বা আর্কাইভকৃত আইটেম নতুন এন্ট্রি বা সিলেকশনে পাওয়া যাবে না।</p>
              <p>• পূর্বে ব্যবহৃত রেফারেন্সসমূহ অক্ষুণ্ণ থাকবে (Historical Reference Safety)।</p>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                স্ট্যাটাস পরিবর্তনের কারণ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: মৌসুমি পেশা সাময়িক বন্ধ বা সিদ্ধান্ত..."
                value={statusChangeReason}
                onChange={(e) => setStatusChangeReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => { setStatusConfirmItem(null); setStatusChangeReason(''); }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleExecuteStatusChange}
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-xs"
              >
                পরিবর্তন নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Audit Log Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  মাস্টার ডাটা অপরিবর্তনীয় অডিট ট্রেইল
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedItemAudit ? `নির্দিষ্ট আইটেম: ${selectedItemAudit.name} (${selectedItemAudit.code})` : 'প্রতিষ্ঠানের সামগ্রিক মাস্টার ডাটা পরিবর্তন ইতিহাস'}
                </p>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {auditLogs.filter(l => l.organizationId === orgId && (!selectedItemAudit || l.entityId === selectedItemAudit.id)).length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>কোনো অডিট লগ রেকর্ড পাওয়া যায়নি</p>
                </div>
              ) : (
                auditLogs
                  .filter(l => l.organizationId === orgId && (!selectedItemAudit || l.entityId === selectedItemAudit.id))
                  .map(log => (
                    <div key={log.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800' :
                          log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                          log.action === 'ACTIVATE' ? 'bg-teal-100 text-teal-800' :
                          log.action === 'DEACTIVATE' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-200 text-slate-800'
                        }`}>
                          {log.action}
                        </span>
                        <span className="text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleString('bn-BD')}
                        </span>
                      </div>

                      <p className="font-semibold text-slate-800">{log.changesSummary || 'মাস্টার ডাটা অপারেশন সম্পন্ন'}</p>
                      {log.reason && (
                        <p className="text-slate-600 bg-white p-2 rounded border border-slate-200/60">
                          <strong>কারণ:</strong> {log.reason}
                        </p>
                      )}

                      <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>সম্পাদনকারী: <strong className="text-slate-600">{log.actorName}</strong></span>
                        <span className="font-mono">ID: {log.actorUserId}</span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-medium text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. A4 Printable Master Register Modal */}
      {isPrintViewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full p-8 shadow-2xl border border-slate-300 max-h-[90vh] flex flex-col overflow-y-auto font-hind">
            {/* Official Header */}
            <div className="text-center pb-4 border-b-2 border-slate-800">
              <h2 className="text-xl font-bold text-slate-900">{currentOrg.name}</h2>
              <p className="text-xs text-slate-600">ইসলামি মূল্যবোধে পরিচালিত বহুমুখী সমবায় সমিতি</p>
              <h3 className="text-base font-bold text-slate-800 mt-2 bg-slate-100 inline-block px-4 py-1 rounded border border-slate-300">
                অফিসিয়াল মাস্টার ডাটা রেজিস্টার ও কনফিগারেশন তালিকা
              </h3>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-slate-600 my-4">
              <span>মুদ্রণের তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
              <span>মোট রেকর্ড সংখ্যা: {filteredItems.length} টি</span>
              <span>প্রতিষ্ঠানের কোড: {currentOrg.code}</span>
            </div>

            {/* Print Table */}
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                  <th className="p-2 border-r border-slate-300 text-center">ক্রম</th>
                  <th className="p-2 border-r border-slate-300">ক্যাটাগরি</th>
                  <th className="p-2 border-r border-slate-300">কোড</th>
                  <th className="p-2 border-r border-slate-300">নাম</th>
                  <th className="p-2 border-r border-slate-300">বিবরণ</th>
                  <th className="p-2 border-r border-slate-300 text-center">টাইপ</th>
                  <th className="p-2 text-center">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((it, idx) => (
                  <tr key={it.id} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-300 text-center font-mono">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-300 font-medium">{getDefinitionName(it.definitionId)}</td>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold">{it.code}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{it.name}</td>
                    <td className="p-2 border-r border-slate-300 text-slate-600">{it.description || '—'}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{it.isSystemDefined ? 'সিস্টেম' : 'কাস্টম'}</td>
                    <td className="p-2 text-center">
                      {it.status === 'active' ? 'সক্রিয়' : it.status === 'inactive' ? 'নিষ্ক্রিয়' : 'আর্কাইভকৃত'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Official Signature Footer */}
            <div className="grid grid-cols-2 gap-8 pt-16 mt-auto text-xs text-center">
              <div>
                <div className="w-48 mx-auto border-t border-slate-800 pt-1 font-bold text-slate-800">
                  প্রস্তুতকারীর স্বাক্ষর
                </div>
                <p className="text-slate-500">মাস্টার ডাটা এন্ট্রি কর্মকর্তা</p>
              </div>
              <div>
                <div className="w-48 mx-auto border-t border-slate-800 pt-1 font-bold text-slate-800">
                  অনুমোদনকারীর স্বাক্ষর
                </div>
                <p className="text-slate-500">সাধারণ সম্পাদক / সভাপতি</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPrintViewOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
              >
                প্রিন্ট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
