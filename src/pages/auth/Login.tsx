
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Coffee } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(error);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setAuthError('Login failed. Please check your credentials.');
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-studyrat-dark p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Coffee size={40} className="text-studyrat-purple animate-pulse-light" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">
            Welcome to StudyRats
          </h1>
          <p className="mt-2 text-sm text-studyrat-secondary">
            Sign in to continue your study journey
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-destructive/20 border border-destructive rounded-md text-destructive text-sm">
            {authError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      autoComplete="email"
                      className="bg-studyrat-border/30 border-studyrat-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      type="password"
                      autoComplete="current-password"
                      className="bg-studyrat-border/30 border-studyrat-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-studyrat-purple hover:bg-studyrat-purpleLight"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-studyrat-secondary">Don't have an account? </span>
              <Link to="/auth/register" className="text-studyrat-purple hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </Form>

        <div className="mt-8 pt-6 border-t border-studyrat-border text-center text-xs text-studyrat-secondary">
          <p>powered by caffeine ☕</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
