
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  minutes: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "Minutes must be a positive number",
  }),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface StudyLogFormProps {
  onSubmit: (minutes: number, note?: string) => void;
  onCancel: () => void;
}

const StudyLogForm = ({ onSubmit, onCancel }: StudyLogFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minutes: '',
      note: '',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(Number(data.minutes), data.note);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minutes studied</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 60"
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
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What did you study? Any insights?"
                  className="bg-studyrat-border/30 border-studyrat-border min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="border-studyrat-border"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-studyrat-purple hover:bg-studyrat-purpleLight"
          >
            Log Study Session
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudyLogForm;
