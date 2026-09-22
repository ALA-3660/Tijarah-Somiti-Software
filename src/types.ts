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
