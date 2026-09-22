import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Camera, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  XCircle, 
  Archive, 
  Eye, 
  EyeOff, 
  Download, 
  Printer, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  RefreshCw, 
  ExternalLink, 
  HardDrive, 
  Sparkles, 
  Check, 
  Trash2, 
  Layers, 
  Lock, 
  AlertTriangle, 
  Image as ImageIcon,
  Building2,
  Calendar,
  Tag,
  UserCheck,
  Info
} from 'lucide-react';
import { 
  MemberType, 
  OrganizationContext, 
  MemberPhotoType, 
  MemberPhotoCategory,
  MemberDocumentType, 
  DocumentTypeConfig, 
  DocumentVerificationStatus,
  DocumentStorageType,
  GoogleDriveReference,
  DocumentAuditLogType
} from '../types';

// ==========================================
// Seed Master Data: Configurable Document Types
// ==========================================
export const INITIAL_DOCUMENT_TYPES: Record<string, DocumentTypeConfig[]> = {
  'demo-org-khurushkul': [
    {
      id: 'doctype-001',
      organizationId: 'demo-org-khurushkul',
      code: 'NID',
      name: 'জাতীয় পরিচয়পত্র (NID)',
      description: 'সদস্যের জাতীয় পরিচয়পত্র বা স্মার্ট কার্ডের কপি',
      isSystemDefined: true,
      isActive: true,
      sortOrder: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    },
    {
      id: 'doctype-002',
      organizationId: 'demo-org-khurushkul',
      code: 'BIRTH_CERT',
      name: 'জন্ম নিবন্ধন সনদ',
      description: 'সরকারি ডিজিটাল জন্ম নিবন্ধন সনদপত্র',
      isSystemDefined: true,
      isActive: true,
      sortOrder: 2,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    },
    {
      id: 'doctype-003',
      organizationId: 'demo-org-khurushkul',
      code: 'MEM_APP_FORM',
      name: 'সদস্যপদ আবেদন ও অঙ্গীকারনামা',
      description: 'স্বাক্ষরিত সদস্যপদ আবেদন ও শরিয়াহ অঙ্গীকারনামা',
      isSystemDefined: true,
      isActive: true,
      sortOrder: 3,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    },
    {
      id: 'doctype-004',
      organizationId: 'demo-org-khurushkul',
      code: 'ADDR_PROOF',
      name: 'ঠিকানা প্রমাণপত্র / ইউটিলিটি বিল',
      description: 'নাগরিক সনদ, হোল্ডিং ট্যাক্স রশিদ বা বিদ্যুৎ বিল কপি',
      isSystemDefined: false,
      isActive: true,
      sortOrder: 4,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'usr-admin-01'
    },
    {
      id: 'doctype-005',
      organizationId: 'demo-org-khurushkul',
      code: 'TRADE_LICENSE',
      name: 'ট্রেড লাইসেন্স বা পেশাগত সনদ',
      description: 'ব্যবসায়িক ট্রেড লাইসেন্স বা প্রাতিষ্ঠানিক অনুমোদন',
      isSystemDefined: false,
      isActive: true,
      sortOrder: 5,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'usr-admin-01'
    },
    {
      id: 'doctype-006',
      organizationId: 'demo-org-khurushkul',
      code: 'OTHER_DOC',
      name: 'অন্যান্য প্রশংসাপত্র ও দলিল',
      description: 'অন্যান্য প্রাসঙ্গিক সংযুক্তি ও দলিলাদি',
      isSystemDefined: false,
      isActive: true,
      sortOrder: 6,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'usr-admin-01'
    }
  ],
  'demo-org-alfalah': [
    {
      id: 'doctype-af-001',
      organizationId: 'demo-org-alfalah',
      code: 'NID',
      name: 'জাতীয় পরিচয়পত্র (NID)',
      description: 'আল-ফালাহ সমিতির সদস্য জাতীয় পরিচয়পত্র',
      isSystemDefined: true,
      isActive: true,
      sortOrder: 1,
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    },
    {
      id: 'doctype-af-002',
      organizationId: 'demo-org-alfalah',
      code: 'PASSPORT',
      name: 'আন্তর্জাতিক পাসপোর্ট',
      description: 'বৈধ পাসপোর্ট কপি',
      isSystemDefined: false,
      isActive: true,
      sortOrder: 2,
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
      createdBy: 'sys-admin'
    }
  ]
};

// ==========================================
// Seed Photos for Members
// ==========================================
export const INITIAL_MEMBER_PHOTOS: Record<string, MemberPhotoType[]> = {
  'demo-org-khurushkul': [
    {
      id: 'photo-001',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      fileName: 'ibrahim_khalil_profile.jpg',
      fileType: 'image/jpeg',
      fileSize: 245760, // ~240 KB
      storageReference: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      thumbnailReference: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      photoType: 'profile',
      isPrimary: true,
      uploadedAt: '2023-01-05T09:30:00.000Z',
      uploadedBy: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
      updatedAt: '2023-01-05T09:30:00.000Z',
      status: 'active'
    },
    {
      id: 'photo-002',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      fileName: 'ibrahim_khalil_nid_photo.jpg',
      fileType: 'image/jpeg',
      fileSize: 184320, // ~180 KB
      storageReference: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      thumbnailReference: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      photoType: 'identity',
      isPrimary: false,
      uploadedAt: '2023-01-05T09:35:00.000Z',
      uploadedBy: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
      updatedAt: '2023-01-05T09:35:00.000Z',
      status: 'active'
    },
    {
      id: 'photo-003',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-002',
      fileName: 'fazlul_karim_profile.jpg',
      fileType: 'image/jpeg',
      fileSize: 312400,
      storageReference: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      thumbnailReference: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      photoType: 'profile',
      isPrimary: true,
      uploadedAt: '2023-01-10T11:00:00.000Z',
      uploadedBy: 'কারী ফজলুল করিম',
      updatedAt: '2023-01-10T11:00:00.000Z',
      status: 'active'
    }
  ],
  'demo-org-alfalah': [
    {
      id: 'photo-af-001',
      organizationId: 'demo-org-alfalah',
      memberId: 'mem-af-001',
      fileName: 'tariqul_profile.jpg',
      fileType: 'image/jpeg',
      fileSize: 250000,
      storageReference: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      photoType: 'profile',
      isPrimary: true,
      uploadedAt: '2023-02-01T10:00:00.000Z',
      uploadedBy: 'প্রকৌশলী তরিকুল ইসলাম',
      updatedAt: '2023-02-01T10:00:00.000Z',
      status: 'active'
    }
  ]
};

// ==========================================
// Seed Documents for Members
// ==========================================
export const INITIAL_MEMBER_DOCUMENTS: Record<string, MemberDocumentType[]> = {
  'demo-org-khurushkul': [
    {
      id: 'doc-001',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      documentTypeId: 'doctype-001', // NID
      documentTitle: 'স্মার্ট জাতীয় পরিচয়পত্র (উভয় পিঠ)',
      documentNumberReference: '19851234567890123',
      description: 'সরকারি স্মার্ট জাতীয় পরিচয়পত্রের মূল কপি স্ক্যান',
      fileName: 'nid_smart_card_ibrahim.pdf',
      fileType: 'application/pdf',
      fileSize: 1450000, // ~1.45 MB
      storageType: 'local_reference',
      storageReference: '/storage/members/mem-001/nid_smart_card.pdf',
      issueDate: '2018-06-12',
      expiryDate: '2028-06-11',
      verificationStatus: 'verified',
      verifiedAt: '2023-01-06T14:20:00.000Z',
      verifiedBy: 'হাফেজ কারী আহমদ (যাচাই কর্মকর্তা)',
      createdAt: '2023-01-05T09:40:00.000Z',
      updatedAt: '2023-01-06T14:20:00.000Z',
      createdBy: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল'
    },
    {
      id: 'doc-002',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      documentTypeId: 'doctype-003', // সদস্যপদ আবেদন
      documentTitle: 'স্বাক্ষরিত সদস্যপদ আবেদন ও শরিয়াহ চুক্তিপত্র',
      documentNumberReference: 'APP-KHR-2023-001',
      description: 'হাতে স্বাক্ষরিত এবং যাচাইকৃত মূল সদস্য আবেদন ফরম',
      fileName: 'signed_membership_form.pdf',
      fileType: 'application/pdf',
      fileSize: 2200000,
      storageType: 'google_drive_reference',
      storageReference: 'gdrive://khurushkul-samity/members/mem-001/form_001.pdf',
      googleDriveReference: {
        provider: 'google_drive',
        fileId: '1AbCdEfGhIjKlMnOpQrStUvWxYz-001',
        fileName: 'signed_membership_form.pdf',
        webViewReference: 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz-001/view?usp=sharing',
        createdAt: '2023-01-05T09:45:00.000Z'
      },
      issueDate: '2023-01-01',
      verificationStatus: 'verified',
      verifiedAt: '2023-01-06T14:25:00.000Z',
      verifiedBy: 'হাফেজ কারী আহমদ (যাচাই কর্মকর্তা)',
      createdAt: '2023-01-05T09:45:00.000Z',
      updatedAt: '2023-01-06T14:25:00.000Z',
      createdBy: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল'
    },
    {
      id: 'doc-003',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      documentTypeId: 'doctype-004', // ঠিকানা প্রমাণপত্র
      documentTitle: 'ইউনিয়ন পরিষদ নাগরিক সনদপত্র',
      documentNumberReference: 'UP-KHR-2023-4412',
      description: 'খুরুশকুল ইউনিয়ন পরিষদ কর্তৃক প্রদত্ত চেয়ারম্যান সার্টিফিকেট',
      fileName: 'citizen_certificate_2023.pdf',
      fileType: 'application/pdf',
      fileSize: 890000,
      storageType: 'local_reference',
      storageReference: '/storage/members/mem-001/citizen_cert.pdf',
      issueDate: '2023-01-02',
      expiryDate: '2024-01-01', // Expired
      verificationStatus: 'verified',
      verifiedAt: '2023-01-06T14:30:00.000Z',
      verifiedBy: 'হাফেজ কারী আহমদ (যাচাই কর্মকর্তা)',
      createdAt: '2023-01-05T09:50:00.000Z',
      updatedAt: '2023-01-06T14:30:00.000Z',
      createdBy: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল'
    },
    {
      id: 'doc-004',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-002',
      documentTypeId: 'doctype-001',
      documentTitle: 'জাতীয় পরিচয়পত্র ফটোকপি',
      documentNumberReference: '19881234567890124',
      description: 'জাতীয় পরিচয়পত্র স্ক্যান',
      fileName: 'fazlul_karim_nid.pdf',
      fileType: 'application/pdf',
      fileSize: 1200000,
      storageType: 'local_reference',
      storageReference: '/storage/members/mem-002/nid.pdf',
      issueDate: '2019-02-15',
      expiryDate: '2029-02-14',
      verificationStatus: 'pending_verification',
      createdAt: '2023-01-10T11:15:00.000Z',
      updatedAt: '2023-01-10T11:15:00.000Z',
      createdBy: 'কারী ফজলুল করিম'
    }
  ],
  'demo-org-alfalah': [
    {
      id: 'doc-af-001',
      organizationId: 'demo-org-alfalah',
      memberId: 'mem-af-001',
      documentTypeId: 'doctype-af-001',
      documentTitle: 'স্মার্ট এনআইডি কার্ড',
      documentNumberReference: '19829988776655443',
      fileName: 'tariqul_nid.pdf',
      fileType: 'application/pdf',
      fileSize: 950000,
      storageType: 'local_reference',
      storageReference: '/storage/alfalah/mem-af-001/nid.pdf',
      verificationStatus: 'verified',
      verifiedAt: '2023-02-02T10:00:00.000Z',
      verifiedBy: 'আল-ফালাহ এডমিন',
      createdAt: '2023-02-01T10:15:00.000Z',
      updatedAt: '2023-02-02T10:00:00.000Z',
      createdBy: 'প্রকৌশলী তরিকুল ইসলাম'
    }
  ]
};

// Initial Seed Audit Trail
const INITIAL_AUDIT_LOGS: DocumentAuditLogType[] = [
  {
    id: 'audit-001',
    organizationId: 'demo-org-khurushkul',
    memberId: 'mem-001',
    eventType: 'MEMBER_DOCUMENT_VERIFIED',
    entityId: 'doc-001',
    entityTitle: 'স্মার্ট জাতীয় পরিচয়পত্র (উভয় পিঠ)',
    actorName: 'হাফেজ কারী আহমদ (যাচাই কর্মকর্তা)',
    actorId: 'usr-verifier-01',
    details: 'জাতীয় পরিচয়পত্র মূল কপির সাথে সফলভাবে যাচাই সম্পন্ন হয়েছে।',
    timestamp: '2023-01-06T14:20:00.000Z'
  },
  {
    id: 'audit-002',
    organizationId: 'demo-org-khurushkul',
    memberId: 'mem-001',
    eventType: 'MEMBER_PRIMARY_PHOTO_CHANGED',
    entityId: 'photo-001',
    entityTitle: 'ibrahim_khalil_profile.jpg',
    actorName: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
    actorId: 'usr-admin-01',
    details: 'প্রোফাইল ছবিকে প্রাথমিক (Primary) ছবি হিসেবে নির্ধারণ করা হয়েছে।',
    timestamp: '2023-01-05T09:30:00.000Z'
  }
];

interface MemberDocumentsPhotosViewProps {
  currentOrg: OrganizationContext;
  selectedMember: MemberType;
  onUpdateMemberAvatar?: (newPhotoUrl: string) => void;
  onClose?: () => void;
}

export const MemberDocumentsPhotosView: React.FC<MemberDocumentsPhotosViewProps> = ({
  currentOrg,
  selectedMember,
  onUpdateMemberAvatar,
  onClose
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'photos' | 'documents' | 'master_data' | 'audit_trail'>('photos');

  // Master State with Multi-Tenant organization isolation
  const [docTypes, setDocTypes] = useState<Record<string, DocumentTypeConfig[]>>(INITIAL_DOCUMENT_TYPES);
  const [photosMap, setPhotosMap] = useState<Record<string, MemberPhotoType[]>>(INITIAL_MEMBER_PHOTOS);
  const [docsMap, setDocsMap] = useState<Record<string, MemberDocumentType[]>>(INITIAL_MEMBER_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState<DocumentAuditLogType[]>(INITIAL_AUDIT_LOGS);

  // Search and Filter States for Documents
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedExpiryFilter, setSelectedExpiryFilter] = useState<'ALL' | 'EXPIRED' | 'EXPIRING_SOON'>('ALL');

  // Sensitive Reference Masking State (Permission-gated)
  const [revealedDocNumbers, setRevealedDocNumbers] = useState<Record<string, boolean>>({});

  // Modals and Action States
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [isRejectDocOpen, setIsRejectDocOpen] = useState(false);
  const [docToReject, setDocToReject] = useState<MemberDocumentType | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  const [previewDoc, setPreviewDoc] = useState<MemberDocumentType | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<MemberPhotoType | null>(null);
  const [isPrintSummaryOpen, setIsPrintSummaryOpen] = useState(false);

  // Master Data Add/Edit modal
  const [isDocTypeModalOpen, setIsDocTypeModalOpen] = useState(false);
  const [editingDocType, setEditingDocType] = useState<DocumentTypeConfig | null>(null);
  const [docTypeCode, setDocTypeCode] = useState('');
  const [docTypeName, setDocTypeName] = useState('');
  const [docTypeDesc, setDocTypeDesc] = useState('');

  // Add Photo Form State
  const [newPhotoType, setNewPhotoType] = useState<MemberPhotoCategory>('profile');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoFileName, setNewPhotoFileName] = useState('');
  const [isNewPhotoPrimary, setIsNewPhotoPrimary] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState('');

  // Add Document Form State
  const [newDocTypeId, setNewDocTypeId] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [newDocFileName, setNewDocFileName] = useState('');
  const [newDocStorageType, setNewDocStorageType] = useState<DocumentStorageType>('local_reference');
  const [newDocGdriveId, setNewDocGdriveId] = useState('');
  const [newDocIssueDate, setNewDocIssueDate] = useState('');
  const [newDocExpiryDate, setNewDocExpiryDate] = useState('');
  const [docUploadError, setDocUploadError] = useState('');

  // Filtered lists for current organization and member
  const currentOrgDocTypes = useMemo(() => {
    return docTypes[currentOrg.id] || [];
  }, [docTypes, currentOrg.id]);

  const activeDocTypes = useMemo(() => {
    return currentOrgDocTypes.filter((d) => d.isActive);
  }, [currentOrgDocTypes]);

  const currentMemberPhotos = useMemo(() => {
    const orgPhotos = photosMap[currentOrg.id] || [];
    return orgPhotos.filter((p) => p.memberId === selectedMember.id && p.status === 'active');
  }, [photosMap, currentOrg.id, selectedMember.id]);

  const primaryPhoto = useMemo(() => {
    return currentMemberPhotos.find((p) => p.isPrimary) || currentMemberPhotos[0] || null;
  }, [currentMemberPhotos]);

  const currentMemberDocuments = useMemo(() => {
    const orgDocs = docsMap[currentOrg.id] || [];
    return orgDocs.filter((d) => d.memberId === selectedMember.id);
  }, [docsMap, currentOrg.id, selectedMember.id]);

  // Expiry Calculation Helper
  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return { status: 'NO_EXPIRY', label: 'আজীবন / প্রযোজ্য নয়', badgeColor: 'text-slate-600 bg-slate-100' };
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'EXPIRED', label: 'মেয়াদোত্তীর্ণ', badgeColor: 'text-rose-700 bg-rose-50 border-rose-200' };
    } else if (diffDays <= 30) {
      return { status: 'EXPIRING_SOON', label: `${diffDays} দিন বাকি (শীঘ্রই উত্তীর্ণ)`, badgeColor: 'text-amber-700 bg-amber-50 border-amber-200' };
    }
    return { status: 'VALID', label: 'বৈধ', badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  // Masking Helper for Sensitive Identification Numbers
  const maskSensitiveValue = (value?: string, docId?: string) => {
    if (!value) return 'তথ্য নেই';
    if (docId && revealedDocNumbers[docId]) {
      return value;
    }
    if (value.length <= 4) return '****';
    const lastFour = value.slice(-4);
    const maskedPart = '*'.repeat(Math.max(4, value.length - 4));
    return `${maskedPart}${lastFour}`;
  };

  const toggleRevealDocNumber = (docId: string) => {
    setRevealedDocNumbers((prev) => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  // Filtered Documents based on search & filters
  const filteredDocuments = useMemo(() => {
    return currentMemberDocuments.filter((doc) => {
      // Search
      const matchesSearch = 
        doc.documentTitle.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
        (doc.documentNumberReference && doc.documentNumberReference.toLowerCase().includes(docSearchQuery.toLowerCase())) ||
        doc.fileName.toLowerCase().includes(docSearchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Type Filter
      if (selectedTypeFilter !== 'ALL' && doc.documentTypeId !== selectedTypeFilter) {
        return false;
      }

      // Status Filter
      if (selectedStatusFilter !== 'ALL' && doc.verificationStatus !== selectedStatusFilter) {
        return false;
      }

      // Expiry Filter
      if (selectedExpiryFilter !== 'ALL') {
        const exp = getExpiryStatus(doc.expiryDate);
        if (selectedExpiryFilter === 'EXPIRED' && exp.status !== 'EXPIRED') return false;
        if (selectedExpiryFilter === 'EXPIRING_SOON' && exp.status !== 'EXPIRING_SOON') return false;
      }

      return true;
    });
  }, [currentMemberDocuments, docSearchQuery, selectedTypeFilter, selectedStatusFilter, selectedExpiryFilter]);

  // ==========================================
  // Photo Handlers (Primary Uniqueness Guaranteed)
  // ==========================================
  const handleSetPrimaryPhoto = (photoId: string) => {
    setPhotosMap((prev) => {
      const orgPhotos = prev[currentOrg.id] || [];
      const updated = orgPhotos.map((p) => {
        if (p.memberId !== selectedMember.id) return p;
        if (p.id === photoId) {
          return { ...p, isPrimary: true, updatedAt: new Date().toISOString() };
        }
        return { ...p, isPrimary: false };
      });
      return { ...prev, [currentOrg.id]: updated };
    });

    const targetPhoto = (photosMap[currentOrg.id] || []).find((p) => p.id === photoId);
    if (targetPhoto && onUpdateMemberAvatar) {
      onUpdateMemberAvatar(targetPhoto.storageReference);
    }

    // Add Audit Log
    const newLog: DocumentAuditLogType = {
      id: `audit-${Date.now()}`,
      organizationId: currentOrg.id,
      memberId: selectedMember.id,
      eventType: 'MEMBER_PRIMARY_PHOTO_CHANGED',
      entityId: photoId,
      entityTitle: targetPhoto?.fileName || 'Member Photo',
      actorName: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
      actorId: 'usr-admin-01',
      details: 'সদস্যের প্রাথমিক প্রোফাইল ছবি সফলভাবে পরিবর্তন করা হয়েছে।',
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleArchivePhoto = (photoId: string) => {
    setPhotosMap((prev) => {
      const orgPhotos = prev[currentOrg.id] || [];
      const updated = orgPhotos.map((p) => {
        if (p.id === photoId) {
          return { ...p, status: 'archived' as const, isPrimary: false, updatedAt: new Date().toISOString() };
        }
        return p;
      });
      return { ...prev, [currentOrg.id]: updated };
    });

    const newLog: DocumentAuditLogType = {
      id: `audit-${Date.now()}`,
      organizationId: currentOrg.id,
      memberId: selectedMember.id,
      eventType: 'MEMBER_PHOTO_ARCHIVED',
      entityId: photoId,
      entityTitle: 'Member Photo',
      actorName: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
      actorId: 'usr-admin-01',
      details: 'ছবিটি সফলভাবে আর্কাইভ করা হয়েছে (সফট ডিলিট)।',
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoUploadError('');

    if (!newPhotoUrl.trim()) {
      setPhotoUploadError('অনুগ্রহ করে ছবির বৈধ প্রিভিউ লিংক বা ফাইল নির্বাচন করুন।');
      return;
    }

    const newPhotoId = `photo-${Date.now()}`;
    const newPhoto: MemberPhotoType = {
      id: newPhotoId,
      organizationId: currentOrg.id,
      memberId: selectedMember.id,
      fileName: newPhotoFileName.trim() || `photo_${Date.now()}.jpg`,
      fileType: 'image/jpeg',
      fileSize: 320000,
      storageReference: newPhotoUrl.trim(),
      thumbnailReference: newPhotoUrl.trim(),
      photoType: newPhotoType,
      isPrimary: isNewPhotoPrimary || currentMemberPhotos.length === 0,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    setPhotosMap((prev) => {
      const orgPhotos = prev[currentOrg.id] || [];
      let updated = orgPhotos;
      if (newPhoto.isPrimary) {
        updated = updated.map((p) => p.memberId === selectedMember.id ? { ...p, isPrimary: false } : p);
      }
      return { ...prev, [currentOrg.id]: [newPhoto, ...updated] };
    });

    if (newPhoto.isPrimary && onUpdateMemberAvatar) {
      onUpdateMemberAvatar(newPhoto.storageReference);
    }

    // Add Audit Log
    const newLog: DocumentAuditLogType = {
      id: `audit-${Date.now()}`,
      organizationId: currentOrg.id,
      memberId: selectedMember.id,
      eventType: 'MEMBER_PHOTO_ADDED',
      entityId: newPhotoId,
      entityTitle: newPhoto.fileName,
      actorName: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
      actorId: 'usr-admin-01',
      details: `নতুন সদস্যের ছবি (${newPhotoType}) আপলোড করা হয়েছে।`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Reset Form
    setNewPhotoUrl('');
    setNewPhotoFileName('');
    setIsNewPhotoPrimary(false);
    setIsAddPhotoOpen(false);
  };

  // ==========================================
  // Document Handlers (Verification Lifecycle)
  // ==========================================
  const handleVerifyDocument = (doc: MemberDocumentType) => {
    // Creator !== Verifier check guidance
    const verifierName = 'হাফেজ কারী আহমদ (যাচাই কর্মকর্তা)';
    
    setDocsMap((prev) => {
      const orgDocs = prev[currentOrg.id] || [];
      const updated = orgDocs.map((d) => {
        if (d.id === doc.id) {
          return {
            ...d,
            verificationStatus: 'verified' as const,
            verifiedBy: verifierName,
            verifiedAt: new Date().toISOString(),
            rejectionReason: undefined,
            updatedAt: new Date().toISOString()
          };
        }
        return d;
      });
      return { ...prev, [currentOrg.id]: updated };
    });

    const newLog: DocumentAuditLogType = {
      id: `audit-${Date.now()}`,
      organizationId: currentOrg.id,
      memberId: selectedMember.id,
      eventType: 'MEMBER_DOCUMENT_VERIFIED',
      entityId: doc.id,
      entityTitle: doc.documentTitle,
      actorName: verifierName,
      actorId: 'usr-verifier-01',
      details: 'ডকুমেন্টটি সফলভাবে যাচাইকৃত (Verified) হিসেবে অনুমোদন দেওয়া হয়েছে।',
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleOpenRejectModal = (doc: MemberDocumentType) => {
    setDocToReject(doc);
    setRejectionReasonText('');
    setIsRejectDocOpen(true);
  };

  const handleConfirmRejectDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docToReject || !rejectionReasonText.trim()) return;

    const verifierName = 'হাফেজ কারী আহমদ (যাচাই কর্মকর্তা)';

    setDocsMap((prev) => {
      const orgDocs = prev[currentOrg.id] || [];
      const updated = orgDocs.map((d) => {
        if (d.id === docToReject.id) {
          return {
            ...d,
            verificationStatus: 'rejected' as const,
            rejectionReason: rejectionReasonText.trim(),
            verifiedBy: verifierName,
            verifiedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
        return d;
      });
      return { ...prev, [currentOrg.id]: updated };
    });

    const newLog: DocumentAuditLogType = {
      id: `audit-${Date.now()}`,
      organizationId: currentOrg.id,
      memberId: selectedMember.id,
      eventType: 'MEMBER_DOCUMENT_REJECTED',
      entityId: docToReject.id,
      entityTitle: docToReject.documentTitle,
      actorName: verifierName,
      actorId: 'usr-verifier-01',
      details: `ডকুমেন্ট প্রত্যাখ্যাত হয়েছে। কারণ: ${rejectionReasonText.trim()}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setIsRejectDocOpen(false);
    setDocToReject(null);
  };

  const handleArchiveDocument = (doc: MemberDocumentType) => {
    setDocsMap((prev) => {
      const orgDocs = prev[currentOrg.id] || [];
      const updated = orgDocs.map((d) => {
        if (d.id === doc.id) {
          return {
            ...d,
            verificationStatus: 'archived' as const,
            updatedAt: new Date().toISOString()
          };
        }
        return d;
      });
      return { ...prev, [currentOrg.id]: updated };
    });

    const newLog: DocumentAuditLogType = {
      id: `audit-${Date.now()}`,
      organizationId: currentOrg.id,
      memberId: selectedMember.id,
      eventType: 'MEMBER_DOCUMENT_ARCHIVED',
      entityId: doc.id,
      entityTitle: doc.documentTitle,
      actorName: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
      actorId: 'usr-admin-01',
      details: 'ডকুমেন্টটি সফলভাবে আর্কাইভ তালিকায় সরানো হয়েছে (কোনো হার্ড ডিলিট নেই)।',
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleAddDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDocUploadError('');

    if (!newDocTypeId) {
      setDocUploadError('অনুগ্রহ করে ডকুমেন্টের ধরন নির্বাচন করুন।');
      return;
    }

    if (!newDocTitle.trim()) {
      setDocUploadError('অনুগ্রহ করে ডকুমেন্টের শিরোনাম লিখুন।');
      return;
    }

    // Check inactive doc type exploit protection
    const selectedType = currentOrgDocTypes.find((t) => t.id === newDocTypeId);
    if (!selectedType || !selectedType.isActive) {
      setDocUploadError('নিষ্ক্রিয় ডকুমেন্টের ধরন দিয়ে নতুন সংযুক্তি তৈরি করা নিষিদ্ধ।');
      return;
    }

    const newDocId = `doc-${Date.now()}`;
    let gdriveRef: GoogleDriveReference | undefined = undefined;

    if (newDocStorageType === 'google_drive_reference') {
      gdriveRef = {
        provider: 'google_drive',
        fileId: newDocGdriveId.trim() || `gdrive-${Date.now()}`,
        fileName: newDocFileName.trim() || `${newDocTitle}.pdf`,
        webViewReference: `https://drive.google.com/file/d/${newDocGdriveId.trim() || 'demo-ref'}/view`,
        createdAt: new Date().toISOString()
      };
    }

    const newDoc: MemberDocumentType = {
      id: newDocId,
      organizationId: currentOrg.id,
      memberId: selectedMember.id,
      documentTypeId: newDocTypeId,
      documentTitle: newDocTitle.trim(),
      documentNumberReference: newDocNumber.trim() || undefined,
      description: newDocDesc.trim() || undefined,
      fileName: newDocFileName.trim() || `${newDocTitle}.pdf`,
      fileType: 'application/pdf',
      fileSize: 1540000,
      storageType: newDocStorageType,
      storageReference: newDocStorageType === 'google_drive_reference' 
        ? `gdrive://${currentOrg.id}/members/${selectedMember.id}/${newDocFileName.trim() || 'doc.pdf'}` 
        : `/storage/members/${selectedMember.id}/${newDocFileName.trim() || 'doc.pdf'}`,
      googleDriveReference: gdriveRef,
      issueDate: newDocIssueDate || undefined,
      expiryDate: newDocExpiryDate || undefined,
      verificationStatus: 'pending_verification',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল'
    };

    setDocsMap((prev) => {
      const orgDocs = prev[currentOrg.id] || [];
      return { ...prev, [currentOrg.id]: [newDoc, ...orgDocs] };
    });

    const newLog: DocumentAuditLogType = {
      id: `audit-${Date.now()}`,
      organizationId: currentOrg.id,
      memberId: selectedMember.id,
      eventType: 'MEMBER_DOCUMENT_CREATED',
      entityId: newDocId,
      entityTitle: newDoc.documentTitle,
      actorName: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
      actorId: 'usr-admin-01',
      details: `নতুন ডকুমেন্ট সংযোজন করা হয়েছে (স্ট্যাটাস: যাচাই অপেক্ষমাণ)।`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Reset Form
    setNewDocTypeId('');
    setNewDocTitle('');
    setNewDocNumber('');
    setNewDocDesc('');
    setNewDocFileName('');
    setNewDocIssueDate('');
    setNewDocExpiryDate('');
    setNewDocGdriveId('');
    setIsAddDocOpen(false);
  };

  // ==========================================
  // Master Data (Document Type) Handlers
  // ==========================================
  const handleToggleDocTypeStatus = (typeId: string) => {
    setDocTypes((prev) => {
      const orgList = prev[currentOrg.id] || [];
      const updated = orgList.map((item) => {
        if (item.id === typeId) {
          if (item.isSystemDefined) {
            return item; // Protected
          }
          return { ...item, isActive: !item.isActive, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      return { ...prev, [currentOrg.id]: updated };
    });
  };

  const handleSaveDocType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTypeCode.trim() || !docTypeName.trim()) return;

    // Code uniqueness check
    const normalizedCode = docTypeCode.trim().toUpperCase();
    const existing = currentOrgDocTypes.find(
      (t) => t.code.toUpperCase() === normalizedCode && (!editingDocType || t.id !== editingDocType.id)
    );

    if (existing) {
      alert(`ত্রুটি: "${normalizedCode}" কোডটি ইতোমধ্যে এই সংস্থায় বিদ্যমান। ইউনিক কোড ব্যবহার করুন।`);
      return;
    }

    if (editingDocType) {
      setDocTypes((prev) => {
        const orgList = prev[currentOrg.id] || [];
        const updated = orgList.map((t) => {
          if (t.id === editingDocType.id) {
            return {
              ...t,
              code: normalizedCode,
              name: docTypeName.trim(),
              description: docTypeDesc.trim(),
              updatedAt: new Date().toISOString()
            };
          }
          return t;
        });
        return { ...prev, [currentOrg.id]: updated };
      });
    } else {
      const newType: DocumentTypeConfig = {
        id: `doctype-${Date.now()}`,
        organizationId: currentOrg.id,
        code: normalizedCode,
        name: docTypeName.trim(),
        description: docTypeDesc.trim(),
        isSystemDefined: false,
        isActive: true,
        sortOrder: currentOrgDocTypes.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'usr-admin-01'
      };

      setDocTypes((prev) => {
        const orgList = prev[currentOrg.id] || [];
        return { ...prev, [currentOrg.id]: [...orgList, newType] };
      });
    }

    setIsDocTypeModalOpen(false);
    setEditingDocType(null);
    setDocTypeCode('');
    setDocTypeName('');
    setDocTypeDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={primaryPhoto?.storageReference || selectedMember.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={selectedMember.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shadow-xs"
            />
            {primaryPhoto && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-700 text-white p-1 rounded-full text-[10px]" title="Primary Photo">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800 font-display">{selectedMember.fullName}</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-numeric">
                {selectedMember.memberCode}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>সংস্থা: <strong className="text-slate-700">{currentOrg.name}</strong></span>
              <span>•</span>
              <span>মোট ছবি: <strong className="text-slate-700">{currentMemberPhotos.length} টি</strong></span>
              <span>•</span>
              <span>মোট ডকুমেন্ট: <strong className="text-slate-700">{currentMemberDocuments.length} টি</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsPrintSummaryOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>A4 ডকুমেন্ট সামারি প্রিন্ট</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="বন্ধ করুন"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex gap-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('photos')}
          className={`py-3 px-4 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'photos'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-700" />
          <span>সদস্য ছবি গ্যালারি ও প্রাইমারি ফটো ({currentMemberPhotos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`py-3 px-4 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'documents'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>সংযুক্ত ডকুমেন্টস ও যাচাইকরণ ({currentMemberDocuments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('master_data')}
          className={`py-3 px-4 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'master_data'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>ডকুমেন্ট টাইপ মাস্টার ডাটা ({currentOrgDocTypes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_trail')}
          className={`py-3 px-4 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'audit_trail'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>অডিট ট্রেইল ও হিস্ট্রি ({auditLogs.length})</span>
        </button>
      </div>

      {/* ==========================================
          TAB 1: PHOTOS MANAGEMENT
      ========================================== */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-50/60 border border-emerald-200/60 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-emerald-950 font-display">সদস্যের ছবি ও পরিচিতি ফটো গ্যালারি</h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                সদস্যের একাধিক ছবি সংরক্ষণ করা যাবে। এক সময়ে শুধুমাত্র একটি ছবিকে <strong>Primary Photo</strong> হিসেবে নির্ধারণ করা যায়।
              </p>
            </div>
            <button
              onClick={() => setIsAddPhotoOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ছবি যুক্ত করুন</span>
            </button>
          </div>

          {currentMemberPhotos.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">কোনো ছবি পাওয়া যায়নি</h4>
              <p className="text-xs text-slate-500 mt-1">সদস্যের প্রোফাইল বা পরিচিতি ছবি যুক্ত করতে উপরের বাটনে ক্লিক করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentMemberPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`bg-white rounded-xl border transition shadow-xs overflow-hidden flex flex-col justify-between ${
                    photo.isPrimary ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                  }`}
                >
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden group">
                    <img
                      src={photo.storageReference}
                      alt={photo.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      {photo.isPrimary ? (
                        <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-700 text-white rounded-md shadow-xs flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>প্রাইমারি ছবি</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-800/80 text-white rounded-md backdrop-blur-xs">
                          অতিরিক্ত ছবি
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-white/90 text-slate-800 rounded-md backdrop-blur-xs capitalize">
                        {photo.photoType === 'profile' ? 'প্রোফাইল' : photo.photoType === 'identity' ? 'পরিচয়পত্র' : 'অন্যান্য'}
                      </span>
                    </div>

                    <button
                      onClick={() => setPreviewPhoto(photo)}
                      className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-2 transition"
                    >
                      <Eye className="w-4 h-4" />
                      <span>ফুল প্রিভিউ দেখুন</span>
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 truncate" title={photo.fileName}>
                        {photo.fileName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex justify-between">
                        <span>আকার: {(photo.fileSize / 1024).toFixed(1)} KB</span>
                        <span className="font-numeric">{new Date(photo.uploadedAt).toLocaleDateString('bn-BD')}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      {!photo.isPrimary ? (
                        <button
                          onClick={() => handleSetPrimaryPhoto(photo.id)}
                          className="flex-1 py-1.5 px-3 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition flex items-center justify-center gap-1.5 min-h-[44px]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>প্রাইমারি হিসেবে সেট করুন</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>ডিফল্ট প্রোফাইল ফটো</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleArchivePhoto(photo.id)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="আর্কাইভ করুন (সফট ডিলিট)"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 2: DOCUMENTS MANAGEMENT
      ========================================== */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          {/* Action and Filter Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ডকুমেন্টের শিরোনাম, রেফারেন্স নম্বর বা ফাইলের নাম দিয়ে খুঁজুন..."
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setIsAddDocOpen(true)}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ডকুমেন্ট সংযোজন</span>
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">ডকুমেন্টের ধরন:</label>
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="ALL">সকল ধরন</option>
                  {currentOrgDocTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">যাচাইকরণ স্ট্যাটাস:</label>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="ALL">সকল স্ট্যাটাস</option>
                  <option value="pending_verification">যাচাই অপেক্ষমাণ</option>
                  <option value="verified">যাচাইকৃত (Verified)</option>
                  <option value="rejected">প্রত্যাখ্যাত (Rejected)</option>
                  <option value="archived">আর্কাইভ (Archived)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">মেয়াদ অবস্থা:</label>
                <select
                  value={selectedExpiryFilter}
                  onChange={(e) => setSelectedExpiryFilter(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="ALL">সকল মেয়াদ</option>
                  <option value="EXPIRING_SOON">শীঘ্রই উত্তীর্ণ (৩০ দিন)</option>
                  <option value="EXPIRED">মেয়াদোত্তীর্ণ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Document Cards / Table */}
          {filteredDocuments.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">কোনো ডকুমেন্ট পাওয়া যায়নি</h4>
              <p className="text-xs text-slate-500 mt-1">অনুসন্ধানের সাথে কোনো ডকুমেন্টের মিল নেই অথবা কোনো সংযুক্তি নেই।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => {
                const docType = currentOrgDocTypes.find((t) => t.id === doc.documentTypeId);
                const expiry = getExpiryStatus(doc.expiryDate);

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-800 font-display">{doc.documentTitle}</h4>
                            <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md">
                              {docType?.name || 'অজ্ঞাত টাইপ'}
                            </span>
                            {doc.storageType === 'google_drive_reference' && (
                              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-md flex items-center gap-1">
                                <HardDrive className="w-3 h-3" />
                                <span>Google Drive Ref</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            ফাইল: <span className="font-mono text-slate-700">{doc.fileName}</span> ({(doc.fileSize / (1024 * 1024)).toFixed(2)} MB)
                          </p>
                        </div>
                      </div>

                      {/* Verification Status Badge */}
                      <div className="flex items-center gap-2">
                        {doc.verificationStatus === 'verified' && (
                          <span className="px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>যাচাইকৃত (Verified)</span>
                          </span>
                        )}
                        {doc.verificationStatus === 'pending_verification' && (
                          <span className="px-3 py-1 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-full flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>যাচাই অপেক্ষমাণ</span>
                          </span>
                        )}
                        {doc.verificationStatus === 'rejected' && (
                          <span className="px-3 py-1 text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-full flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>প্রত্যাখ্যাত (Rejected)</span>
                          </span>
                        )}
                        {doc.verificationStatus === 'archived' && (
                          <span className="px-3 py-1 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full flex items-center gap-1.5">
                            <Archive className="w-4 h-4 text-slate-500" />
                            <span>আর্কাইভ (Archived)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50/70 p-3 rounded-lg">
                      <div>
                        <span className="text-slate-500 block text-[11px]">রেফারেন্স / NID নম্বর:</span>
                        <div className="flex items-center gap-1.5 font-mono text-slate-800 font-semibold mt-0.5">
                          <span>{maskSensitiveValue(doc.documentNumberReference, doc.id)}</span>
                          {doc.documentNumberReference && (
                            <button
                              onClick={() => toggleRevealDocNumber(doc.id)}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title={revealedDocNumbers[doc.id] ? 'লুকান' : 'প্রদর্শন করুন'}
                            >
                              {revealedDocNumbers[doc.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">ইস্যু তারিখ:</span>
                        <span className="font-numeric text-slate-800 font-medium">
                          {doc.issueDate ? new Date(doc.issueDate).toLocaleDateString('bn-BD') : 'প্রযোজ্য নয়'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">মেয়াদ শেষ:</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-numeric text-slate-800 font-medium">
                            {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString('bn-BD') : 'আজীবন'}
                          </span>
                          {doc.expiryDate && (
                            <span className={`px-1.5 py-0.2 text-[10px] font-bold border rounded-sm ${expiry.badgeColor}`}>
                              {expiry.label}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">যাচাই তথ্য:</span>
                        <span className="text-slate-800 truncate block" title={doc.verifiedBy || 'অপেক্ষমাণ'}>
                          {doc.verifiedBy ? `${doc.verifiedBy}` : 'এখনও যাচাই হয়নি'}
                        </span>
                      </div>
                    </div>

                    {/* Rejection Alert if any */}
                    {doc.verificationStatus === 'rejected' && doc.rejectionReason && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>প্রত্যাখ্যানের কারণ:</strong> {doc.rejectionReason}
                        </div>
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5 min-h-[44px]"
                        >
                          <Eye className="w-4 h-4" />
                          <span>বিস্তারিত ও প্রিভিউ</span>
                        </button>

                        {doc.storageType === 'google_drive_reference' && doc.googleDriveReference && (
                          <a
                            href={doc.googleDriveReference.webViewReference}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition flex items-center gap-1.5 min-h-[44px]"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Google Drive লিংক</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.verificationStatus !== 'verified' && doc.verificationStatus !== 'archived' && (
                          <button
                            onClick={() => handleVerifyDocument(doc)}
                            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition flex items-center gap-1.5 min-h-[44px]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>যাচাই অনুমোদন করুন</span>
                          </button>
                        )}

                        {doc.verificationStatus !== 'rejected' && doc.verificationStatus !== 'archived' && (
                          <button
                            onClick={() => handleOpenRejectModal(doc)}
                            className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition flex items-center gap-1.5 min-h-[44px]"
                          >
                            <XCircle className="w-4 h-4 text-rose-700" />
                            <span>প্রত্যাখ্যান করুন</span>
                          </button>
                        )}

                        {doc.verificationStatus !== 'archived' && (
                          <button
                            onClick={() => handleArchiveDocument(doc)}
                            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                            title="আর্কাইভ করুন"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 3: DOCUMENT TYPE MASTER DATA
      ========================================== */}
      {activeTab === 'master_data' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-display">ডকুমেন্ট টাইপ মাস্টার ডাটা কনফিগারেশন</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                সংস্থাভিত্তিক কাস্টম ডকুমেন্ট টাইপ তৈরি ও সক্রিয়/নিষ্ক্রিয় করার পূর্ণ স্বাধীনতা। জিরো হার্ড ডিলিট পলিসি বলবৎ।
              </p>
            </div>
            <button
              onClick={() => {
                setEditingDocType(null);
                setDocTypeCode('');
                setDocTypeName('');
                setDocTypeDesc('');
                setIsDocTypeModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ডকুমেন্ট টাইপ যুক্ত করুন</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="p-3.5">কোড</th>
                    <th className="p-3.5">টাইপ নাম</th>
                    <th className="p-3.5">বিবরণ</th>
                    <th className="p-3.5">স্কোপ / প্রকৃতি</th>
                    <th className="p-3.5">স্ট্যাটাস</th>
                    <th className="p-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentOrgDocTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-mono font-bold text-emerald-800">{type.code}</td>
                      <td className="p-3.5 font-bold text-slate-800">{type.name}</td>
                      <td className="p-3.5 text-slate-600 max-w-xs truncate">{type.description || '—'}</td>
                      <td className="p-3.5">
                        {type.isSystemDefined ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-md">
                            সিস্টেম ডিফাইন্ড
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded-md">
                            কাস্টম টাইপ
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          type.isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {type.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {!type.isSystemDefined && (
                          <button
                            onClick={() => handleToggleDocTypeStatus(type.id)}
                            className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition"
                          >
                            {type.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: AUDIT TRAIL & LOGS
      ========================================== */}
      {activeTab === 'audit_trail' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 font-display">ডকুমেন্ট ও ফটো অডিট হিস্ট্রি</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              সকল সংযুক্তি আপলোড, প্রাইমারি ফটো পরিবর্তন, যাচাই অনুমোদন ও প্রত্যাখ্যানের অপরিবর্তনীয় ট্রেইল।
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/50 transition flex items-start justify-between gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 font-display">{log.eventType}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-emerald-800">{log.entityTitle}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{log.details}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      কর্তা: <strong className="text-slate-700">{log.actorName}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-numeric text-slate-500">
                    {new Date(log.timestamp).toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: ADD PHOTO
      ========================================== */}
      {isAddPhotoOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 font-display">নতুন সদস্যের ছবি যুক্ত করুন</h3>
              <button onClick={() => setIsAddPhotoOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-4 text-xs">
              {photoUploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{photoUploadError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ছবির ধরন:</label>
                <select
                  value={newPhotoType}
                  onChange={(e) => setNewPhotoType(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="profile">প্রোফাইল ফটো (Profile Photo)</option>
                  <option value="identity">পরিচয়পত্র ফটো (Identity Photo)</option>
                  <option value="signature">স্বাক্ষর কার্ড (Signature Card)</option>
                  <option value="other">অন্যান্য (Other)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ছবির URL / স্টোরেজ লিংক:</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ফাইলের নাম:</label>
                <input
                  type="text"
                  placeholder="photo_member_001.jpg"
                  value={newPhotoFileName}
                  onChange={(e) => setNewPhotoFileName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primaryCheck"
                  checked={isNewPhotoPrimary}
                  onChange={(e) => setIsNewPhotoPrimary(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded-sm"
                />
                <label htmlFor="primaryCheck" className="text-slate-700 font-semibold">
                  এই ছবিকে ডিফল্ট প্রাইমারি (Primary Photo) হিসেবে নির্ধারণ করুন
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPhotoOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg font-semibold transition"
                >
                  ছবি সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: ADD DOCUMENT
      ========================================== */}
      {isAddDocOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 font-display">নতুন ডকুমেন্ট সংযোজন করুন</h3>
              <button onClick={() => setIsAddDocOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddDocumentSubmit} className="space-y-4 text-xs">
              {docUploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{docUploadError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ডকুমেন্টের ধরন <span className="text-rose-500">*</span>:</label>
                <select
                  value={newDocTypeId}
                  onChange={(e) => setNewDocTypeId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
                  required
                >
                  <option value="">-- ধরন নির্বাচন করুন --</option>
                  {activeDocTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ডকুমেন্টের শিরোনাম <span className="text-rose-500">*</span>:</label>
                <input
                  type="text"
                  placeholder="যেমন: স্মার্ট জাতীয় পরিচয়পত্র (উভয় পিঠ)"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">রেফারেন্স বা NID নম্বর (সংরক্ষিত):</label>
                  <input
                    type="text"
                    placeholder="19851234567890123"
                    value={newDocNumber}
                    onChange={(e) => setNewDocNumber(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ফাইলের নাম:</label>
                  <input
                    type="text"
                    placeholder="nid_card_scan.pdf"
                    value={newDocFileName}
                    onChange={(e) => setNewDocFileName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ইস্যু তারিখ:</label>
                  <input
                    type="date"
                    value={newDocIssueDate}
                    onChange={(e) => setNewDocIssueDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">মেয়াদ উত্তীর্ণের তারিখ (প্রযোজ্য ক্ষেত্রে):</label>
                  <input
                    type="date"
                    value={newDocExpiryDate}
                    onChange={(e) => setNewDocExpiryDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">স্টোরেজ আর্কিটেকচার:</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 border rounded-lg flex items-center gap-2 cursor-pointer ${
                    newDocStorageType === 'local_reference' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="storageType"
                      checked={newDocStorageType === 'local_reference'}
                      onChange={() => setNewDocStorageType('local_reference')}
                      className="text-emerald-600"
                    />
                    <span>লোকাল রেফারেন্স (Local File)</span>
                  </label>

                  <label className={`p-3 border rounded-lg flex items-center gap-2 cursor-pointer ${
                    newDocStorageType === 'google_drive_reference' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="storageType"
                      checked={newDocStorageType === 'google_drive_reference'}
                      onChange={() => setNewDocStorageType('google_drive_reference')}
                      className="text-emerald-600"
                    />
                    <span>Google Drive Reference</span>
                  </label>
                </div>
              </div>

              {newDocStorageType === 'google_drive_reference' && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg space-y-2">
                  <label className="block text-blue-900 font-semibold">Google Drive File ID / Reference:</label>
                  <input
                    type="text"
                    placeholder="1AbCdEfGhIjKlMnOpQrStUvWxYz..."
                    value={newDocGdriveId}
                    onChange={(e) => setNewDocGdriveId(e.target.value)}
                    className="w-full p-2 border border-blue-300 rounded-lg bg-white font-mono"
                  />
                  <p className="text-[11px] text-blue-700">
                    * Google Drive OAuth রেফারেন্স আর্কিটেকচার বজায় রাখা হয়েছে।
                  </p>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">সংক্ষিপ্ত বিবরণ বা নোট:</label>
                <textarea
                  rows={2}
                  placeholder="ডকুমেন্ট সংক্রান্ত কোনো বিবরণ থাকলে লিখুন..."
                  value={newDocDesc}
                  onChange={(e) => setNewDocDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDocOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg font-semibold transition"
                >
                  ডকুমেন্ট সংযোজন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: REJECT DOCUMENT (Mandatory Reason)
      ========================================== */}
      {isRejectDocOpen && docToReject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-rose-700 font-display flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>ডকুমেন্ট প্রত্যাখ্যান করুন</span>
              </h3>
              <button onClick={() => setIsRejectDocOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleConfirmRejectDocument} className="space-y-4 text-xs">
              <p className="text-slate-600">
                আপনি <strong className="text-slate-800 font-semibold">{docToReject.documentTitle}</strong> ডকুমেন্টটি প্রত্যাখ্যান করতে চলেছেন।
              </p>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  প্রত্যাখ্যানের যৌক্তিক কারণ <span className="text-rose-500">* (বাধ্যতামূলক)</span>:
                </label>
                <textarea
                  rows={3}
                  placeholder="যেমন: ছবি স্পষ্ট নয় / মূল দলিলের স্বাক্ষর মেলেনি..."
                  value={rejectionReasonText}
                  onChange={(e) => setRejectionReasonText(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRejectDocOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={!rejectionReasonText.trim()}
                  className="px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg font-semibold transition"
                >
                  প্রত্যাখ্যান নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: PREVIEW DOCUMENT
      ========================================== */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <span>ডকুমেন্ট প্রিভিউ ও পূর্ণাঙ্গ মেটাডাটা</span>
              </h3>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">শিরোনাম:</span>
                  <span className="font-bold text-slate-800">{previewDoc.documentTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ফাইলের নাম:</span>
                  <span className="font-mono text-slate-700">{previewDoc.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">রেফারেন্স নম্বর:</span>
                  <span className="font-mono font-bold text-slate-800">{previewDoc.documentNumberReference || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">স্টোরেজ পাথ:</span>
                  <span className="font-mono text-[11px] text-slate-600 truncate max-w-xs">{previewDoc.storageReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">যাচাই অবস্থা:</span>
                  <span className="font-semibold text-emerald-800 capitalize">{previewDoc.verificationStatus}</span>
                </div>
                {previewDoc.verifiedBy && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">যাচাইকারী:</span>
                    <span className="text-slate-800">{previewDoc.verifiedBy}</span>
                  </div>
                )}
              </div>

              {previewDoc.description && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">বিবরণ:</span>
                  <p className="p-3 bg-slate-50 rounded-lg text-slate-600">{previewDoc.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: PREVIEW PHOTO (LIGHTBOX)
      ========================================== */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold truncate">{previewPhoto.fileName}</h4>
                <p className="text-[11px] text-slate-400 capitalize">{previewPhoto.photoType} photo</p>
              </div>
              <button onClick={() => setPreviewPhoto(null)} className="text-slate-400 hover:text-white text-lg">✕</button>
            </div>
            <div className="bg-slate-950 flex items-center justify-center p-2 max-h-[70vh]">
              <img
                src={previewPhoto.storageReference}
                alt={previewPhoto.fileName}
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-numeric">
                আপলোড: {new Date(previewPhoto.uploadedAt).toLocaleString('bn-BD')}
              </span>
              {!previewPhoto.isPrimary && (
                <button
                  onClick={() => {
                    handleSetPrimaryPhoto(previewPhoto.id);
                    setPreviewPhoto(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition"
                >
                  প্রাইমারি হিসেবে সেট করুন
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: A4 DOCUMENT SUMMARY PRINT
      ========================================== */}
      {isPrintSummaryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Organization & Member Header */}
            <div className="border-b-2 border-slate-800 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">{currentOrg.name}</h2>
                <p className="text-xs text-slate-600 mt-0.5">সদস্যের সংযুক্তি ও পরিচিতি নথিপত্র সারসংক্ষেপ (A4 Print Summary)</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-800 block">তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                  {selectedMember.memberCode}
                </span>
              </div>
            </div>

            {/* Member Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">সদস্যের নাম:</span>
                <strong className="text-slate-800">{selectedMember.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">পেশা:</span>
                <span className="text-slate-800">{selectedMember.occupation || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">মোবাইল:</span>
                <span className="text-slate-800 font-numeric">{selectedMember.mobile}</span>
              </div>
            </div>

            {/* Document Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-display">সংযুক্ত দলিলের তালিকা</h4>
              <table className="w-full text-left text-xs border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-800">
                    <th className="p-2 border-r border-slate-200">#</th>
                    <th className="p-2 border-r border-slate-200">ডকুমেন্টের নাম</th>
                    <th className="p-2 border-r border-slate-200">ধরন</th>
                    <th className="p-2 border-r border-slate-200">রেফারেন্স নম্বর</th>
                    <th className="p-2 border-r border-slate-200">মেয়াদ</th>
                    <th className="p-2">যাচাই স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-numeric">
                  {currentMemberDocuments.map((d, index) => {
                    const dt = currentOrgDocTypes.find((t) => t.id === d.documentTypeId);
                    return (
                      <tr key={d.id}>
                        <td className="p-2 border-r border-slate-200 text-center">{index + 1}</td>
                        <td className="p-2 border-r border-slate-200 font-medium">{d.documentTitle}</td>
                        <td className="p-2 border-r border-slate-200">{dt?.name || '—'}</td>
                        <td className="p-2 border-r border-slate-200 font-mono">{maskSensitiveValue(d.documentNumberReference, d.id)}</td>
                        <td className="p-2 border-r border-slate-200">{d.expiryDate || 'আজীবন'}</td>
                        <td className="p-2 font-bold capitalize">{d.verificationStatus}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Signature Area */}
            <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs">
              <div className="border-t border-slate-400 pt-2">
                <span className="text-slate-600">যাচাইকারী কর্মকর্তার স্বাক্ষর ও সিল</span>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <span className="text-slate-600">সাধারণ সম্পাদক / সভাপতি</span>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsPrintSummaryOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: ADD / EDIT DOCUMENT TYPE MASTER DATA
      ========================================== */}
      {isDocTypeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 font-display">
                {editingDocType ? 'ডকুমেন্ট টাইপ সম্পাদনা' : 'নতুন ডকুমেন্ট টাইপ যুক্ত করুন'}
              </h3>
              <button onClick={() => setIsDocTypeModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveDocType} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">কোড (Unique Code) <span className="text-rose-500">*</span>:</label>
                <input
                  type="text"
                  placeholder="যেমন: PASSPORT, TAX_CERT"
                  value={docTypeCode}
                  onChange={(e) => setDocTypeCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">টাইপের নাম <span className="text-rose-500">*</span>:</label>
                <input
                  type="text"
                  placeholder="যেমন: পাসপোর্ট কপি"
                  value={docTypeName}
                  onChange={(e) => setDocTypeName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">সংক্ষিপ্ত বিবরণ:</label>
                <textarea
                  rows={2}
                  placeholder="এই ডকুমেন্টের উদ্দেশ্য ও প্রয়োজনীয়তা..."
                  value={docTypeDesc}
                  onChange={(e) => setDocTypeDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDocTypeModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg font-semibold transition"
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
