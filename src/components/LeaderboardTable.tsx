import { LeaderboardEntry } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGroup } from "../../contexts/GroupContext";

import { Award, CalendarCheck } from 'lucide-react';
interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  showMedals?: boolean;
}

const LeaderboardTable = ({ leaderboard, showMedals = false }: LeaderboardTableProps) => {
  const getMedalColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-700';
      default: return '';
    }
  };

  return (
    <Table>
      <TableHeader className="bg-studyrat-border/20">
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="text-right">Days Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboard.length > 0 ? (
          leaderboard.map((entry) => (
            <TableRow key={entry.userId} className="border-b border-studyrat-border/50">
              <TableCell className="font-medium">
                {showMedals && entry.position <= 3 ? (
                  <Award className={getMedalColor(entry.position)} size={18} />
                ) : (
                  <span>{entry.position}</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-studyrat-border flex items-center justify-center mr-3">
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{entry.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 font-medium">
                  <CalendarCheck size={14} className="text-studyrat-purple" />
                  <span>{entry.daysActive} days</span>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-6 text-studyrat-secondary">
              No leaderboard data yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default LeaderboardTable;
