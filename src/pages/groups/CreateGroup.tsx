import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Info } from "lucide-react";
import { useGroup } from "../../contexts/GroupContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { uploadImageToCloudinary } from '@/services/uploadImage';


const formSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.date(),
  endDate: z.date().optional(),
  isPublic: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

const CreateGroup = () => {
  const { createGroup, isLoading } = useGroup();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      isPublic: false,
      imageSrc: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("ON SUBMIT ATIVADO",data)
    try {
      let imageUrl = "";

      if (selectedImage) {
        imageUrl = await uploadImageToCloudinary(selectedImage);
      }
      console.log("imageURL",imageUrl)
      await createGroup({
        name: data.name,
        description: data.description,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate ? data.endDate.toISOString() : undefined,
        isPublic: data.isPublic,
        imageSrc: imageUrl
      });

      toast({
        title: "Group created!",
        description: "Your study group has been created successfully.",
      });
      navigate("/groups");
    } catch (err) {
      setError("Failed to create group. Please try again.");
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: "There was an error creating your group.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Study Group</h1>
        <p className="text-studyrat-secondary text-sm mt-1">
          Set up a new study group to collaborate with others
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. ENEM Study Squad"
                    className="bg-studyrat-border/30 border-studyrat-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Group Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedImage(e.target.files[0]);
                }
              }}
              className="bg-studyrat-border/30 border-studyrat-border"
            />
          </FormItem>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the purpose and goals of your study group"
                    className="bg-studyrat-border/30 border-studyrat-border min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="pl-3 text-left font-normal bg-studyrat-border/30 border-studyrat-border"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="pl-3 text-left font-normal bg-studyrat-border/30 border-studyrat-border"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date < form.getValues("startDate")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-studyrat-border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Public Group</FormLabel>
                  <div className="flex items-center">
                    <FormDescription className="text-sm text-studyrat-secondary mr-1">
                      Allow anyone with the code to join
                    </FormDescription>
                    <Popover>
                      <PopoverTrigger>
                        <Info
                          size={14}
                          className="text-studyrat-secondary hover:text-studyrat-light cursor-help"
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2 text-sm">
                          <h4 className="font-semibold">About Public Groups</h4>
                          <p>
                            Public groups can be discovered by other students.
                            Anyone with the invite code can join.
                          </p>
                          <p>
                            Private groups are only visible to members and
                            require an invite code to join.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-studyrat-border"
              onClick={() => navigate("/groups")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-studyrat-purple hover:bg-studyrat-purpleLight"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateGroup;
