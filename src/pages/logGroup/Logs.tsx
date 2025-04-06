
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudyLogForm from "@/components/StudyLogForm";
import StudyLogItem from "@/components/StudyLogItem";
import { useGroup } from '@/contexts/GroupContext';
import { toast } from "@/hooks/use-toast";

const Logs = () => {
  const { groups, currentGroup, groupLogs, fetchGroupLogs, addStudyLog, isLoading, error } = useGroup();
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(currentGroup?.id);
  const [showForm, setShowForm] = useState(false);

  // Handle group selection
  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    fetchGroupLogs(groupId);
  };

  // Handle adding a new log
  const handleAddLog = (minutes: number, note?: string) => {
    if (!selectedGroupId) {
      toast({
        title: "Error",
        description: "Please select a group first",
        variant: "destructive",
      });
      return;
    }

    addStudyLog(selectedGroupId, minutes, note)
      .then(() => {
        setShowForm(false);
        toast({
          title: "Success",
          description: "Study log added successfully",
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Failed to add study log",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className='mb-2'>
          <h1 className="text-2xl font-bold mb-2">Study Logs</h1>
          <p className="text-studyrat-secondary">Log your study progress</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedGroupId} onValueChange={handleGroupSelect}>
            <SelectTrigger className="w-[200px] bg-studyrat-border/20">
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedGroupId && !showForm && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-studyrat-purple hover:bg-studyrat-purpleLight"
            >
              Add Study Log
            </Button>
          )}
        </div>
      </header>

      {showForm && (
        <Card className="bg-studyrat-dark border-studyrat-border">
          <CardHeader>
            <CardTitle className="text-lg">Log Study Session</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyLogForm 
              onSubmit={handleAddLog} 
              onCancel={() => setShowForm(false)} 
            />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-studyrat-purple"></div>
        </div>
      ) : error ? (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="py-6">
            <p className="text-center text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : !selectedGroupId ? (
        <Card className="bg-studyrat-border/10">
          <CardContent className="py-10 text-center">
            <p className="text-studyrat-secondary">Please select a group to view logs</p>
          </CardContent>
        </Card>
      ) : groupLogs.length === 0 ? (
        <Card className="bg-studyrat-border/10">
          <CardContent className="py-10 text-center">
            <p className="text-studyrat-secondary">No study logs found for this group</p>
            {!showForm && (
              <Button 
                onClick={() => setShowForm(true)}
                variant="outline"
                className="mt-4 border-studyrat-purple text-studyrat-purple hover:bg-studyrat-purple/20"
              >
                Add your first log
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {groupLogs.map((log) => (
            <StudyLogItem key={log.id} log={log} isMine={log.userId === '1'} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Logs;
