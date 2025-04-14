import React, { createContext, useContext, useState, useEffect } from "react";
import { StudyGroup, StudyLog, LeaderboardEntry } from "../types";
import { useAuth } from "./AuthContext";
import createGroupService from "@/services/createGroupService";
import { useToast } from "@/components/ui/use-toast";
import { listGroupServices } from "@/services/listGroupService";
import { joinGroupService } from "@/services/joinGroup";
import { createStudyLogService } from "@/services/logService";
import { getGroupDetailService } from "@/services/getGroupDetailService";
import api from "@/services/api";

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
    title: string,
    studiedAt: Date,
    imageUrl: string,
    groupsIds: number[],
    note?: string,
  ) => Promise<void>;
  fetchGroupLogs: (groupId: string) => Promise<void>;
  fetchLeaderboard: (groupId: string,range:string) => Promise<void>;
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
  const [leaderboardRange, setLeaderboardRange] = useState<
    "weekly" | "monthly" | "yearly" | "all"
  >("weekly");

  const fetchGroups = async () => {
    try {
      const groups = await listGroupServices();
      setGroups(groups);
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

  const joinGroup = async (groupCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const joinedGroup = await joinGroupService(groupCode);

      const alreadyIn = groups.some((g) => g.id === joinedGroup.id);
      if (!alreadyIn) {
        setGroups([...groups, joinedGroup]);
      }

      toast({
        title: "You joined the group!",
        description: `Welcome to "${joinedGroup.name}"`,
      });
    } catch (err) {
      setError("Failed to join group");
      toast({
        variant: "destructive",
        title: "Could not join group",
        description: "Invalid code or you are already in.",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const selectGroup = async (groupId: string) => {
    try {
      setIsLoading(true);
      const detail = await getGroupDetailService(Number(groupId));

      console.log("RESPONSE DO SELECT GROUP DO CONTEXT", detail);
      setCurrentGroup({
        ...detail.group,
        members: detail.members,
      });
      setGroupLogs(detail.feed);
      setLeaderboard(detail.leaderboard);
    } catch (err) {
      setError("Failed to fetch group details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addStudyLog = async (data: {
    title: string;
    note?: string;
    studiedAt: Date;
    imageUrl?: string;
    groupIds: number[];
  }) => {
    try {
      await createStudyLogService(data);

      toast({
        title: "Study log created!",
        description: "Your study log has been added.",
      });
    } catch (err) {
      toast({
        title: "Failed to create log",
        variant: "destructive",
        description: "Something went wrong while saving your log.",
      });
      console.error(err);
    }
  };

  const fetchGroupLogs = async (groupId: string) => {
    // em breve
  };

  const fetchLeaderboard = async (
    groupId: string,
    range: "weekly" | "monthly" | "yearly" | "all" = "weekly"
  ) => {
    try {
      const response = await api.get(
        `/group/${groupId}/leaderboard?range=${range}`
      );
      setLeaderboard(response.data.leaderboard);
    } catch (err) {
      console.error("Erro ao buscar leaderboard", err);
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
        error,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
