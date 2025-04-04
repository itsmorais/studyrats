
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

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>
          <p className="text-studyrat-secondary text-sm mt-1">Track your study sessions and stay motivated</p>
        </div>
        <Link to="/groups/create">
          <Button className="bg-studyrat-purple hover:bg-studyrat-purpleLight">
            <Plus size={16} className="mr-1" /> Create Group
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-studyrat-border/20 border-studyrat-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="mr-2 text-studyrat-purple" size={18} />
              My Groups
            </CardTitle>
            <CardDescription>{groups.length} active groups</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-studyrat-light">{isLoading ? 'Loading...' : (groups.length ? 'You are part of active study groups' : 'No study groups yet')}</p>
          </CardContent>
          <CardFooter>
            <Link to="/groups">
              <Button variant="outline" className="border-studyrat-border">View all groups</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="bg-studyrat-border/20 border-studyrat-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 text-studyrat-purple" size={18} />
              Study Logs
            </CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-studyrat-light">Log your study sessions to keep track of your progress</p>
          </CardContent>
          <CardFooter>
            <Link to="/logs">
              <Button variant="outline" className="border-studyrat-border">View logs</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="bg-studyrat-border/20 border-studyrat-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Award className="mr-2 text-studyrat-purple" size={18} />
              Leaderboards
            </CardTitle>
            <CardDescription>See who's putting in the hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-studyrat-light">Compare your progress with other students</p>
          </CardContent>
          <CardFooter>
            <Link to="/leaderboard">
              <Button variant="outline" className="border-studyrat-border">View leaderboards</Button>
            </Link>
          </CardFooter>
        </Card>
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
    </div>
  );
};

export default Home;
