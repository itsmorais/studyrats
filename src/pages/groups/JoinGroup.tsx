
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGroup } from '../../contexts/GroupContext';
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
import { UsersRound } from 'lucide-react';

const formSchema = z.object({
  inviteCode: z.string().min(1, 'Invite code is required'),
});

type FormData = z.infer<typeof formSchema>;

const JoinGroup = () => {
  const { joinGroup, isLoading, error: groupError } = useGroup();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(groupError);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteCode: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await joinGroup(data.inviteCode);
      
      // Check if there was an error during the join process
      if (groupError) {
        setError(groupError);
      } else {
        toast({
          title: "Success!",
          description: "You've joined the study group.",
        });
        navigate('/groups');
      }
    } catch (err) {
      setError('Failed to join group. Please check the invite code and try again.');
      toast({
        variant: "destructive",
        title: "Join failed",
        description: "Failed to join the study group. Please check the invite code.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-studyrat-purple/20 p-3 rounded-full">
            <UsersRound size={28} className="text-studyrat-purple" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Join a Study Group</h1>
        <p className="text-studyrat-secondary text-sm mt-1">
          Enter the invite code provided by the group creator
        </p>
      </div>

      {error && (
        <div className="p-3 mb-6 bg-destructive/20 border border-destructive rounded-md text-destructive text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="inviteCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. ABC123"
                    className="bg-studyrat-border/30 border-studyrat-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-studyrat-border"
              onClick={() => navigate('/groups')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-studyrat-purple hover:bg-studyrat-purpleLight"
              disabled={isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Group'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default JoinGroup;
