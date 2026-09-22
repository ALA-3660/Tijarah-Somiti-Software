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
  category: 'Build' | 'Run' | 'Navigation' | 'Architecture' | 'Security';
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



