
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import React from 'react';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const Register = () => {
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(error);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await register(data.username, data.email, data.password);
      navigate('/');
      toast({
        title: "Account created!",
        description: "Welcome to StudyRats! Your account has been successfully created.",
      });
    } catch (err) {
      setAuthError('Registration failed. Please try again.');
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please try again with different credentials.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-fit bg-studyrat-dark p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <img 
              src="/rat.png" 
              alt="StudyRat Logo" 
              className="w-20 h-w-20 animate-pulse-light" 
            />
          </div>
          <h1 className="text-3xl font-bold text-gradient">
            Join StudyRats
          </h1>
          <p className="mt-2 text-sm text-studyrat-secondary">
            Create an account to start your study journey
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-destructive/20 border border-destructive rounded-md text-destructive text-sm">
            {authError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="coolstudent"
                      autoComplete="username"
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
                      autoComplete="new-password"
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      type="password"
                      autoComplete="new-password"
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
              className="w-full bg-studyrat-purple hover:bg-studyrat-purpleLight mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-studyrat-secondary">Already have an account? </span>
              <Link to="/" className="text-studyrat-purple hover:underline">
                Sign in
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

export default Register;
