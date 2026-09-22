import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Tag, 
  Users, 
  Heart, 
  Briefcase, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpDown, 
  ToggleLeft, 
  ToggleRight, 
  Lock, 
  Sparkles,
  RefreshCw,
  Building2
} from 'lucide-react';
import { 
  OrganizationContext, 
  MemberClassificationType, 
  MemberMasterDataType, 
  MasterDataCategoryType,
  RelationTypeConfig 
} from '../types';

interface MemberMasterDataManagementViewProps {
  currentOrg: OrganizationContext;
  onSyncOrganization?: (orgId: string, orgName: string) => void;
}

// Initial default templates for demo organizations
export const INITIAL_CLASSIFICATIONS: Record<string, MemberClassificationType[]> = {
  'demo-org-khurushkul': [
    {
      id: 'cls-001',
      organizationId: 'demo-org-khurushkul',
      code: 'FOUNDER',
      name: 'প্রতিষ্ঠাতা সদস্য',
      description: 'সমিতি প্রতিষ্ঠার প্রাথমিক উদ্যোক্তা ও প্রতিষ্ঠাতা সদস্যবৃন্দ',
      sortOrder: 1,
      isActive: true,
      isSystemDefined: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'system',
    },
    {
      id: 'cls-002',
      organizationId: 'demo-org-khurushkul',
      code: 'GENERAL',
      name: 'সাধারণ সদস্য',
      description: 'সমিতির সাধারণ পূর্ণাঙ্গ সদস্য',
      sortOrder: 2,
      isActive: true,
      isSystemDefined: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'system',
    },
    {
      id: 'cls-003',
      organizationId: 'demo-org-khurushkul',
      code: 'ASSOCIATE',
      name: 'সহযোগী সদস্য',
      description: 'সহযোগী বা বিশেষ প্রকল্পে যুক্ত সদস্য',
      sortOrder: 3,
      isActive: true,
      isSystemDefined: false,
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
      createdBy: 'usr-admin-01',
    },
    {
      id: 'cls-004',
      organizationId: 'demo-org-khurushkul',
      code: 'HONORARY',
      name: 'সম্মানসূচক সদস্য',
      description: 'বিশিষ্ট আলেম ও উপদেষ্টামণ্ডলীর সম্মানসূচক সদস্যপদ',
      sortOrder: 4,
      isActive: true,
      isSystemDefined: false,
      createdAt: '2023-02-15T00:00:00.000Z',
      updatedAt: '2023-02-15T00:00:00.000Z',
      createdBy: 'usr-admin-01',
    },
    {
      id: 'cls-005',
      organizationId: 'demo-org-khurushkul',
      code: 'STUDENT',
      name: 'শিক্ষার্থী সদস্য',
      description: 'কওমি/মাদরাসা ও বিশ্ববিদ্যালয়ের শিক্ষার্থীদের জন্য বিশেষ সদস্য শ্রেণি',
      sortOrder: 5,
      isActive: false,
      isSystemDefined: false,
      createdAt: '2023-03-01T00:00:00.000Z',
      updatedAt: '2023-03-01T00:00:00.000Z',
      createdBy: 'usr-admin-01',
    },
  ],
  'org-alfalah-01': [
    {
      id: 'cls-alf-001',
      organizationId: 'org-alfalah-01',
      code: 'GENERAL',
      name: 'সাধারণ সদস্য',
      description: 'আল-ফালাহ সাধারণ সদস্য',
      sortOrder: 1,
      isActive: true,
      isSystemDefined: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'system',
    },
  ],
};

export const INITIAL_RELATION_TYPES: Record<string, RelationTypeConfig[]> = {
  'demo-org-khurushkul': [
    {
      id: 'rel-001',
      organizationId: 'demo-org-khurushkul',
      code: 'FATHER',
      name: 'পিতা',
      reciprocalCode: 'CHILD',
      reciprocalName: 'সন্তান',
      description: 'পিতা ও সন্তানের পারিবারিক সম্পর্ক',
      sortOrder: 1,
      isActive: true,
      isSystemDefined: true,
    },
    {
      id: 'rel-002',
      organizationId: 'demo-org-khurushkul',
      code: 'MOTHER',
      name: 'মাতা',
      reciprocalCode: 'CHILD',
      reciprocalName: 'সন্তান',
      description: 'মাতা ও সন্তানের পারিবারিক সম্পর্ক',
      sortOrder: 2,
      isActive: true,
      isSystemDefined: true,
    },
    {
      id: 'rel-003',
      organizationId: 'demo-org-khurushkul',
      code: 'HUSBAND',
      name: 'স্বামী',
      reciprocalCode: 'WIFE',
      reciprocalName: 'স্ত্রী',
      description: 'বৈবাহিক সম্পর্ক (স্বামী)',
      sortOrder: 3,
      isActive: true,
      isSystemDefined: true,
    },
    {
      id: 'rel-004',
      organizationId: 'demo-org-khurushkul',
      code: 'WIFE',
      name: 'স্ত্রী',
      reciprocalCode: 'HUSBAND',
      reciprocalName: 'স্বামী',
      description: 'বৈবাহিক সম্পর্ক (স্ত্রী)',
      sortOrder: 4,
      isActive: true,
      isSystemDefined: true,
    },
    {
      id: 'rel-005',
      organizationId: 'demo-org-khurushkul',
      code: 'SON',
      name: 'ছেলে',
      reciprocalCode: 'PARENT',
      reciprocalName: 'পিতা/মাতা',
      description: 'পুত্র সন্তান',
      sortOrder: 5,
      isActive: true,
      isSystemDefined: true,
    },
    {
      id: 'rel-006',
      organizationId: 'demo-org-khurushkul',
      code: 'DAUGHTER',
      name: 'মেয়ে',
      reciprocalCode: 'PARENT',
      reciprocalName: 'পিতা/মাতা',
      description: 'কন্যা সন্তান',
      sortOrder: 6,
      isActive: true,
      isSystemDefined: true,
    },
    {
      id: 'rel-007',
      organizationId: 'demo-org-khurushkul',
      code: 'BROTHER',
      name: 'ভাই',
      reciprocalCode: 'SIBLING',
      reciprocalName: 'ভাই/বোন',
      description: 'সহোদর ভাই',
      sortOrder: 7,
      isActive: true,
      isSystemDefined: true,
    },
    {
      id: 'rel-008',
      organizationId: 'demo-org-khurushkul',
      code: 'SISTER',
      name: 'বোন',
      reciprocalCode: 'SIBLING',
      reciprocalName: 'ভাই/বোন',
      description: 'সহোদর বোন',
      sortOrder: 8,
      isActive: true,
      isSystemDefined: true,
    },
    {
      id: 'rel-009',
      organizationId: 'demo-org-khurushkul',
      code: 'GUARDIAN',
      name: 'আইনানুগ অভিভাবক',
      reciprocalCode: 'DEPENDENT',
      reciprocalName: 'পোষ্য/আশ্রিত',
      description: 'আইনগত ও আর্থিক অভিভাবকত্ব',
      sortOrder: 9,
      isActive: true,
      isSystemDefined: false,
    },
    {
      id: 'rel-010',
      organizationId: 'demo-org-khurushkul',
      code: 'OTHER',
      name: 'অন্যান্য রক্ত সম্পর্ক',
      description: 'চাচা, মামা বা নিকটাত্মীয়',
      sortOrder: 10,
      isActive: true,
      isSystemDefined: false,
    },
  ],
  'org-alfalah-01': [
    {
      id: 'rel-alf-001',
      organizationId: 'org-alfalah-01',
      code: 'FATHER',
      name: 'পিতা',
      reciprocalCode: 'CHILD',
      reciprocalName: 'সন্তান',
      sortOrder: 1,
      isActive: true,
      isSystemDefined: true,
    },
  ],
};

export const INITIAL_MASTER_DATA: Record<string, MemberMasterDataType[]> = {
  'demo-org-khurushkul': [
    // Occupation
    {
      id: 'occ-001',
      organizationId: 'demo-org-khurushkul',
      masterType: 'occupation',
      code: 'TEACHER_MADRASAH',
      name: 'মাদ্রাসা শিক্ষক ও খতিব',
      sortOrder: 1,
      isActive: true,
      isSystemDefined: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'occ-002',
      organizationId: 'demo-org-khurushkul',
      masterType: 'occupation',
      code: 'BUSINESS_FARM',
      name: 'ব্যবসায়ী ও খামার পরিচালক',
      sortOrder: 2,
      isActive: true,
      isSystemDefined: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'occ-003',
      organizationId: 'demo-org-khurushkul',
      masterType: 'occupation',
      code: 'BUSINESS_BOOK',
      name: 'ইসলামি বই ব্যবসায়ী ও প্রকাশক',
      sortOrder: 3,
      isActive: true,
      isSystemDefined: false,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'occ-004',
      organizationId: 'demo-org-khurushkul',
      masterType: 'occupation',
      code: 'TEACHER_GENERAL',
      name: 'স্কুল/কলেজ শিক্ষক',
      sortOrder: 4,
      isActive: true,
      isSystemDefined: false,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    // Gender
    {
      id: 'gnd-001',
      organizationId: 'demo-org-khurushkul',
      masterType: 'gender',
      code: 'male',
      name: 'পুরুষ',
      sortOrder: 1,
      isActive: true,
      isSystemDefined: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'gnd-002',
      organizationId: 'demo-org-khurushkul',
      masterType: 'gender',
      code: 'female',
      name: 'মহিলা',
      sortOrder: 2,
      isActive: true,
      isSystemDefined: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'gnd-003',
      organizationId: 'demo-org-khurushkul',
      masterType: 'gender',
      code: 'other',
      name: 'অন্যান্য',
      sortOrder: 3,
      isActive: true,
      isSystemDefined: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
  ],
};

export const MemberMasterDataManagementView: React.FC<MemberMasterDataManagementViewProps> = ({
  currentOrg,
}) => {
  const [activeTab, setActiveTab] = useState<'classification' | 'relation_type' | 'occupation' | 'gender'>('classification');
  
  // Organization scoped states
  const [classificationsByOrg, setClassificationsByOrg] = useState(INITIAL_CLASSIFICATIONS);
  const [relationTypesByOrg, setRelationTypesByOrg] = useState(INITIAL_RELATION_TYPES);
  const [masterDataByOrg, setMasterDataByOrg] = useState(INITIAL_MASTER_DATA);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    sortOrder: 1,
    reciprocalCode: '',
    reciprocalName: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const orgId = currentOrg.id;

  // Active items for current org
  const currentClassifications = useMemo(() => {
    return (classificationsByOrg[orgId] || []).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [classificationsByOrg, orgId]);

  const currentRelationTypes = useMemo(() => {
    return (relationTypesByOrg[orgId] || []).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [relationTypesByOrg, orgId]);

  const currentOccupations = useMemo(() => {
    return (masterDataByOrg[orgId] || [])
      .filter((m) => m.masterType === 'occupation')
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [masterDataByOrg, orgId]);

  const currentGenders = useMemo(() => {
    return (masterDataByOrg[orgId] || [])
      .filter((m) => m.masterType === 'gender')
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [masterDataByOrg, orgId]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Toggle status (Soft Delete)
  const handleToggleClassificationStatus = (id: string) => {
    setClassificationsByOrg((prev) => {
      const list = prev[orgId] || [];
      const updated = list.map((item) => {
        if (item.id === id) {
          return { ...item, isActive: !item.isActive, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      return { ...prev, [orgId]: updated };
    });
    showToast('শ্রেণির স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে');
  };

  const handleToggleRelationTypeStatus = (id: string) => {
    setRelationTypesByOrg((prev) => {
      const list = prev[orgId] || [];
      const updated = list.map((item) => {
        if (item.id === id) {
          return { ...item, isActive: !item.isActive };
        }
        return item;
      });
      return { ...prev, [orgId]: updated };
    });
    showToast('সম্পর্কের ধরনের স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে');
  };

  const handleToggleMasterDataStatus = (id: string) => {
    setMasterDataByOrg((prev) => {
      const list = prev[orgId] || [];
      const updated = list.map((item) => {
        if (item.id === id) {
          return { ...item, isActive: !item.isActive, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      return { ...prev, [orgId]: updated };
    });
    showToast('মাস্টার ডাটা স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে');
  };

  // Open Create/Edit modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    let nextSort = 1;
    if (activeTab === 'classification') nextSort = currentClassifications.length + 1;
    if (activeTab === 'relation_type') nextSort = currentRelationTypes.length + 1;
    if (activeTab === 'occupation') nextSort = currentOccupations.length + 1;
    if (activeTab === 'gender') nextSort = currentGenders.length + 1;

    setFormData({
      code: '',
      name: '',
      description: '',
      sortOrder: nextSort,
      reciprocalCode: '',
      reciprocalName: '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description || '',
      sortOrder: item.sortOrder || 1,
      reciprocalCode: item.reciprocalCode || '',
      reciprocalName: item.reciprocalName || '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const code = formData.code.trim().toUpperCase();
    const name = formData.name.trim();

    if (!code) {
      setFormError('কোড অবশ্যই পূরণ করতে হবে (যেমন: GENERAL, FOUNDER)');
      return;
    }
    if (!name) {
      setFormError('নাম অবশ্যই পূরণ করতে হবে');
      return;
    }

    if (activeTab === 'classification') {
      // Check duplicate code
      const duplicate = currentClassifications.some(
        (c) => c.code === code && (!editingItem || c.id !== editingItem.id)
      );
      if (duplicate) {
        setFormError(`'${code}' কোডটি এই সংস্থায় ইতোমধ্যে বিদ্যমান`);
        return;
      }

      if (editingItem) {
        setClassificationsByOrg((prev) => {
          const list = prev[orgId] || [];
          const updated = list.map((c) =>
            c.id === editingItem.id
              ? {
                  ...c,
                  code,
                  name,
                  description: formData.description.trim() || undefined,
                  sortOrder: Number(formData.sortOrder) || 1,
                  updatedAt: new Date().toISOString(),
                }
              : c
          );
          return { ...prev, [orgId]: updated };
        });
        showToast('সদস্য শ্রেণি সফলভাবে হালনাগাদ করা হয়েছে');
      } else {
        const newItem: MemberClassificationType = {
          id: `cls-custom-${Date.now()}`,
          organizationId: orgId,
          code,
          name,
          description: formData.description.trim() || undefined,
          sortOrder: Number(formData.sortOrder) || 1,
          isActive: true,
          isSystemDefined: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'usr-admin-01',
        };
        setClassificationsByOrg((prev) => ({
          ...prev,
          [orgId]: [...(prev[orgId] || []), newItem],
        }));
        showToast('নতুন সদস্য শ্রেণি সফলভাবে সংরক্ষিত হয়েছে');
      }
    } else if (activeTab === 'relation_type') {
      // Check duplicate code
      const duplicate = currentRelationTypes.some(
        (r) => r.code === code && (!editingItem || r.id !== editingItem.id)
      );
      if (duplicate) {
        setFormError(`'${code}' সম্পর্কের কোডটি ইতোমধ্যে বিদ্যমান`);
        return;
      }

      if (editingItem) {
        setRelationTypesByOrg((prev) => {
          const list = prev[orgId] || [];
          const updated = list.map((r) =>
            r.id === editingItem.id
              ? {
                  ...r,
                  code,
                  name,
                  reciprocalCode: formData.reciprocalCode?.trim() || undefined,
                  reciprocalName: formData.reciprocalName?.trim() || undefined,
                  description: formData.description.trim() || undefined,
                  sortOrder: Number(formData.sortOrder) || 1,
                }
              : r
          );
          return { ...prev, [orgId]: updated };
        });
        showToast('সম্পর্কের ধরন সফলভাবে হালনাগাদ করা হয়েছে');
      } else {
        const newItem: RelationTypeConfig = {
          id: `rel-custom-${Date.now()}`,
          organizationId: orgId,
          code,
          name,
          reciprocalCode: formData.reciprocalCode?.trim() || undefined,
          reciprocalName: formData.reciprocalName?.trim() || undefined,
          description: formData.description.trim() || undefined,
          sortOrder: Number(formData.sortOrder) || 1,
          isActive: true,
          isSystemDefined: false,
        };
        setRelationTypesByOrg((prev) => ({
          ...prev,
          [orgId]: [...(prev[orgId] || []), newItem],
        }));
        showToast('নতুন সম্পর্কের ধরন সফলভাবে সংরক্ষিত হয়েছে');
      }
    } else {
      // Master data (occupation / gender)
      const mType: MasterDataCategoryType = activeTab;
      const list = activeTab === 'occupation' ? currentOccupations : currentGenders;
      const duplicate = list.some(
        (m) => m.code === code && (!editingItem || m.id !== editingItem.id)
      );
      if (duplicate) {
        setFormError(`'${code}' কোডটি ইতোমধ্যে বিদ্যমান`);
        return;
      }

      if (editingItem) {
        setMasterDataByOrg((prev) => {
          const allOrgData = prev[orgId] || [];
          const updated = allOrgData.map((m) =>
            m.id === editingItem.id
              ? {
                  ...m,
                  code,
                  name,
                  description: formData.description.trim() || undefined,
                  sortOrder: Number(formData.sortOrder) || 1,
                  updatedAt: new Date().toISOString(),
                }
              : m
          );
          return { ...prev, [orgId]: updated };
        });
        showToast('মাস্টার ডাটা সফলভাবে হালনাগাদ করা হয়েছে');
      } else {
        const newItem: MemberMasterDataType = {
          id: `md-${Date.now()}`,
          organizationId: orgId,
          masterType: mType,
          code,
          name,
          description: formData.description.trim() || undefined,
          sortOrder: Number(formData.sortOrder) || 1,
          isActive: true,
          isSystemDefined: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setMasterDataByOrg((prev) => ({
          ...prev,
          [orgId]: [...(prev[orgId] || []), newItem],
        }));
        showToast('নতুন মাস্টার ডাটা সফলভাবে তৈরি হয়েছে');
      }
    }

    setIsModalOpen(false);
  };

  // Filter items
  const filteredList = useMemo(() => {
    let source: any[] = [];
    if (activeTab === 'classification') source = currentClassifications;
    if (activeTab === 'relation_type') source = currentRelationTypes;
    if (activeTab === 'occupation') source = currentOccupations;
    if (activeTab === 'gender') source = currentGenders;

    return source.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && item.isActive) ||
        (statusFilter === 'inactive' && !item.isActive);

      return matchSearch && matchStatus;
    });
  }, [
    activeTab,
    currentClassifications,
    currentRelationTypes,
    currentOccupations,
    currentGenders,
    searchTerm,
    statusFilter,
  ]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-emerald-500/40 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header & Isolation Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  মেম্বার মাস্টার ডাটা ও শ্রেণি কনফিগারেশন
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-numeric">
                  Prompt 3.4
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                সদস্য শ্রেণি, সম্পর্কের ধরন ও ড্রপডাউন ডাটার নিরাপদ অর্গানাইজেশন-লেভেল কনফিগারেশন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-numeric">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>সংগঠন: <strong className="text-slate-900">{currentOrg.name}</strong></span>
            </div>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন এন্ট্রি যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Master Category Tabs */}
        <div className="flex border-b border-slate-200 mt-6 overflow-x-auto text-xs font-semibold font-numeric">
          <button
            onClick={() => {
              setActiveTab('classification');
              setSearchTerm('');
            }}
            className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'classification'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            ১. সদস্য শ্রেণি ({currentClassifications.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('relation_type');
              setSearchTerm('');
            }}
            className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'relation_type'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            ২. সম্পর্কের ধরন ({currentRelationTypes.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('occupation');
              setSearchTerm('');
            }}
            className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'occupation'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            ৩. পেশা তালিকা ({currentOccupations.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('gender');
              setSearchTerm('');
            }}
            className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'gender'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            ৪. লিঙ্গ তালিকা ({currentGenders.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-numeric">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="নাম বা কোড দিয়ে অনুসন্ধান..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-slate-500 font-medium">স্ট্যাটাস:</span>
          {(['all', 'active', 'inactive'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition ${
                statusFilter === st
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'সকল' : st === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-numeric">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5 text-center w-16">ক্রম</th>
                <th className="px-4 py-3.5">কোড</th>
                <th className="px-4 py-3.5">নাম</th>
                {activeTab === 'relation_type' && <th className="px-4 py-3.5">বিপরীত সম্পর্ক</th>}
                <th className="px-4 py-3.5">বিবরণ</th>
                <th className="px-4 py-3.5 text-center">টাইপ</th>
                <th className="px-4 py-3.5 text-center">স্ট্যাটাস</th>
                <th className="px-4 py-3.5 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'relation_type' ? 8 : 7} className="px-4 py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    কোনো মাস্টার ডাটা এন্ট্রি পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3.5 text-center font-mono text-slate-500 font-bold">
                      {item.sortOrder}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                        {item.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold font-heading text-slate-900">
                      {item.name}
                    </td>
                    {activeTab === 'relation_type' && (
                      <td className="px-4 py-3.5 text-slate-600">
                        {item.reciprocalName ? (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                            ↔ {item.reciprocalName} ({item.reciprocalCode})
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">প্রযোজ্য নয়</span>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3.5 text-slate-500 max-w-xs truncate">
                      {item.description || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {item.isSystemDefined ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <Lock className="w-3 h-3" />
                          System
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          Custom
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => {
                          if (activeTab === 'classification') handleToggleClassificationStatus(item.id);
                          else if (activeTab === 'relation_type') handleToggleRelationTypeStatus(item.id);
                          else handleToggleMasterDataStatus(item.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                          item.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title="স্ট্যাটাস টগল করতে ক্লিক করুন"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        {item.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                        title="সম্পাদনা করুন"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 font-heading">
                {editingItem ? 'এন্ট্রি সম্পাদনা' : 'নতুন মাস্টার ডাটা এন্ট্রি'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 text-xs font-numeric">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  কোড (Code) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="যেমন: GENERAL, FOUNDER"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-700/20"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">ইউনিক ও ক্যাপিটাল ইংরেজি অক্ষরে লিখুন</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  নাম (বাংলায়) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="যেমন: সাধারণ সদস্য, পিতা"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-heading font-bold focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              {activeTab === 'relation_type' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      বিপরীত কোড
                    </label>
                    <input
                      type="text"
                      value={formData.reciprocalCode}
                      onChange={(e) => setFormData({ ...formData, reciprocalCode: e.target.value.toUpperCase() })}
                      placeholder="যেমন: CHILD"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      বিপরীত নাম
                    </label>
                    <input
                      type="text"
                      value={formData.reciprocalName}
                      onChange={(e) => setFormData({ ...formData, reciprocalName: e.target.value })}
                      placeholder="যেমন: সন্তান"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    ক্রম (Sort Order)
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    min={1}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    সংগঠন
                  </label>
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 truncate">
                    {currentOrg.name}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  বিবরণ / নোট (ঐচ্ছিক)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="এন্ট্রি সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs transition"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
