import { useState } from "react";
import { Link } from "react-router-dom";
import { useGroup } from "../../contexts/GroupContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, Plus, Search, Users } from "lucide-react";

const Groups = () => {
  const { groups, isLoading } = useGroup();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">My Study Groups</h1>
          <p className="text-studyrat-secondary text-sm mt-1">
            Manage and access your study groups
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-2.5 top-2.5 text-studyrat-secondary"
            />
            <Input
              placeholder="Search groups..."
              className="pl-9 bg-studyrat-border/30 border-studyrat-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/groups/create">
            <Button className="bg-studyrat-purple hover:bg-studyrat-purpleLight whitespace-nowrap">
              <Plus size={16} className="mr-1" /> New Group
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p>Loading your study groups...</p>
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => (
            <Link key={group.id} to={`/groups/${group.id}`}>
              <Card className="bg-studyrat-border/20 border-studyrat-border hover:border-studyrat-purple transition-colors h-full">
                <img
                  src={group.imageSrc}
                  alt={group.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1">{group.name}</CardTitle>
                    {group.isPublic ? (
                      <span className="text-xs bg-green-900/30 text-green-400 py-1 px-2 rounded-full">
                        Public
                      </span>
                    ) : (
                      <span className="text-xs bg-studyrat-border/50 text-studyrat-secondary py-1 px-2 rounded-full">
                        Private
                      </span>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4 text-xs text-studyrat-secondary">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    Created: {new Date(group.startDate).toLocaleDateString()}
                  </div>

                  {group.endDate && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      End: {new Date(group.endDate).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="border-t border-studyrat-border pt-3 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs">
                    <Users size={14} className="text-studyrat-secondary" />
                    <span className="text-studyrat-secondary">Members</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-studyrat-purple font-semibold">
                      #{group.groupCode}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <p className="text-studyrat-secondary">No study groups found</p>
          <Link to="/groups/create">
            <Button className="bg-studyrat-purple hover:bg-studyrat-purpleLight">
              Create your first group
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Groups;
