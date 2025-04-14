import { format } from "date-fns";
import { StudyLog } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useGroup } from "@/contexts/GroupContext";

interface StudyLogItemProps {
  log: StudyLog;
  isMine?: boolean;
  showGroup?: boolean;
}

const StudyLogItem = ({
  log,
  isMine = false,
  showGroup = false,
}: StudyLogItemProps) => {
  const { groups } = useGroup();

  const groupName = showGroup
    ? groups.find((g) => g.id === log.groupId)?.name
    : undefined;

  return (
    <Card
      className={`bg-studyrat-border/20 border-studyrat-border overflow-hidden ${
        isMine ? "border-l-4 border-l-studyrat-purple" : ""
      }`}
    >
      <CardContent
        className="p-4"
        onClick={() => console.log("TESTE DETALHE DO LOG", log.id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-studyrat-border mr-3">
              <img
                src={log.imageUrl}
                alt="Log image"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="font-semibold">{log.title}</div>
              <div className="text-xs text-studyrat-secondary">
                {log.note || ""}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pb-4 pt-2 text-xs text-studyrat-secondary">
        <div className="flex items-center w-full">
          <div className="w-4 h-4 object-cover rounded-full bg-studyrat-border flex items-center justify-center mr-3">
            <img
              src={log.user.avatarUrl}
              className="w-full  object-cover rounded-full"
            />{" "}
          </div>
          <div className="flex justify-between w-full">
            <div className="font-bold">{log.user.name}</div>
            {format(new Date(log.studiedAt), "MMM d, yyyy 'at' h:mm a")}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StudyLogItem;
