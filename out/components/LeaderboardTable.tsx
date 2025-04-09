
import { LeaderboardEntry } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, Clock } from 'lucide-react';

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  showMedals?: boolean;
}

const LeaderboardTable = ({ leaderboard, showMedals = false }: LeaderboardTableProps) => {
  // Sort by total minutes (descending)
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.totalMinutes - a.totalMinutes);
  
  const getMedalColor = (position: number) => {
    switch (position) {
      case 0: return 'text-yellow-500'; // Gold
      case 1: return 'text-gray-300';   // Silver
      case 2: return 'text-amber-700';  // Bronze
      default: return '';
    }
  };
  
  return (
    <Table>
      <TableHeader className="bg-studyrat-border/20">
        <TableRow>
          <TableHead className="w-12">Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="text-right">Total Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedLeaderboard.length > 0 ? (
          sortedLeaderboard.map((entry, index) => (
            <TableRow key={entry.userId} className="border-b border-studyrat-border/50">
              <TableCell className="font-medium">
                {showMedals && index < 3 ? (
                  <Award className={`${getMedalColor(index)}`} size={18} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-studyrat-border flex items-center justify-center mr-3">
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{entry.username}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 font-medium">
                  <Clock size={14} className="text-studyrat-purple" />
                  <span>{entry.totalMinutes} min</span>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-6 text-studyrat-secondary">
              No data available yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default LeaderboardTable;
