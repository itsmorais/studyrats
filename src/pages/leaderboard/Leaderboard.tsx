
import { useEffect, useState } from 'react';
import { useGroup } from '../../contexts/GroupContext';
import { Card } from '@/components/ui/card';
import { Award, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LeaderboardTable from '@/components/LeaderboardTable';

const Leaderboard = () => {
  const { groups, leaderboard, fetchLeaderboard } = useGroup();
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    // Set default group when groups are loaded
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0].id);
    }
  }, [groups]);

  useEffect(() => {
    if (selectedGroup) {
      fetchLeaderboard(selectedGroup);
    }
  }, [selectedGroup]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <Award size={24} className="mr-3 text-studyrat-purple" />
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-studyrat-secondary text-sm mt-1">See who's putting in the work</p>
          </div>
        </div>
        <div className="flex items-center">
          <Filter size={16} className="mr-2 text-studyrat-secondary" />
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[180px] bg-studyrat-border/30 border-studyrat-border">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map(group => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-studyrat-border/20 border-studyrat-border p-6">
        {selectedGroup ? (
          <LeaderboardTable 
            leaderboard={leaderboard}
            showMedals={true}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-studyrat-secondary">Select a group to view its leaderboard</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Leaderboard;
