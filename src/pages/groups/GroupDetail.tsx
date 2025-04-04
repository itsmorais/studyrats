
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroup } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, BookOpen, Clock, Copy, Share2, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { StudyLog } from '@/types';
import StudyLogForm from '@/components/StudyLogForm';
import StudyLogItem from '@/components/StudyLogItem';
import LeaderboardTable from '@/components/LeaderboardTable';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    groups, 
    currentGroup, 
    selectGroup, 
    groupLogs,
    leaderboard,
    addStudyLog, 
    fetchGroupLogs,
    fetchLeaderboard,
    isLoading 
  } = useGroup();
  const [showStudyForm, setShowStudyForm] = useState(false);
  const [userLogs, setUserLogs] = useState<StudyLog[]>([]);

  useEffect(() => {
    if (id && groups.length > 0) {
      selectGroup(id);
    } else if (groups.length === 0) {
      navigate('/groups');
    }
  }, [id, groups, selectGroup, navigate]);

  useEffect(() => {
    if (currentGroup && user) {
      // Filter logs for the current user
      const filteredLogs = groupLogs.filter(log => log.userId === user.id);
      setUserLogs(filteredLogs);
    }
  }, [groupLogs, currentGroup, user]);

  const handleAddLog = async (minutes: number, note?: string) => {
    if (currentGroup) {
      await addStudyLog(currentGroup.id, minutes, note);
      setShowStudyForm(false);
      toast({
        title: "Study session logged!",
        description: `You've logged ${minutes} minutes of studying.`,
      });
    }
  };

  const copyInviteCode = () => {
    if (currentGroup) {
      navigator.clipboard.writeText(currentGroup.inviteCode);
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard.",
      });
    }
  };

  if (isLoading || !currentGroup) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading study group...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{currentGroup.name}</h1>
          <p className="text-studyrat-secondary text-sm mt-1 flex items-center gap-2">
            <Clock size={14} /> 
            {new Date(currentGroup.startDate).toLocaleDateString()}
            {currentGroup.endDate && ` - ${new Date(currentGroup.endDate).toLocaleDateString()}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center px-3 py-1.5 rounded-md bg-studyrat-border/30 text-sm">
            <span className="text-studyrat-secondary mr-2">Code:</span>
            <span className="text-studyrat-purple font-semibold">{currentGroup.inviteCode}</span>
            <Button variant="ghost" size="icon" className="ml-1 h-6 w-6" onClick={copyInviteCode}>
              <Copy size={14} />
            </Button>
          </div>
          <Button variant="outline" size="icon" className="border-studyrat-border">
            <Share2 size={16} />
          </Button>
          <Button className="bg-studyrat-purple hover:bg-studyrat-purpleLight" onClick={() => setShowStudyForm(true)}>
            Log Study Session
          </Button>
        </div>
      </div>

      {showStudyForm && (
        <Card className="bg-studyrat-border/20 border-studyrat-border mb-6">
          <CardContent className="pt-6">
            <StudyLogForm onSubmit={handleAddLog} onCancel={() => setShowStudyForm(false)} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="feed">
        <TabsList className="bg-studyrat-border/20">
          <TabsTrigger value="feed" className="data-[state=active]:bg-studyrat-purple/20 data-[state=active]:text-studyrat-purple">
            <BookOpen size={16} className="mr-1" /> Group Feed
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-studyrat-purple/20 data-[state=active]:text-studyrat-purple">
            <Award size={16} className="mr-1" /> Leaderboard
          </TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:bg-studyrat-purple/20 data-[state=active]:text-studyrat-purple">
            <Users size={16} className="mr-1" /> Members
          </TabsTrigger>
          <TabsTrigger value="my-logs" className="data-[state=active]:bg-studyrat-purple/20 data-[state=active]:text-studyrat-purple">
            <Clock size={16} className="mr-1" /> My Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6">
          {groupLogs.length > 0 ? (
            <div className="space-y-4">
              {groupLogs.map((log) => (
                <StudyLogItem key={log.id} log={log} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-studyrat-secondary">No study logs yet</p>
              <Button 
                variant="link" 
                className="text-studyrat-purple mt-2"
                onClick={() => setShowStudyForm(true)}
              >
                Add the first study log
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <LeaderboardTable leaderboard={leaderboard} />
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <div className="text-center py-12">
            <p className="text-studyrat-secondary">Member list will be implemented soon</p>
          </div>
        </TabsContent>

        <TabsContent value="my-logs" className="mt-6">
          {userLogs.length > 0 ? (
            <div className="space-y-4">
              {userLogs.map((log) => (
                <StudyLogItem key={log.id} log={log} isMine={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-studyrat-secondary">You haven't logged any study sessions yet</p>
              <Button 
                variant="link" 
                className="text-studyrat-purple mt-2"
                onClick={() => setShowStudyForm(true)}
              >
                Log your first study session
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetail;
