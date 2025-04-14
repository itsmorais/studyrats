import { useGroup } from "@/contexts/GroupContext";

const GroupMemberList = () => {
  const { currentGroup } = useGroup();

  console.log("DENTRO DO MEMBLIST",currentGroup)

  if (!currentGroup?.members || currentGroup.members.length === 0) {
    return (
      <div className="text-center py-12 text-studyrat-secondary">
        No members in this group yet.
      </div>
    );
  }


  return (
    <ul className="space-y-4">
      {currentGroup.members.map((member) => (
        <li key={member.id} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-studyrat-border flex items-center justify-center font-semibold text-studyrat-purple">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">
            {member.name}
            {member.id === currentGroup.owner?.id && (
              <span className="ml-2 text-xs text-studyrat-secondary">(Admin)</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default GroupMemberList;
