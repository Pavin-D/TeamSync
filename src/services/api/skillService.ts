import { apiClient } from './client';
import { ApiResponse } from '@/types/api';

export type SkillSource = 'GITHUB' | 'SELF_DECLARED' | 'COURSEWORK' | 'AI_DERIVED';
export type SkillCategory = 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'AI_ML' | 'DEVOPS' | 'MOBILE' | 'OTHER';

export interface SkillEvidenceItem {
  repoName: string;
  repoUrl: string;
  linesOfCode: number;
  lastActive: string;
  dependencyReference?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  confidenceScore: number; // 0 to 100
  estimatedLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  source: SkillSource;
  evidenceCount: number;
  evidenceDetails?: SkillEvidenceItem[];
}

export const skillService = {
  getMySkills: async (): Promise<ApiResponse<SkillItem[]>> => {
    return apiClient.get<SkillItem[]>('/skills/my-skills');
  },

  addManualSkill: async (name: string, category: SkillCategory): Promise<ApiResponse<SkillItem>> => {
    return apiClient.post<SkillItem>('/skills/manual', { name, category });
  },

  removeManualSkill: async (skillId: string): Promise<ApiResponse<{ removed: boolean }>> => {
    return apiClient.delete<{ removed: boolean }>(`/skills/manual/${skillId}`);
  },

  getSkillEvidence: async (skillName: string): Promise<ApiResponse<{ skillName: string; evidence: SkillEvidenceItem[] }>> => {
    return apiClient.get<{ skillName: string; evidence: SkillEvidenceItem[] }>(`/skills/${skillName}/evidence`);
  },
};
