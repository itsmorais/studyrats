
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, User } from '../types';
import authService from '../services/authService';
import registerService from '../services/registerService';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { },
  register: async () => { },
  logout: () => { },
  isLoading: false,
  error: null,
});

export const useAuth = () => useContext(AuthContext);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();


  useEffect(() => {
    const savedUser = localStorage.getItem('studyrat_user');
    const savedToken = localStorage.getItem('studyrat_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }


    setIsLoading(false);
  }, []);



  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService(email, password)

      if (response.status === 201) {
        const { user, token } = response.data

        setUser(user);
        localStorage.setItem('studyrat_user', JSON.stringify(user));
        localStorage.setItem('studyrat_token', (token));
        navigate("/");

      }

    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });

      console.error(err);
    } finally {
      setIsLoading(false);

    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const registerNewUser = await registerService(username, email, password);


      if (registerNewUser.status === 201) {
        toast({
          title: "Account created!",
          description: "Welcome to StudyRats! Your account has been successfully created.",
        });

        await login(email, password);

      }

    } catch (err: any) {
      const error = err?.response?.data?.message
      toast({
        variant: "destructive",
        title: "Register failed",
        description: `${error}, Please try again.`,
      });

      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studyrat_user');
    localStorage.removeItem('studyrat_token');
  }




  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
