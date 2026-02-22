import type { DocumentCategory, ConfidentialityLevel, DocumentStatus } from '@/types/document.types';
import type { UserRole } from '@/types/auth.types';
import type { WorkflowStatus, WorkflowStep } from '@/types/workflow.types';

export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  DECISION: 'Décision',
  CIRCULAIRE: 'Circulaire',
  RAPPORT: 'Rapport',
  BUDGET: 'Budget',
  RH: 'Ressources Humaines',
  CORRESPONDANCE: 'Correspondance',
  PROJET_PEDAGOGIQUE: 'Projet pédagogique',
  INSPECTION: 'Inspection',
  ARCHIVE: 'Archive',
  AUTRE: 'Autre',
};

export const CONFIDENTIALITY_LABELS: Record<ConfidentialityLevel, string> = {
  PUBLIC: 'Public',
  INTERNE: 'Interne',
  CONFIDENTIEL: 'Confidentiel',
  SECRET: 'Secret',
};

export const STATUS_LABELS: Record<DocumentStatus, string> = {
  BROUILLON: 'Brouillon',
  EN_REVISION: 'En révision',
  EN_ATTENTE: 'En attente',
  APPROUVE: 'Approuvé',
  REJETE: 'Rejeté',
  ARCHIVE: 'Archivé',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  CADRE: 'Cadre',
  INSPECTEUR: 'Inspecteur',
  RH: 'Ressources Humaines',
  COMPTABLE: 'Comptable',
  CONSULTANT: 'Consultant',
};

export const STATUS_COLORS: Record<DocumentStatus, string> = {
  BROUILLON: 'bg-gray-100 text-gray-700',
  EN_REVISION: 'bg-purple-100 text-purple-700',
  EN_ATTENTE: 'bg-amber-100 text-amber-700',
  APPROUVE: 'bg-green-100 text-green-700',
  REJETE: 'bg-red-100 text-red-700',
  ARCHIVE: 'bg-blue-100 text-blue-700',
};

export const CONFIDENTIALITY_COLORS: Record<ConfidentialityLevel, string> = {
  PUBLIC: 'bg-green-100 text-green-700',
  INTERNE: 'bg-blue-100 text-blue-700',
  CONFIDENTIEL: 'bg-orange-100 text-orange-700',
  SECRET: 'bg-red-100 text-red-700',
};

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  PENDING: 'En attente',
  IN_PROGRESS: 'En cours',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
};

export const WORKFLOW_STEP_LABELS: Record<WorkflowStep, string> = {
  SOUMISSION: 'Soumission',
  REVISION: 'Révision',
  VALIDATION_N1: 'Validation N1',
  VALIDATION_N2: 'Validation N2',
  APPROBATION: 'Approbation',
  PUBLICATION: 'Publication',
};

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024;
