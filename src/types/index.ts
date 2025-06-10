// User types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface AuthUser extends User {
  token: string;
}

// Study group types
export interface StudyGroup {
  owner: any;
  members: any;
  _count: any;
  description: string;
  id: number;
  name: string;
  groupCode: string;
  imageSrc: string;
  isPublic: boolean;
  ownerId: string;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
}

// Study log types
export interface StudyLog {
  id: string;
  userId: string;
  groupId: string;
  minutes: number;
  note?: string;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
}

// Leaderboard entry type
export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarUrl?: string;
  totalMinutes: number;
  position: number;
}
