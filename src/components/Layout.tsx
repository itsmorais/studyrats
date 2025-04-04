
import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Menu, Users, Award, Home, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user && !location.pathname.includes('/auth')) {
      navigate('/auth/login');
    }
  }, [user, navigate, location]);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/groups', icon: <Users size={20} />, label: 'My Groups' },
    { path: '/logs', icon: <BookOpen size={20} />, label: 'Study Logs' },
    { path: '/leaderboard', icon: <Award size={20} />, label: 'Leaderboard' },
  ];

  if (!user) {
    return <Outlet />;
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors
              ${location.pathname === item.path
                ? 'bg-studyrat-purple/20 text-studyrat-purple'
                : 'hover:bg-studyrat-border text-studyrat-secondary hover:text-studyrat-light'
              }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="mt-auto pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-studyrat-secondary hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-studyrat-dark">
      {!isMobile && (
        <aside className="w-64 border-r border-studyrat-border p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-8 text-xl text-gradient font-bold">
            <img 
              src="/lovable-uploads/db24af37-58d1-464e-9b55-dd6fd1e367fe.png" 
              alt="StudyRat Logo" 
              className="w-12 h-12" 
            />
            <span>StudyRats</span>
          </div>
          <NavContent />
        </aside>
      )}

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {isMobile && (
          <header className="border-b border-studyrat-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xl text-gradient font-bold">
              <img 
              src="/lovable-uploads/db24af37-58d1-464e-9b55-dd6fd1e367fe.png" 
              alt="StudyRat Logo" 
              className="w-12 h-12" 
            />
                <span>StudyRats</span>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-studyrat-dark border-studyrat-border">
                  <SheetHeader className="mb-4">
                    <SheetTitle className="text-gradient flex items-center gap-2">
                    <img 
              src="/lovable-uploads/db24af37-58d1-464e-9b55-dd6fd1e367fe.png" 
              alt="StudyRat Logo" 
              className="w-12 h-12" 
            />
                      StudyRats
                    </SheetTitle>
                  </SheetHeader>
                  <div className="py-2">
                    <NavContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>
        )}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
