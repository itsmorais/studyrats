
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Plus, Users, BookOpen, Award } from 'lucide-react';

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
            {groups.slice(0, 4).map((group) => (
              <Link key={group.id} to={`/groups/${group.id}`}>
                <Card className="bg-studyrat-border/20 border-studyrat-border hover:border-studyrat-purple transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{group.name}</span>
                      {group.isPublic ?
                        <span className="text-xs bg-green-900/30 text-green-400 py-1 px-2 rounded-full">Public</span> :
                        <span className="text-xs bg-studyrat-border/50 text-studyrat-secondary py-1 px-2 rounded-full">Private</span>
                      }
                    </CardTitle>
                    <CardDescription className="line-clamp-1">{group.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="text-xs text-studyrat-secondary flex items-center gap-2">
                    <Clock size={12} />
                    {new Date(group.startDate).toLocaleDateString()}
                    {group.endDate && ` - ${new Date(group.endDate).toLocaleDateString()}`}
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          {groups.length > 4 && (
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
