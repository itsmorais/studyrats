
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Plus, Users } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { groups, fetchGroups, isLoading } = useGroup();

  console.log(groups)
  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  return (
    <div className="space-y-3 min-h-screen">
      <div className="flex items-center">
 
        <Link to="/logs">
          <Button
            className="fixed bottom-6 right-6 z-50 bg-studyrat-purple hover:bg-studyrat-purpleLight text-white text-lg px-6 py-4 rounded-full shadow-lg"
            size='icon'
          >
            <Plus size={28} />
          </Button>
        </Link>
      </div>


      {groups.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Study Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.slice(0, 2).map((group) => (
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
                    <span className="text-studyrat-secondary">
                      {group._count?.memberships} member
                      {group._count?.memberships !== 1 ? "s" : ""}
                    </span>
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
          {groups.length > 2 && (
            <div className="mt-4 text-center">
              <Link to="/groups">
                <Button variant="link" className="text-studyrat-purple">View all {groups.length} groups</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <Card className="bg-studyrat-border/20 border-studyrat-border">
          <CardHeader>
            <CardTitle className="text-lg">Join a Study Group</CardTitle>
            <CardDescription>Enter an invite code to join an existing group</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/groups/join">
              <Button variant="outline" className="w-full border-studyrat-border">
                Enter Invite Code
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>



    </div>
  );
};

export default Home;
