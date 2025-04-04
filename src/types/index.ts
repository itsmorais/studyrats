
// User types
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface AuthUser extends User {
  token: string;
}

// Study group types
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  startDate: string;
  endDate?: string;
  inviteCode: string;
  isPublic: boolean;
  ownerId: string;
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
    username: string;
    avatarUrl?: string;
  };
}

// Leaderboard entry type
export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl?: string;
  totalMinutes: number;
}
