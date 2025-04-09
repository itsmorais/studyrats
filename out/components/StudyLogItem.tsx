
import { format } from 'date-fns';
import { StudyLog } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useGroup } from '@/contexts/GroupContext';

interface StudyLogItemProps {
  log: StudyLog;
  isMine?: boolean;
  showGroup?: boolean;
}

const StudyLogItem = ({ log, isMine = false, showGroup = false }: StudyLogItemProps) => {
  const { groups } = useGroup();
  
  const groupName = showGroup ? 
    groups.find(g => g.id === log.groupId)?.name : 
    undefined;

  return (
    <Card className={`bg-studyrat-border/20 border-studyrat-border overflow-hidden ${
      isMine ? 'border-l-4 border-l-studyrat-purple' : ''
    }`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-studyrat-border flex items-center justify-center mr-3">
              {log.user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">{log.user.username}</div>
              <div className="text-xs text-studyrat-secondary">
                {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
                {groupName && (
                  <span className="ml-2 font-medium text-studyrat-purple">
                    in {groupName}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-studyrat-purple/20 text-studyrat-purple px-2 py-1 rounded">
            <Clock size={14} />
            <span className="font-semibold">{log.minutes} min</span>
          </div>
        </div>
        
        {log.note && (
          <div className="mt-4">
            <p className="text-studyrat-light">{log.note}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pb-4 pt-2 text-xs text-studyrat-secondary">
        {/* Reserved for future features like reactions */}
      </CardFooter>
    </Card>
  );
};

export default StudyLogItem;
