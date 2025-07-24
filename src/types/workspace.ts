// Future workspace/team structure

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: User[];
  settings: {
    auto_transcription: boolean;
    ai_summary: boolean;
    blockchain_verification: boolean;
    retention_days: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  teams: Team[];
  billing_plan: 'free' | 'pro' | 'enterprise';
  storage_quota: number;
  features: string[];
}

export interface Meeting {
  id: string;
  title: string;
  team_id?: string;
  organization_id?: string;
  created_by: string;
  participants: User[];
  visibility: 'private' | 'team' | 'organization' | 'public';
  // ...existing meeting properties
}
