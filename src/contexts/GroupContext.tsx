
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudyGroup, StudyLog, LeaderboardEntry } from '../types';
import { useAuth } from './AuthContext';

interface GroupContextType {
  groups: StudyGroup[];
  currentGroup: StudyGroup | null;
  groupLogs: StudyLog[];
  leaderboard: LeaderboardEntry[];
  fetchGroups: () => Promise<void>;
  createGroup: (groupData: Partial<StudyGroup>) => Promise<void>;
  joinGroup: (inviteCode: string) => Promise<void>;
  selectGroup: (groupId: string) => void;
  addStudyLog: (groupId: string, minutes: number, note?: string) => Promise<void>;
  fetchGroupLogs: (groupId: string) => Promise<void>;
  fetchLeaderboard: (groupId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const GroupContext = createContext<GroupContextType>({
  groups: [],
  currentGroup: null,
  groupLogs: [],
  leaderboard: [],
  fetchGroups: async () => {},
  createGroup: async () => {},
  joinGroup: async () => {},
  selectGroup: () => {},
  addStudyLog: async () => {},
  fetchGroupLogs: async () => {},
  fetchLeaderboard: async () => {},
  isLoading: false,
  error: null,
});

export const useGroup = () => useContext(GroupContext);

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [currentGroup, setCurrentGroup] = useState<StudyGroup | null>(null);
  const [groupLogs, setGroupLogs] = useState<StudyLog[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demo purposes
  const mockGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'ENEM Study Squad',
      description: 'Preparing for ENEM 2023',
      createdAt: '2023-01-15T00:00:00.000Z',
      startDate: '2023-01-15T00:00:00.000Z',
      endDate: '2023-11-30T00:00:00.000Z',
      inviteCode: 'ENEM2023',
      isPublic: true,
      ownerId: '1',
    },
    {
      id: '2',
      name: 'CS50 Study Group',
      description: 'Harvard CS50 study group',
      createdAt: '2023-02-10T00:00:00.000Z',
      startDate: '2023-02-10T00:00:00.000Z',
      inviteCode: 'CS50HARV',
      isPublic: false,
      ownerId: '2',
    },
  ];

  const mockLogs: StudyLog[] = [
    {
      id: '1',
      userId: '1',
      groupId: '1',
      minutes: 120,
      note: 'Studied history topics for ENEM',
      createdAt: '2023-03-15T14:30:00.000Z',
      user: {
        username: 'user1',
        avatarUrl: undefined,
      }
    },
    {
      id: '2',
      userId: '2',
      groupId: '1',
      minutes: 90,
      note: 'Math practice exercises',
      createdAt: '2023-03-16T10:15:00.000Z',
      user: {
        username: 'user2',
      }
    },
  ];

  const mockLeaderboard: LeaderboardEntry[] = [
    {
      userId: '1',
      username: 'user1',
      totalMinutes: 350,
    },
    {
      userId: '2',
      username: 'user2',
      totalMinutes: 275,
    },
  ];

  const fetchGroups = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setGroups(mockGroups);
    } catch (err) {
      setError('Failed to fetch study groups');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createGroup = async (groupData: Partial<StudyGroup>) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newGroup: StudyGroup = {
        id: Date.now().toString(),
        name: groupData.name || 'New Study Group',
        description: groupData.description || '',
        createdAt: new Date().toISOString(),
        startDate: groupData.startDate || new Date().toISOString(),
        endDate: groupData.endDate,
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        isPublic: groupData.isPublic || false,
        ownerId: user.id,
      };
      
      setGroups([...groups, newGroup]);
    } catch (err) {
      setError('Failed to create study group');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async (inviteCode: string) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would verify the invite code with the backend
      const foundGroup = mockGroups.find(g => g.inviteCode === inviteCode);
      
      if (foundGroup) {
        if (!groups.some(g => g.id === foundGroup.id)) {
          setGroups([...groups, foundGroup]);
        }
      } else {
        setError('Invalid invite code');
      }
    } catch (err) {
      setError('Failed to join study group');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setCurrentGroup(group);
      fetchGroupLogs(groupId);
      fetchLeaderboard(groupId);
    }
  };

  const addStudyLog = async (groupId: string, minutes: number, note?: string) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLog: StudyLog = {
        id: Date.now().toString(),
        userId: user.id,
        groupId,
        minutes,
        note,
        createdAt: new Date().toISOString(),
        user: {
          username: user.username,
          avatarUrl: user.avatarUrl,
        }
      };
      
      setGroupLogs([newLog, ...groupLogs]);
    } catch (err) {
      setError('Failed to add study log');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupLogs = async (groupId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter logs for the specific group
      const filteredLogs = mockLogs.filter(log => log.groupId === groupId);
      setGroupLogs(filteredLogs);
    } catch (err) {
      setError('Failed to fetch group logs');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaderboard = async (groupId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would fetch the leaderboard for the specified group
      setLeaderboard(mockLeaderboard);
    } catch (err) {
      setError('Failed to fetch leaderboard');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  return (
    <GroupContext.Provider 
      value={{ 
        groups, 
        currentGroup, 
        groupLogs,
        leaderboard,
        fetchGroups, 
        createGroup, 
        joinGroup, 
        selectGroup,
        addStudyLog,
        fetchGroupLogs,
        fetchLeaderboard,
        isLoading, 
        error 
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
