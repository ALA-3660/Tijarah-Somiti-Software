export type EnvironmentType = 'development' | 'staging' | 'production';

export type UiSimulatorState = 'initial' | 'loading' | 'success' | 'empty' | 'error' | 'submitting' | 'offline' | 'unauthorized' | 'forbidden';

export type OrganizationStatusType = 'active' | 'inactive' | 'suspended' | 'archived' | 'demo';
export type OrganizationKind = 'society' | 'business' | 'social' | 'other';

export interface OrganizationContext {
  id: string;
  name: string;
  shortName: string;
  code: string;
  status: OrganizationStatusType;
  organizationType?: OrganizationKind;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isDemo?: boolean;
  demoBadgeText?: string;
  established?: string;
  regNumber?: string;
  demoDescription?: string;
}

export type AuthenticationStatusType =
  | 'initial'
  | 'restoring'
  | 'unauthenticated'
  | 'authenticating'
  | 'authenticated'
  | 'refreshing'
  | 'sessionExpired'
  | 'loggingOut'
  | 'error'
  | 'offline';

export type AuthenticationMethodType = 'password' | 'otp' | 'twoFactorAuthentication';

export interface AuthenticatedUserType {
  id: string;
  userCode: string;
  name: string;
  email: string;
  phone?: string;
  organizationId: string;
  organizationName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticationSessionType {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: AuthenticatedUserType;
  organizationId: string;
  authenticatedAt: string;
  method: AuthenticationMethodType;
}

export interface VerificationTest {
  id: string;
  name: string;
  category: 'Build' | 'Run' | 'Navigation' | 'Architecture' | 'Security' | 'Unit' | 'Widget' | 'Integration' | 'Shariah' | 'Governance' | 'UI/UX' | 'Functional';
  description: string;
  status: 'passed' | 'running' | 'failed';
  details: string;
}

export interface DartFileItem {
  path: string;
  name: string;
  layer: 'App' | 'Theme' | 'Core' | 'Domain' | 'Data' | 'Features' | 'Shared' | 'Root';
  summary: string;
  code: string;
}

export type MemberStatusType = 'active' | 'inactive' | 'suspended' | 'archived';

export interface MemberType {
  id: string;
  organizationId: string;
  memberCode: string;
  fullName: string;
  photoUrl?: string;
  mobile: string;
  email?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  gender?: 'male' | 'female' | 'other';
  occupation?: string;
  fatherOrSpouseName?: string;
  motherName?: string;
  nid?: string;
  currentAddress?: string;
  permanentAddress?: string;
  isSameAddress?: boolean;
  address?: string; // legacy fallback
  status: MemberStatusType;
  classificationId?: string; // Prompt 3.4
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  notes?: string;
  userId?: string;
}

export type MasterDataCategoryType = 'member_classification' | 'occupation' | 'gender' | 'relation_type';

export interface MemberMasterDataType {
  id: string;
  organizationId: string;
  masterType: MasterDataCategoryType;
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  isSystemDefined: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MemberClassificationType {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  isSystemDefined: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MemberClassificationHistoryType {
  id: string;
  organizationId: string;
  memberId: string;
  previousClassificationId?: string;
  previousClassificationName?: string;
  newClassificationId: string;
  newClassificationName: string;
  changedAt: string;
  changedBy: string;
  changedByName?: string;
  reason?: string;
  auditReference?: string;
}

export interface MemberRelationType {
  id: string;
  organizationId: string;
  memberId: string;
  relatedMemberId: string;
  relationTypeId: string;
  relationTypeName?: string;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface RelationTypeConfig {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  reciprocalCode?: string;
  reciprocalName?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  isSystemDefined: boolean;
}

export interface MemberStatusAuditType {
  id: string;
  organizationId: string;
  memberId: string;
  memberCode: string;
  previousStatus: MemberStatusType;
  newStatus: MemberStatusType;
  reason: string;
  changedByUserId: string;
  changedByName: string;
  timestamp: string;
}

export interface ProfileCompletenessSection {
  title: string;
  weight: number;
  isComplete: boolean;
  details: string;
}

export interface ProfileCompleteness {
  score: number;
  sections: {
    basicIdentity: ProfileCompletenessSection;
    contact: ProfileCompletenessSection;
    address: ProfileCompletenessSection;
    family: ProfileCompletenessSection;
    identification: ProfileCompletenessSection;
  };
}

export type MembershipApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'correction_required'
  | 'resubmitted'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export interface VerificationChecklistItemType {
  id: string;
  title: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  note?: string;
}

export interface ApplicationTimelineEventType {
  id: string;
  applicationId: string;
  event: string;
  actorName: string;
  actorId?: string;
  timestamp: string;
  note?: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface MembershipApplicationType {
  id: string;
  organizationId: string;
  applicationCode: string;
  applicantFullName: string;
  mobile: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  occupation?: string;
  fatherOrSpouseName?: string;
  motherName?: string;
  currentAddress?: string;
  permanentAddress?: string;
  isSameAddress?: boolean;
  nid?: string;
  photoReference?: string;
  notes?: string;
  applicationStatus: MembershipApplicationStatus;
  submittedAt?: string;
  verifiedAt?: string;
  decidedAt?: string;
  verifiedBy?: string;
  decidedBy?: string;
  decisionReason?: string;
  correctionReason?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  approvedMemberId?: string;
  checklist: VerificationChecklistItemType[];
  timeline: ApplicationTimelineEventType[];
}

// ==========================================
// Prompt 3.5: Member Documents & Photos Types
// ==========================================

export type MemberPhotoCategory = 'profile' | 'identity' | 'signature' | 'other';

export interface MemberPhotoType {
  id: string;
  organizationId: string;
  memberId: string;
  fileName: string;
  fileType: string;
  fileSize: number; // in bytes
  storageReference: string;
  thumbnailReference?: string;
  photoType: MemberPhotoCategory | string;
  isPrimary: boolean;
  uploadedAt: string;
  uploadedBy: string;
  updatedAt: string;
  updatedBy?: string;
  status: 'active' | 'archived';
}

export type DocumentVerificationStatus = 
  | 'pending_verification' // যাচাই অপেক্ষমাণ
  | 'verified'             // যাচাইকৃত
  | 'rejected'             // প্রত্যাখ্যাত
  | 'archived';            // আর্কাইভ

export interface DocumentTypeConfig {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  description?: string;
  isSystemDefined: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface GoogleDriveReference {
  provider: 'google_drive';
  fileId: string;
  fileName: string;
  webViewReference: string;
  createdAt: string;
}

export type DocumentStorageType = 'local_reference' | 'remote_reference' | 'google_drive_reference';

export interface MemberDocumentType {
  id: string;
  organizationId: string;
  memberId: string;
  documentTypeId: string;
  documentTitle: string;
  documentNumberReference?: string;
  description?: string;
  fileName: string;
  fileType: string;
  fileSize: number; // in bytes
  storageType: DocumentStorageType;
  storageReference: string;
  googleDriveReference?: GoogleDriveReference;
  issueDate?: string;
  expiryDate?: string;
  verificationStatus: DocumentVerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface AttachmentReferenceType {
  id: string;
  organizationId: string;
  ownerType: 'member';
  ownerId: string;
  attachmentType: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  storageType: DocumentStorageType;
  storageReference: string;
  createdAt: string;
  createdBy?: string;
}

export type DocumentAuditEventType = 
  | 'MEMBER_DOCUMENT_CREATED'
  | 'MEMBER_DOCUMENT_UPDATED'
  | 'MEMBER_DOCUMENT_VERIFIED'
  | 'MEMBER_DOCUMENT_REJECTED'
  | 'MEMBER_DOCUMENT_ARCHIVED'
  | 'MEMBER_DOCUMENT_VIEWED'
  | 'MEMBER_DOCUMENT_DOWNLOADED'
  | 'MEMBER_PHOTO_ADDED'
  | 'MEMBER_PHOTO_UPDATED'
  | 'MEMBER_PHOTO_ARCHIVED'
  | 'MEMBER_PRIMARY_PHOTO_CHANGED';

export interface DocumentAuditLogType {
  id: string;
  organizationId: string;
  memberId: string;
  eventType: DocumentAuditEventType;
  entityId: string;
  entityTitle: string;
  actorName: string;
  actorId: string;
  details: string;
  timestamp: string;
}

// ==========================================
// Prompt 3.6: Member Register, Search, History & Integration Types
// ==========================================

export type MemberActivityCategory = 
  | 'MEMBER_CREATED'
  | 'MEMBERSHIP_APPROVED'
  | 'PROFILE_UPDATED'
  | 'CLASSIFICATION_CHANGED'
  | 'RELATION_ADDED'
  | 'RELATION_UPDATED'
  | 'RELATION_ARCHIVED'
  | 'PHOTO_ADDED'
  | 'PRIMARY_PHOTO_CHANGED'
  | 'PHOTO_ARCHIVED'
  | 'DOCUMENT_ADDED'
  | 'DOCUMENT_UPDATED'
  | 'DOCUMENT_VERIFIED'
  | 'DOCUMENT_REJECTED'
  | 'DOCUMENT_ARCHIVED'
  | 'STATUS_CHANGED';

export interface MemberActivityEvent {
  id: string;
  organizationId: string;
  memberId: string;
  eventType: MemberActivityCategory;
  title: string;
  actorId: string;
  actorName: string;
  timestamp: string;
  referenceId?: string;
  referenceType?: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  notes?: string;
}

export type DuplicateMatchReason = 
  | 'SAME_MOBILE'
  | 'SAME_NID'
  | 'SAME_NAME_AND_DOB'
  | 'SIMILAR_IDENTITY_COMBINATION';

export interface DuplicateCandidate {
  id: string;
  organizationId: string;
  primaryMemberId: string;
  duplicateMemberId: string;
  primaryMemberName: string;
  duplicateMemberName: string;
  primaryMemberCode: string;
  duplicateMemberCode: string;
  primaryMobile: string;
  duplicateMobile: string;
  matchReasons: DuplicateMatchReason[];
  matchScorePercentage: number;
  detectedAt: string;
  status: 'pending_review' | 'reviewed_distinct' | 'flagged_for_manual_action';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface MemberFilterCriteria {
  searchQuery?: string;
  status?: MemberStatusType | 'all';
  classificationId?: string | 'all';
  gender?: 'male' | 'female' | 'other' | 'all';
  occupation?: string | 'all';
  joinDateFrom?: string;
  joinDateTo?: string;
  completenessFilter?: 'all' | 'complete' | 'incomplete';
  documentVerificationStatus?: DocumentVerificationStatus | 'all';
  photoStatus?: 'all' | 'has_primary' | 'no_primary';
}

export type MemberSortField = 'memberCode' | 'fullName' | 'joinedAt' | 'updatedAt' | 'classification' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface MemberSortOptions {
  field: MemberSortField;
  direction: SortDirection;
}

export interface MemberBulkActionPayload {
  actionType: 'status_change' | 'classification_change' | 'export_csv' | 'print_summary';
  targetMemberIds: string[];
  newStatus?: MemberStatusType;
  newClassificationId?: string;
  reason?: string;
  performedByUserId: string;
  performedByName: string;
}

export interface Member360Summary {
  member: MemberType;
  classificationName: string;
  completeness: ProfileCompleteness;
  totalDocuments: number;
  verifiedDocuments: number;
  pendingDocuments: number;
  rejectedDocuments: number;
  archivedDocuments: number;
  totalPhotos: number;
  hasPrimaryPhoto: boolean;
  primaryPhotoUrl?: string;
  activeRelationsCount: number;
  recentActivities: MemberActivityEvent[];
}

// ============================================================================
// Phase 4.1 — Master Data Architecture Foundation
// Domain Separation: Head ≠ Fund ≠ Account (Financial Side Effect: NONE)
// ============================================================================

export type MasterDataLifecycleStatus = 'active' | 'inactive' | 'archived';

export interface MasterDataDefinition {
  id: string;
  organizationId: string;
  masterDataType: string;
  code: string;
  name: string;
  displayName: string;
  description?: string;
  isSystemDefined: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MasterDataItem {
  id: string;
  organizationId: string;
  definitionId: string;
  code: string;
  name: string;
  description?: string;
  isSystemDefined: boolean;
  status: MasterDataLifecycleStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  usageCount?: number;
}

export interface MasterDataAuditLog {
  id: string;
  organizationId: string;
  entityId: string;
  entityType: 'definition' | 'item';
  action: 'CREATE' | 'UPDATE' | 'ACTIVATE' | 'DEACTIVATE' | 'ARCHIVE';
  actorUserId: string;
  actorName: string;
  timestamp: string;
  reason?: string;
  changesSummary?: string;
}

export interface MasterDataFilterCriteria {
  searchQuery?: string;
  definitionId?: string | 'all';
  status?: MasterDataLifecycleStatus | 'all';
  origin?: 'all' | 'system' | 'custom';
}

// ============================================================================
// Phase 4.2 — Head Management Foundation
// Domain Separation: Head (কেন) ≠ Fund (কোন উদ্দেশ্য) ≠ Account (কোথায়)
// Financial Side Effect: NONE
// ============================================================================

export type HeadType = 'income' | 'expense';
export type HeadLevel = 1 | 2;
export type HeadStatus = 'active' | 'inactive' | 'archived';

export interface Head {
  id: string;
  organizationId: string;
  headCode: string;
  name: string;
  description?: string;
  headType: HeadType;
  parentId: string | null;
  level: HeadLevel;
  isSystemDefined: boolean;
  isActive: boolean;
  status: HeadStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  childrenCount?: number;
}

export interface HeadAuditLog {
  id: string;
  organizationId: string;
  headId: string;
  headCode: string;
  headName: string;
  action: 'HEAD_CREATED' | 'HEAD_UPDATED' | 'HEAD_ACTIVATED' | 'HEAD_DEACTIVATED' | 'HEAD_ARCHIVED';
  actorUserId: string;
  actorName: string;
  timestamp: string;
  reason?: string;
  beforeState?: Partial<Head>;
  afterState?: Partial<Head>;
  changesSummary?: string;
}

export interface HeadFilterCriteria {
  searchQuery?: string;
  headType?: HeadType | 'all';
  level?: HeadLevel | 'all';
  status?: HeadStatus | 'all';
  origin?: 'all' | 'system' | 'custom';
  parentId?: string | 'all';
}

// ============================================================================
// Phase 4.4 — Fund Management Foundation
// Domain Separation: Head (কেন) ≠ Fund (কোন উদ্দেশ্য/শ্রেণি) ≠ Account (কোথায়)
// Structure: Flat Configurable Dimension (No Sub-Funds, No Hierarchies)
// Prohibited Religious Seeds: Zero Zakat, Waqf, Sadaqa, Fitra, Emergency Hardcoding
// Financial Side Effect: NONE (No Balances, No Ledgers, No Transactions)
// ============================================================================

export type FundType = 'general' | 'administrative' | 'share' | 'project' | 'custom';
export type FundStatus = 'active' | 'inactive' | 'archived';

export interface Fund {
  id: string;
  organizationId: string;
  fundCode: string; // e.g. "FND-001" (organization-scoped unique & immutable)
  name: string;
  description?: string;
  fundType: FundType;
  isSystemDefined: boolean;
  isActive: boolean;
  status: FundStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface FundAuditLog {
  id: string;
  organizationId: string;
  fundId: string;
  fundCode: string;
  fundName: string;
  action: 'FUND_CREATED' | 'FUND_UPDATED' | 'FUND_ACTIVATED' | 'FUND_DEACTIVATED' | 'FUND_ARCHIVED';
  actorUserId: string;
  actorName: string;
  timestamp: string;
  reason?: string;
  beforeState?: Partial<Fund>;
  afterState?: Partial<Fund>;
  changesSummary?: string;
}

export interface FundFilterCriteria {
  searchQuery?: string;
  fundType?: FundType | 'all';
  status?: FundStatus | 'all';
  origin?: 'all' | 'system' | 'custom';
}

// ============================================================================
// Phase 4.5 — Master Data Governance, Change History & Audit Foundation
// Architecture: Universal Master Data Governance Layer (Head, Fund, Account, Custom)
// Separation: Head (কেন) ≠ Fund (কোন উদ্দেশ্য/শ্রেণি) ≠ Account (কোথায়)
// Zero Financial Transactions / Zero Hard Delete
// ============================================================================

export type MasterDataEntityType = 'head' | 'fund' | 'account' | 'member_classification' | 'custom_master' | 'all';

export type GovernanceActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'ACTIVATE'
  | 'DEACTIVATE'
  | 'ARCHIVE'
  | 'BULK_ACTIVATE'
  | 'BULK_DEACTIVATE'
  | 'BULK_ARCHIVE';

export interface MasterDataChangeHistoryRecord {
  id: string; // historyId
  organizationId: string;
  entityType: MasterDataEntityType;
  entityId: string;
  entityCode: string;
  entityName: string;
  action: GovernanceActionType | string;
  actorUserId: string;
  actorName: string;
  actorRole?: string;
  timestamp: string; // ISO 8601
  reason: string; // Mandatory for all sensitive operations
  effectiveFrom: string; // YYYY-MM-DD
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  changedFields?: string[];
  referenceId?: string;
  correlationId?: string;
}

export interface GovernanceSummaryMetrics {
  totalMasterDataCount: number;
  activeCount: number;
  inactiveCount: number;
  archivedCount: number;
  recentChangesCount: number;
  recentStatusChangesCount: number;
  recentArchiveCount: number;
}

export interface BulkGovernanceItem {
  id: string;
  code: string;
  name: string;
  entityType: MasterDataEntityType;
  status: 'active' | 'inactive' | 'archived';
  isSystemDefined: boolean;
  selected?: boolean;
}

export interface BulkGovernanceResult {
  totalRequested: number;
  successfulCount: number;
  failedCount: number;
  items: Array<{
    id: string;
    code: string;
    name: string;
    success: boolean;
    errorReason?: string;
  }>;
}

export interface GovernanceFilterCriteria {
  searchQuery?: string;
  entityType?: MasterDataEntityType;
  action?: string | 'all';
  actorId?: string | 'all';
  status?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================================
// Phase 5.1 — Account Management Foundation
// Concept: Account = টাকা বর্তমানে কোথায় আছে (Financial Holding Location)
// Distinct from: Head (কেন) ≠ Fund (উদ্দেশ্য/শ্রেণি) ≠ Account (কোথায়)
// Strict Zero Financial Transaction / Zero Balance Calculation
// ============================================================================

export type AccountType = 'cash' | 'bank' | 'mobile_financial' | 'custom';
export type AccountStatus = 'active' | 'inactive' | 'archived';

export interface Account {
  id: string;
  organizationId: string;
  accountCode: string; // e.g. ACC-001 (Immutable, Auto-generated)
  accountName: string; // e.g. প্রধান ক্যাশ, ইসলামী ব্যাংক সঞ্চয়ী হিসাব
  accountType: AccountType; // cash | bank
  accountSubtype?: string; // e.g. 'main_cash', 'petty_cash', 'savings', 'current'
  description?: string;
  
  // Bank Specific Details
  accountHolderName?: string;
  bankName?: string;
  branchName?: string;
  accountNumberMasked?: string; // e.g. ******4589 (Masked for privacy)
  routingNumberMasked?: string; // e.g. ***123
  mobileNumberMasked?: string;
  
  // Fund Association (Many-to-Many Foundation)
  associatedFundIds?: string[]; // IDs of funds that can be held in this account
  
  openingBalanceSupported: boolean; // Structural flag (Balance engine pending)
  isSystemDefined: boolean;
  status: AccountStatus;
  sortOrder: number;
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface AccountFundAssociation {
  id: string;
  organizationId: string;
  accountId: string;
  fundId: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface AccountFilterCriteria {
  searchQuery?: string;
  accountType?: AccountType | 'all';
  status?: AccountStatus | 'all';
  origin?: 'all' | 'system' | 'custom';
  bankName?: string | 'all';
}

// ============================================================================
// Phase 5.2 — Financial Transaction Core Foundation
// Concept: Transaction = একটি আর্থিক ঘটনা বা লেনদেনের মৌলিক রেকর্ড
// Separation: Head (কেন) ≠ Fund (উদ্দেশ্য/শ্রেণি) ≠ Account (কোথায়) ≠ Transaction (ঘটনা)
// Official Balance Rule: শুধুমাত্র APPROVED লেনদেন অফিশিয়াল ফিন্যান্সিয়াল স্টেটে প্রভাব ফেলবে
// Lifecycle: DRAFT -> SUBMITTED -> APPROVED / REJECTED (Rejection -> DRAFT -> SUBMITTED)
// Security: Separation of Duties (createdBy !== approvedBy), Multi-Tenant Scoped
// ============================================================================

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type TransactionStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface FinancialTransaction {
  id: string; // Immutable UUID
  organizationId: string; // Tenant Boundary
  transactionCode: string; // e.g. "TRX-2026-000001" (Unique within Organization, Human-Readable)
  transactionType: TransactionType;
  transactionDate: string; // YYYY-MM-DD (Actual economic transaction date)
  amount: number; // Positive monetary quantity with 2 decimal precision (Stored as numeric)
  accountId: string; // Foreign Key -> Phase 5.1 Account (Where money is held)
  fundId: string; // Foreign Key -> Phase 4 Fund (Purpose / Capital pool)
  headId: string; // Foreign Key -> Phase 4 Head (Income/Expense classification)
  description: string;
  reference?: string; // Voucher / Challan / Memo number
  status: TransactionStatus;
  
  // Separation of Duties & Workflow Actors
  createdBy: string; // User ID who created the draft
  createdByName?: string;
  submittedBy?: string;
  submittedByName?: string;
  submittedAt?: string; // ISO 8601
  approvedBy?: string; // Must NOT equal createdBy (Separation of duties)
  approvedByName?: string;
  approvedAt?: string; // ISO 8601
  rejectedBy?: string;
  rejectedByName?: string;
  rejectedAt?: string; // ISO 8601
  rejectionReason?: string;
  
  // Concurrency & Optimistic Lock Token
  version: number;
  
  // Timestamps
  createdAt: string; // ISO 8601 (System creation time)
  updatedAt: string; // ISO 8601 (System update time)
}

export interface TransactionFilterCriteria {
  searchQuery?: string;
  transactionType?: TransactionType | 'all';
  status?: TransactionStatus | 'all';
  accountId?: string | 'all';
  fundId?: string | 'all';
  headId?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string | 'all';
}

export interface TransactionSummaryMetrics {
  totalCount: number;
  draftCount: number;
  submittedCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalApprovedAmount: number;
}

// ============================================================================
// Phase 5.3 — Income Management (Unified Dynamic Income Entry Foundation)
// ============================================================================

export type PaymentMethodType = 'cash' | 'bank_transfer' | 'qr_payment' | 'cheque' | 'other';

export interface IncomeMemberDetails {
  memberId?: string;
  memberCode?: string;
  memberName?: string;
  fiscalYear?: string; // e.g. "2025-2026"
  feeYear?: number; // e.g. 2026 (for Annual Fee, Annual Admin Fee)
  monthlyFeeRate?: number;
  startMonth?: string;
  endMonth?: string;
  totalMonths?: number;
  totalPayable?: number;
  previouslyPaid?: number;
  arrears?: number;
  advance?: number;
  adjustmentDiscount?: number;
  adjustmentReason?: string;
  // Admission + Passbook
  admissionFee?: number;
  hasPassbook?: boolean;
  passbookPrice?: number;
  passbookNumber?: string;
  // One-time / Other fees
  feeName?: string;
  feePurpose?: string;
}

export interface IncomeSaleProductLine {
  productId?: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
}

export interface IncomeSaleDetails {
  buyerType: 'member' | 'external_party';
  buyerId?: string;
  buyerName: string;
  salesNo: string;
  products: IncomeSaleProductLine[];
  discount: number;
  totalSaleAmount: number;
  previouslyPaid: number;
  outstanding: number;
  paymentType: 'full' | 'installment';
  installmentCount?: number;
  installmentAmount?: number;
  firstDueDate?: string;
}

export interface IncomeRentalDetails {
  assetType: string;
  assetId?: string;
  assetName: string;
  tenantType: 'member' | 'external_party';
  tenantId?: string;
  tenantName: string;
  leaseAgreementNo: string;
  rentPeriodStart: string;
  rentPeriodEnd: string;
  periodCount: number;
  scheduledRent: number;
  previousArrears: number;
  outstanding: number;
  advance: number;
}

export interface IncomeAssetSaleDetails {
  assetId?: string;
  assetName: string;
  buyerName: string;
  saleDate: string;
  // Read-only Book Info
  acquisitionCost: number;
  acquisitionIncidentalCost: number;
  totalAcquisitionCost: number;
  subsequentCapitalExpenditure: number;
  totalAssetCost: number;
  accumulatedDepreciation: number;
  bookValueAtSale: number; // হিসাবি মূল্য
  // Sale Info
  salePrice: number;
  saleCost: number;
  netSaleProceeds: number; // নেট বিক্রয় প্রাপ্তি
  netGainOrLoss: number; // নেট লাভ/ক্ষতি (নেট বিক্রয় প্রাপ্তি - হিসাবি মূল্য)
  previouslyPaid: number;
  outstanding: number;
}

export interface IncomeBusinessDetails {
  businessActivity: string;
  incomeTitle: string;
  sourceType: 'member' | 'external_party' | 'general';
  sourceName: string;
}

export interface IncomeDonationDetails {
  purposeType: 'general' | 'event' | 'initiative';
  purposeName: string;
  donorType: 'member' | 'external_party' | 'anonymous';
  donorName: string;
  isAnonymous: boolean;
}

export interface IncomeGeneralDetails {
  receiptTitle: string;
  sourceType: 'member' | 'external_party' | 'general';
  sourceName: string;
}

export interface IncomeEntry {
  id: string; // UUID
  organizationId: string;
  incomeTypeCode: string; // e.g. 'member_monthly_fee'
  transactionCode: string; // System Generated (e.g. "TRX-2026-000001")
  receiptNo: string; // Distinct Receipt No (e.g. "REC-2026-0001")
  entryDate: string; // YYYY-MM-DD
  amount: number; // Numeric / Positive decimal
  amountInWordsBn: string; // System generated Bengali text
  paymentMethod: PaymentMethodType;
  paymentMethodDetails?: string;
  accountId: string; // Foreign Key -> Account (Where)
  fundId: string; // Foreign Key -> Fund (Purpose/Class)
  headId: string; // Foreign Key -> Head (Why - INC-*)
  description: string;
  reference?: string;
  supportingDocName?: string;
  status: TransactionStatus; // 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  
  // Refundability & Member Settlement Metadata
  isRefundable: boolean;
  isMemberSettlementEligible: boolean;
  isCapital: boolean;

  // Type-specific detailed payloads
  memberDetails?: IncomeMemberDetails;
  saleDetails?: IncomeSaleDetails;
  rentalDetails?: IncomeRentalDetails;
  assetSaleDetails?: IncomeAssetSaleDetails;
  businessIncomeDetails?: IncomeBusinessDetails;
  donationDetails?: IncomeDonationDetails;
  generalReceiptDetails?: IncomeGeneralDetails;

  // Separation of Duties & Workflow Actors
  createdBy: string;
  createdByName?: string;
  submittedBy?: string;
  submittedByName?: string;
  submittedAt?: string;
  approvedBy?: string; // Must NOT equal createdBy
  approvedByName?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectedAt?: string;
  rejectionReason?: string;

  // Concurrency & Timestamps
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeFilterCriteria {
  searchQuery?: string;
  incomeTypeCode?: string | 'all';
  status?: TransactionStatus | 'all';
  accountId?: string | 'all';
  fundId?: string | 'all';
  headId?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
  memberId?: string | 'all';
  minAmount?: number;
  maxAmount?: number;
}

export interface IncomeSummaryMetrics {
  totalCount: number;
  draftCount: number;
  submittedCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalApprovedAmount: number;
  todayApprovedAmount: number;
}

// Convenient Type Aliases
export type AccountEntity = Account;
export type FundEntity = Fund;
export type HeadEntity = Head;








