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
export type TransactionStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'POSTED' | 'REJECTED';

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
  postedBy?: string;
  postedByName?: string;
  postedAt?: string;
  financialTransactionId?: string;
  isFinancialPosted?: boolean;

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

// ============================================================================
// Phase 5.4 — Expense Management & Payment Voucher Architecture
// Scope: 7 Locked General Expense Types, Payment Vouchers, Maker-Checker,
// Immutable Approved State, POS Print, and Strict Tenant Isolation.
// ============================================================================

export type ExpenseTypeCode =
  | 'administrative_expense'
  | 'general_operational_expense'
  | 'maintenance_repair_expense'
  | 'professional_service_expense'
  | 'publicity_publication_communication_expense'
  | 'social_institutional_activity_expense'
  | 'other_general_expense';

export type ExpensePartyType = 'member' | 'external_party' | 'organization' | 'other_approved';

export type ExpenseAuditEventType =
  | 'EXPENSE_CREATED'
  | 'EXPENSE_UPDATED'
  | 'EXPENSE_SUBMITTED'
  | 'EXPENSE_APPROVED'
  | 'EXPENSE_REJECTED'
  | 'EXPENSE_REOPENED'
  | 'EXPENSE_POS_PRINTED'
  | 'EXPENSE_VOUCHER_PRINTED'
  | 'EXPENSE_SENSITIVE_VIEWED';

export type ExpensePermissionKey =
  | 'finance.expense.view'
  | 'finance.expense.create'
  | 'finance.expense.edit'
  | 'finance.expense.submit'
  | 'finance.expense.approve'
  | 'finance.expense.reject'
  | 'finance.expense.reopen'
  | 'finance.expense.print'
  | 'finance.expense.voucher_print';

export interface ExpenseAuditEvent {
  id: string;
  expenseId: string;
  eventType: ExpenseAuditEventType;
  actorId: string;
  actorName: string;
  timestamp: string; // ISO 8601
  notes?: string;
  details?: Record<string, any>;
}

export interface SupportingDocumentMeta {
  id: string;
  name: string;
  type: string;
  referenceNumber?: string;
  status: 'attached' | 'pending' | 'verified';
  attachedAt: string;
}

export interface ExpenseEntry {
  // Identity & Multi-Tenant Boundary
  id: string; // EXP-UUID
  organizationId: string;
  expenseCode: string; // e.g. "EXP-2026-000101"
  voucherNumber: string; // e.g. "PV-2026-000101" (Generated upon approval / distinct from expense ID)
  transactionCode: string; // e.g. "TRX-2026-000201" (Financial posting identifier)
  financialTransactionId?: string; // Unique financial ledger reference (Idempotency Key)
  isFinancialPosted?: boolean;

  // Classification & Domain Scoping
  sourceDomain: 'GENERAL_FINANCE'; // Must always be GENERAL_FINANCE for general expense
  sourceType: string; // 'general_operational' | 'voucher' | 'office'
  sourceId?: string;
  expenseTypeCode: ExpenseTypeCode;
  expenseHeadId: string; // Foreign Key -> Master Data Head (Must be EXP-*)

  // Financial Dimensions (Head ≠ Fund ≠ Account)
  fundId: string; // Foreign Key -> Master Data Fund
  accountId: string; // Foreign Key -> Account (Where money was disbursed from)
  amount: number; // Numeric / Positive decimal
  amountInWordsBn: string; // System generated Bengali text
  expenseDate: string; // YYYY-MM-DD
  paymentMethod: PaymentMethodType;
  paymentMethodDetails?: string;

  // Payee Information
  partyType: ExpensePartyType;
  partyId?: string; // Optional member or vendor ID
  payeeName: string; // Name of person or vendor receiving payment

  // Reference & Bill Numbers
  billNumber?: string; // Vendor invoice / Memo / Cash memo number
  referenceNumber?: string; // Internal tracking / sanction file number
  externalReference?: string; // Cheque number / transaction transaction ID

  // Supporting Information & Notes
  description: string;
  supportingDocuments: SupportingDocumentMeta[];
  notes?: string;

  // Lifecycle & Approval Workflow (Maker-Checker Enforced)
  status: TransactionStatus; // 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  submittedBy?: string;
  submittedByName?: string;
  submittedAt?: string;
  approvedBy?: string; // Must NOT equal createdBy (Separation of Duties)
  approvedByName?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  postedBy?: string;
  postedByName?: string;
  postedAt?: string;

  // Concurrency & Immutability Token
  version: number;
  updatedAt: string;

  // Append-only Audit History
  auditHistory: ExpenseAuditEvent[];
}

export interface ExpenseFilterCriteria {
  searchQuery?: string;
  expenseTypeCode?: ExpenseTypeCode | 'all';
  status?: TransactionStatus | 'all';
  accountId?: string | 'all';
  fundId?: string | 'all';
  expenseHeadId?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
  partyType?: ExpensePartyType | 'all';
  paymentMethod?: PaymentMethodType | 'all';
  minAmount?: number;
  maxAmount?: number;
}

export interface ExpenseSummaryMetrics {
  totalCount: number;
  draftCount: number;
  submittedCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalApprovedAmount: number;
  todayApprovedAmount: number;
  administrativeExpenseAmount: number;
  operationalExpenseAmount: number;
}

// ============================================================================
// PHASE 5.5: TRANSFER MANAGEMENT TYPES (TSS-P5.5-TRANSFER-2026)
// ============================================================================

export type TransferTypeCode =
  | 'cash_deposit'               // Cash to Bank
  | 'cash_withdrawal'            // Bank to Cash
  | 'bank_to_bank'               // Bank to Bank
  | 'account_to_account'         // General Account to Account
  | 'internal_fund_preserving';  // Internal Fund-Preserving Transfer

export type TransferMethodType =
  | 'cash'
  | 'bank_transfer'
  | 'cheque'
  | 'online'
  | 'mobile_banking'
  | 'internal_clearing';

export type TransferStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'POSTED' | 'REJECTED';

export type TransferAuditEventType =
  | 'TRANSFER_CREATED'
  | 'TRANSFER_UPDATED'
  | 'TRANSFER_SUBMITTED'
  | 'TRANSFER_APPROVED'
  | 'TRANSFER_REJECTED'
  | 'TRANSFER_REOPENED'
  | 'TRANSFER_POSTED'
  | 'TRANSFER_POS_PRINTED'
  | 'TRANSFER_VOUCHER_PRINTED'
  | 'TRANSFER_SENSITIVE_VIEWED';

export type TransferPermissionKey =
  | 'finance.transfer.view'
  | 'finance.transfer.create'
  | 'finance.transfer.edit'
  | 'finance.transfer.submit'
  | 'finance.transfer.approve'
  | 'finance.transfer.reject'
  | 'finance.transfer.reopen'
  | 'finance.transfer.post'
  | 'finance.transfer.print'
  | 'finance.transfer.voucher_print';

export interface TransferAuditEvent {
  id: string;
  transferId: string;
  eventType: TransferAuditEventType;
  actorId: string;
  actorName: string;
  timestamp: string;
  notes?: string;
  changedFields?: Record<string, { before: any; after: any }>;
  version?: number;
}

export interface TransferEntry {
  // Identity & Multi-Tenant Boundary
  id: string; // TRF-UUID
  organizationId: string;
  transferCode: string; // e.g. "TRF-2026-000001"
  version: number;

  // Classification (Unified Account -> Account Model)
  transferType: TransferTypeCode;
  sourceAccountId: string; // Account where money is withdrawn/transferred out
  destinationAccountId: string; // Account where money is deposited/transferred in
  fundId: string; // Fund under which the transfer occurs (Fund Preservation Rule)

  // Financial
  amount: number; // Positive decimal
  amountInWordsBn: string; // Generated Bengali text
  transferDate: string; // YYYY-MM-DD
  transferMethod: TransferMethodType;

  // References & Tracking
  internalReference?: string;
  externalReference?: string;
  bankTransactionId?: string;
  chequeNumber?: string;
  depositSlipNumber?: string;
  instrumentReference?: string;

  // Description & Purpose
  transferPurpose: string;
  description: string;
  notes?: string;

  // Supporting Documents
  supportingDocuments: SupportingDocumentMeta[];

  // Workflow (Maker-Checker & Strict Status Machine)
  status: TransferStatus;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  submittedBy?: string;
  submittedByName?: string;
  submittedAt?: string;
  approvedBy?: string; // Must NOT equal createdBy (Separation of Duties)
  approvedByName?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  postedBy?: string;
  postedByName?: string;
  postedAt?: string;

  // Financial Posting Reference (Posting Engine Ready & Idempotency Key)
  financialTransactionId?: string;
  isFinancialPosted?: boolean;

  // Append-only Audit History
  auditHistory: TransferAuditEvent[];
}

export interface TransferFilterCriteria {
  searchQuery?: string;
  transferType?: TransferTypeCode | 'all';
  status?: TransferStatus | 'all';
  sourceAccountId?: string | 'all';
  destinationAccountId?: string | 'all';
  fundId?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
  transferMethod?: TransferMethodType | 'all';
  minAmount?: number;
  maxAmount?: number;
}

export interface TransferSummaryMetrics {
  totalCount: number;
  draftCount: number;
  submittedCount: number;
  approvedCount: number;
  postedCount: number;
  rejectedCount: number;
  totalApprovedAmount: number;
  totalPostedAmount: number;
  todayTransferredAmount: number;
}

// ============================================================================
// PHASE 5.6: OPENING BALANCE / প্রারম্ভিক স্থিতি TYPES (TSS-P5.6-OB-2026)
// ============================================================================

export type OpeningBalanceStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'POSTED' | 'REJECTED';

export type OpeningBalanceReasonCode =
  | 'system_migration'           // নতুন সফটওয়্যারে হিসাব স্থানান্তর
  | 'previous_cashbook'          // পূর্ববর্তী হিসাব খাতা থেকে স্থানান্তর
  | 'bank_statement_alignment'   // ব্যাংক স্টেটমেন্ট অনুযায়ী
  | 'committee_approved'         // কমিটি অনুমোদিত প্রারম্ভিক হিসাব
  | 'other';                     // অন্যান্য

export type OpeningBalanceAuditEventType =
  | 'OPENING_BALANCE_CREATED'
  | 'OPENING_BALANCE_UPDATED'
  | 'OPENING_BALANCE_SUBMITTED'
  | 'OPENING_BALANCE_APPROVED'
  | 'OPENING_BALANCE_REJECTED'
  | 'OPENING_BALANCE_REOPENED'
  | 'OPENING_BALANCE_POSTED'
  | 'OPENING_BALANCE_PRINTED'
  | 'OPENING_BALANCE_SENSITIVE_VIEWED';

export type OpeningBalancePermissionKey =
  | 'finance.opening_balance.view'
  | 'finance.opening_balance.create'
  | 'finance.opening_balance.edit'
  | 'finance.opening_balance.submit'
  | 'finance.opening_balance.approve'
  | 'finance.opening_balance.reject'
  | 'finance.opening_balance.reopen'
  | 'finance.opening_balance.print'
  | 'finance.opening_balance.post';

export interface OpeningBalanceAuditEvent {
  id: string;
  openingBalanceId: string;
  eventType: OpeningBalanceAuditEventType;
  actorId: string;
  actorName: string;
  timestamp: string;
  previousStatus?: OpeningBalanceStatus;
  newStatus?: OpeningBalanceStatus;
  notes?: string;
  changedFields?: Record<string, { before: any; after: any }>;
  version?: number;
}

export interface OpeningBalanceEntry {
  // Identity
  id: string;
  organizationId: string;
  openingBalanceCode: string; // "OB-YYYY-NNNNNN"
  version: number;

  // Account & Fund Mapping (Controlled Starting Position)
  accountId: string; // Only Cash / Bank account with openingBalanceSupported === true
  fundId: string;    // Associated active fund under account
  amount: number;    // Positive decimal > 0
  amountInWordsBn: string; // Bengali currency words
  openingDate: string;     // YYYY-MM-DD (Asia/Dhaka, no future date)

  // Reason & Classification
  reasonCode: OpeningBalanceReasonCode;
  reasonDetails?: string;  // Required if reasonCode === 'other'

  // Supporting Evidence
  supportingDocuments: SupportingDocumentMeta[];
  referenceNumber?: string;
  notes?: string;

  // Workflow (Maker-Checker Separation of Duties)
  status: OpeningBalanceStatus;
  createdBy: string;
  createdByName?: string;
  submittedBy?: string;
  submittedByName?: string;
  approvedBy?: string; // Must NOT equal createdBy
  approvedByName?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectionReason?: string;
  postedBy?: string;
  postedByName?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  postedAt?: string;

  // Financial Posting Boundary
  financialTransactionId?: string; // Idempotency reference when POSTED
  isFinancialPosted?: boolean;

  // Append-only Audit History
  auditHistory: OpeningBalanceAuditEvent[];
}

export interface OpeningBalanceFilterCriteria {
  searchQuery?: string;
  accountId?: string | 'all';
  fundId?: string | 'all';
  status?: OpeningBalanceStatus | 'all';
  reasonCode?: OpeningBalanceReasonCode | 'all';
  dateFrom?: string;
  dateTo?: string;
  makerId?: string | 'all';
  minAmount?: number;
  maxAmount?: number;
}

export interface OpeningBalanceSummaryMetrics {
  totalCount: number;
  draftCount: number;
  submittedCount: number;
  approvedCount: number;
  postedCount: number;
  rejectedCount: number;
  totalApprovedAmount: number;
  totalPostedAmount: number;
}

// ============================================================================
// PHASE 5.7: UNIFIED LEDGER PROJECTION / POSTING LAYER (TSS-P5.7-LEDGER-2026)
// ============================================================================

export type LedgerSourceType = 'OPENING_BALANCE' | 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'REVERSAL';
export type LedgerDirection = 'IN' | 'OUT';

export type LedgerAuditEventType =
  | 'LEDGER_POSTED'
  | 'LEDGER_DUPLICATE_BLOCKED'
  | 'LEDGER_RECONCILIATION_CHECKED'
  | 'LEDGER_REBUILD_STARTED'
  | 'LEDGER_REBUILD_COMPLETED'
  | 'LEDGER_REBUILD_FAILED'
  | 'LEDGER_VIEWED'
  | 'LEDGER_SOURCE_VIEWED';

export type LedgerPermissionKey =
  | 'finance.ledger.view'
  | 'finance.ledger.reconcile'
  | 'finance.ledger.rebuild'
  | 'finance.ledger.source_view';

export interface LedgerAuditEvent {
  id: string;
  organizationId: string;
  eventType: LedgerAuditEventType;
  actorId: string;
  actorName: string;
  timestamp: string;
  notes?: string;
  details?: Record<string, any>;
}

export interface LedgerEntry {
  id: string; // LED-UUID
  organizationId: string; // Tenant Boundary
  ledgerCode: string; // e.g. "LED-2026-000001"
  sourceType: LedgerSourceType; // Exact 4 source events: OPENING_BALANCE | INCOME | EXPENSE | TRANSFER
  sourceId: string; // Foreign Key to source entity
  sourceCode: string; // e.g. "OB-2026-000001", "INC-2026-000001", "EXP-2026-000001", "TRF-2026-000001"
  accountId: string; // Target Account (Where)
  fundId: string; // Target Fund (Purpose/Capital pool)
  entryDate: string; // YYYY-MM-DD
  direction: LedgerDirection; // 'IN' | 'OUT'
  amount: number; // Positive decimal amount (no floating point issues)
  description: string;
  version: number;
  postedAt: string; // ISO 8601
  postedBy: string; // Actor ID
  createdAt: string; // ISO 8601
}

export interface RunningBalanceEntry {
  entry: LedgerEntry;
  runningBalance: number;
}

export interface AccountFundBalanceSummary {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  fundId: string;
  fundCode: string;
  fundName: string;
  totalIn: number;
  totalOut: number;
  balance: number;
  entryCount: number;
  lastPostedDate?: string;
}

export interface AccountBalanceSummary {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  totalIn: number;
  totalOut: number;
  totalBalance: number;
  fundBreakdown: {
    fundId: string;
    fundCode: string;
    fundName: string;
    balance: number;
    totalIn: number;
    totalOut: number;
    entryCount: number;
  }[];
}

export interface FundBalanceSummary {
  fundId: string;
  fundCode: string;
  fundName: string;
  fundType: string;
  totalIn: number;
  totalOut: number;
  totalBalance: number;
  accountBreakdown: {
    accountId: string;
    accountCode: string;
    accountName: string;
    accountType: AccountType;
    balance: number;
    totalIn: number;
    totalOut: number;
    entryCount: number;
  }[];
}

export interface FinancialStatementSummary {
  dateFrom: string;
  dateTo: string;
  openingPosition: number;
  totalIn: number;
  totalOut: number;
  closingPosition: number;
  sourceBreakdown: {
    sourceType: LedgerSourceType;
    sourceLabelBn: string;
    direction: LedgerDirection;
    totalAmount: number;
    entryCount: number;
  }[];
  accountBreakdown: {
    accountId: string;
    accountName: string;
    openingBalance: number;
    totalIn: number;
    totalOut: number;
    closingBalance: number;
  }[];
  fundBreakdown: {
    fundId: string;
    fundName: string;
    openingBalance: number;
    totalIn: number;
    totalOut: number;
    closingBalance: number;
  }[];
}

export interface ReconciliationCheckResult {
  checkId: string;
  checkNameBn: string;
  isPassed: boolean;
  detailsBn: string;
  expectedValue?: string | number;
  actualValue?: string | number;
  discrepancy?: any;
}

export interface LedgerReconciliationReport {
  timestamp: string;
  organizationId: string;
  overallStatus: 'BALANCED' | 'RECONCILIATION_ERROR';
  checks: ReconciliationCheckResult[];
  totalAccountBalances: number;
  totalFundBalances: number;
  totalAccountFundBalances: number;
  postedSourceCount: number;
  ledgerEntriesCount: number;
}

export interface LedgerRebuildResult {
  timestamp: string;
  organizationId: string;
  previousEntryCount: number;
  newEntryCount: number;
  sourcesProcessed: number;
  status: 'SUCCESS' | 'FAILED';
  reconciliationPassed: boolean;
  messageBn: string;
}

export interface LedgerFilterCriteria {
  searchQuery?: string;
  sourceType?: LedgerSourceType | 'all';
  accountId?: string | 'all';
  fundId?: string | 'all';
  direction?: LedgerDirection | 'all';
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

// ============================================================================
// PHASE 5.8: REVERSAL & CORRECTION MANAGEMENT (TSS-P5.8-REV-COR-2026)
// ============================================================================

export type ReversalStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'POSTED' | 'REJECTED';

export type ReversalReasonCode =
  | 'wrong_entry'             // ভুল এন্ট্রি
  | 'duplicate_entry'         // Duplicate Entry
  | 'wrongly_posted'          // ভুলভাবে posted
  | 'transaction_cancelled'   // Transaction বাতিল
  | 'pre_correction'          // Correction-এর পূর্বধাপ
  | 'other';                  // অন্যান্য

export type ReversalAuditEventType =
  | 'REVERSAL_CREATED'
  | 'REVERSAL_UPDATED'
  | 'REVERSAL_SUBMITTED'
  | 'REVERSAL_APPROVED'
  | 'REVERSAL_REJECTED'
  | 'REVERSAL_REOPENED'
  | 'REVERSAL_POSTED'
  | 'REVERSAL_PRINTED'
  | 'REVERSAL_SENSITIVE_VIEWED';

export type ReversalPermissionKey =
  | 'finance.reversal.view'
  | 'finance.reversal.create'
  | 'finance.reversal.edit'
  | 'finance.reversal.submit'
  | 'finance.reversal.approve'
  | 'finance.reversal.reject'
  | 'finance.reversal.reopen'
  | 'finance.reversal.post'
  | 'finance.reversal.print';

export interface ReversalAuditEvent {
  id: string;
  reversalId: string;
  eventType: ReversalAuditEventType;
  actorId: string;
  actorName: string;
  timestamp: string;
  previousStatus?: ReversalStatus;
  newStatus?: ReversalStatus;
  notes?: string;
  changedFields?: Record<string, { before: any; after: any }>;
  version?: number;
}

export interface ReversalEntry {
  // Identity & Multi-Tenant Scoping
  id: string; // REV-UUID
  organizationId: string;
  reversalCode: string; // "REV-YYYY-NNNNNN"
  version: number;

  // Source Reference (Only POSTED sources are reversible)
  sourceType: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'OPENING_BALANCE';
  sourceId: string; // Foreign Key to original source entity
  sourceCode: string; // e.g. "INC-2026-0001", "EXP-2026-0001", "TRF-2026-0001", "OB-2026-0001"
  sourceDomain: string; // e.g. "GENERAL_FINANCE"

  // Reason & Justification
  reversalReasonCode: ReversalReasonCode;
  reversalReasonDetails?: string; // Mandatory if reasonCode === 'other'
  reversalDate: string; // YYYY-MM-DD

  // Financial Quantities (Strictly derived from original posted record)
  originalAmount: number; // Derived & Read-only
  reversalAmount: number; // Exactly equal to originalAmount (Full Reversal Only)
  amountInWordsBn: string;

  // Financial Dimensions (Inherited from original posted source)
  accountId: string; // Primary/Source Account
  destinationAccountId?: string; // For Transfer reversal: Original Destination Account
  fundId: string; // Inherited Fund
  headId?: string; // Original Head classification if applicable

  // Historical Snapshot Metadata
  originalPostedAt: string;
  originalPostedBy: string;

  // Workflow (Maker-Checker Enforced)
  status: ReversalStatus;
  createdBy: string;
  createdByName?: string;
  submittedBy?: string;
  submittedByName?: string;
  approvedBy?: string; // Must NOT equal createdBy (Separation of Duties)
  approvedByName?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectionReason?: string;
  postedBy?: string;
  postedByName?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  postedAt?: string;

  // Posting Engine & Idempotency Boundary
  financialTransactionId?: string; // Generated upon POSTED
  isFinancialPosted?: boolean;

  // Linked Correction Reference
  correctionId?: string;
  notes?: string;

  // Append-only Audit History
  auditHistory: ReversalAuditEvent[];
}

export interface ReversalFilterCriteria {
  searchQuery?: string;
  sourceType?: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'OPENING_BALANCE' | 'all';
  status?: ReversalStatus | 'all';
  accountId?: string | 'all';
  fundId?: string | 'all';
  reversalReasonCode?: ReversalReasonCode | 'all';
  dateFrom?: string;
  dateTo?: string;
  makerId?: string | 'all';
  minAmount?: number;
  maxAmount?: number;
}

// CORRECTION MANAGEMENT (TSS-P5.8-COR-2026)
export type CorrectionType = 'NON_FINANCIAL' | 'FINANCIAL';

export type CorrectionReasonCode =
  | 'wrong_amount'            // ভুল পরিমাণ
  | 'wrong_head'              // ভুল Head
  | 'wrong_fund'              // ভুল Fund
  | 'wrong_account'           // ভুল Account
  | 'wrong_date'              // ভুল তারিখ
  | 'wrong_party'             // ভুল Party/Source
  | 'duplicate_entry'         // Duplicate Entry
  | 'wrong_source_domain'     // ভুল Source Domain
  | 'other';                  // অন্যান্য

export type CorrectionStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'COMPLETED' | 'REJECTED';

export type CorrectionAuditEventType =
  | 'CORRECTION_CREATED'
  | 'CORRECTION_UPDATED'
  | 'CORRECTION_SUBMITTED'
  | 'CORRECTION_APPROVED'
  | 'CORRECTION_REJECTED'
  | 'CORRECTION_REOPENED'
  | 'CORRECTION_COMPLETED'
  | 'CORRECTION_PRINTED'
  | 'CORRECTION_SENSITIVE_VIEWED';

export type CorrectionPermissionKey =
  | 'finance.correction.view'
  | 'finance.correction.create'
  | 'finance.correction.edit'
  | 'finance.correction.submit'
  | 'finance.correction.approve'
  | 'finance.correction.reject'
  | 'finance.correction.reopen'
  | 'finance.correction.complete'
  | 'finance.correction.print';

export interface CorrectionAuditEvent {
  id: string;
  correctionId: string;
  eventType: CorrectionAuditEventType;
  actorId: string;
  actorName: string;
  timestamp: string;
  previousStatus?: CorrectionStatus;
  newStatus?: CorrectionStatus;
  notes?: string;
  changedFields?: Record<string, { before: any; after: any }>;
  version?: number;
}

export interface CorrectionSnapshot {
  sourceCode: string;
  sourceType: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'OPENING_BALANCE';
  amount: number;
  accountId: string;
  accountName?: string;
  destinationAccountId?: string;
  destinationAccountName?: string;
  fundId: string;
  fundName?: string;
  headId?: string;
  headName?: string;
  date: string;
  sourceDomain: string;
  partyOrSourceRef?: string;
  description?: string;
  reference?: string;
  originalStatus: string;
  originalPostedAt?: string;
  originalPostedBy?: string;
}

export interface CorrectionEntry {
  // Identity & Multi-Tenant Scoping
  id: string; // COR-UUID
  organizationId: string;
  correctionCode: string; // "COR-YYYY-NNNNNN"
  version: number;

  // Source & Chain Relationship
  originalSourceId: string;
  originalSourceCode: string;
  sourceType: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'OPENING_BALANCE';

  // Explicit Chain Links
  reversalId?: string;
  reversalCode?: string;
  correctedSourceId?: string;
  correctedSourceCode?: string;

  // Classification & Reason
  correctionType: CorrectionType;
  reasonCode: CorrectionReasonCode;
  reasonDetails?: string; // Mandatory if reasonCode === 'other'

  // Immutable Snapshots
  originalSnapshot: CorrectionSnapshot;
  correctedSnapshot?: Partial<CorrectionSnapshot>;
  financialEffect?: string;

  // Workflow (Maker-Checker Enforced)
  status: CorrectionStatus;
  createdBy: string;
  createdByName?: string;
  submittedBy?: string;
  submittedByName?: string;
  approvedBy?: string; // Must NOT equal createdBy (Separation of Duties)
  approvedByName?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectionReason?: string;
  completedBy?: string;
  completedByName?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  completedAt?: string;

  notes?: string;

  // Append-only Audit History
  auditHistory: CorrectionAuditEvent[];
}

export interface CorrectionFilterCriteria {
  searchQuery?: string;
  correctionType?: CorrectionType | 'all';
  sourceType?: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'OPENING_BALANCE' | 'all';
  status?: CorrectionStatus | 'all';
  reasonCode?: CorrectionReasonCode | 'all';
  dateFrom?: string;
  dateTo?: string;
  makerId?: string | 'all';
}



