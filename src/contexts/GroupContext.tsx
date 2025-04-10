import React, { createContext, useContext, useState, useEffect } from "react";
import { StudyGroup, StudyLog, LeaderboardEntry } from "../types";
import { useAuth } from "./AuthContext";
import createGroupService from "@/services/createGroupService";
import { useToast } from "@/components/ui/use-toast";
import { listGroupServices } from "@/services/listGroupService";
interface GroupContextType {
  groups: StudyGroup[];
  currentGroup: StudyGroup | null;
  groupLogs: StudyLog[];
  leaderboard: LeaderboardEntry[];
  fetchGroups: () => Promise<void>;
  createGroup: (
    groupData: Partial<StudyGroup> & { image?: File }
  ) => Promise<void>;
  joinGroup: (inviteCode: string) => Promise<void>;
  selectGroup: (groupId: string) => void;
  addStudyLog: (
    groupId: string,
    minutes: number,
    note?: string
  ) => Promise<void>;
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

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [currentGroup, setCurrentGroup] = useState<StudyGroup | null>(null);
  const [groupLogs, setGroupLogs] = useState<StudyLog[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      const groups = await listGroupServices();
      console.log("FETCH GROUPS CONTEXT", groups.data);
      setGroups(groups.data);
    } catch (err) {
      setError("Failed to fetch groups.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createGroup = async (
    groupData: Partial<StudyGroup> & { image?: File }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const group = await createGroupService({
        name: groupData.name!,
        description: groupData.description!,
        startDate: new Date(groupData.startDate!),
        endDate: groupData.endDate ? new Date(groupData.endDate) : undefined,
        isPublic: groupData.isPublic || false,
        imageSrc: groupData.imageSrc,
      });

      await fetchGroups();

      toast({
        title: "Group created!",
        description: "Your study group has been created successfully.",
      });
    } catch (err) {
      setError("Failed to create group");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async (inviteCode: string) => {
    // em breve
  };

  const selectGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      setCurrentGroup(group);
      fetchGroupLogs(groupId);
      fetchLeaderboard(groupId);
    }
  };

  const addStudyLog = async (
    groupId: string,
    minutes: number,
    note?: string
  ) => {
    // em breve
  };

  const fetchGroupLogs = async (groupId: string) => {
    // em breve
  };

  const fetchLeaderboard = async (groupId: string) => {
    // em breve
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
        error,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
