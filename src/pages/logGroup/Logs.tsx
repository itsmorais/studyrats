import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useGroup } from "@/contexts/GroupContext";
import { uploadImageToCloudinary } from "@/services/uploadImage";
import SelectGroups from "../../components/SelectGroups";

interface StudyLogFormProps {
  onSubmit: (data: {
    title: string;
    note?: string;
    imageUrl?: string;
    studiedAt: Date;
    groupIds: number[];
  }) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  title: z.string().min(3),
  note: z.string().optional(),
  studiedAt: z.date(),
  groupIds: z.array(z.number()).min(1),
  image: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

const StudyLogForm = ({ onSubmit, onCancel }: StudyLogFormProps) => {
  const { groups, addStudyLog } = useGroup();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studiedAt: new Date(),
      groupIds: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      let imageUrl: string | undefined;

      if (data.image instanceof File) {
        setIsUploading(true);
        imageUrl = await uploadImageToCloudinary(data.image);
      }

      await addStudyLog({
        title: data.title,
        note: data.note,
        studiedAt: data.studiedAt,
        groupIds: data.groupIds,
        imageUrl,
      });

      navigate("/groups");
    } finally {
      setIsUploading(false);
    }
  };

  const groupOptions = [
    { value: "SELECT_ALL", label: "Select All" },
    ...groups.map((group) => ({
      value: group.id,
      label: group.name,
    })),
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Title</label>
        <Input
          {...register("title")}
          placeholder="Ex: Revisão de Geografia"
          className="bg-studyrat-border/30 border-studyrat-border"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Note (optional)</label>
        <Textarea
          {...register("note")}
          placeholder="Anotações do seu estudo..."
          className="bg-studyrat-border/30 border-studyrat-border"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Date of Study</label>
        <Controller
          control={control}
          name="studiedAt"
          render={({ field }) => (
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="pl-3 text-left font-normal w-full bg-studyrat-border/30 border-studyrat-border"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(date);
                      setCalendarOpen(false); // fecha ao selecionar
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Groups</label>
        <Controller
          name="groupIds"
          control={control}
          render={({ field }) => (
            <Select
              isMulti
              options={groupOptions}
              value={groupOptions.filter((opt) =>
                field.value?.includes(opt.value)
              )}
              onChange={(selectedOptions) => {
                const hasSelectAll = selectedOptions.some(
                  (opt) => opt.value === "SELECT_ALL"
                );

                if (hasSelectAll) {
                  // Seleciona todos os grupos reais (ignorando o SELECT_ALL)
                  field.onChange(groups.map((g) => g.id));
                } else {
                  field.onChange(selectedOptions.map((opt) => opt.value));
                }
              }}
              placeholder="Select one or more groups"
              classNames={{
                control: () => "text-white",
                multiValue: () => "bg-studyrat-purple/30 text-studyrat-purple",
                option: ({ isFocused }) =>
                  isFocused
                    ? "bg-studyrat-purple/20 text-white"
                    : "bg-studyrat-dark text-studyrat-secondary",
                menu: () => "bg-studyrat-dark border-studyrat-border mt-1",
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "transparent",
                  borderRadius: 6,
                  borderColor: "#3A3A3C",
                  color: "#F2F2F7",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1C1C1E",
                  borderRadius: 6,
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#646cffaa",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "#ddd",
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? "#A259FF33" : "#1C1C1E",
                  color: isFocused ? "#FFFFFF" : "#D1D1D6",
                  cursor: "pointer",

                  // ⚡️ Impede o flash branco ao clicar
                  ":active": {
                    backgroundColor: "#A259FF33",
                  },
                }),
              }}
            />
          )}
        />

        {errors.groupIds && (
          <p className="text-red-500 text-sm mt-1">{errors.groupIds.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1 ">
          Attach Image (optional)
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="bg-studyrat-border/30 border-studyrat-border"
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mt-2 max-h-40 rounded-lg border bg-studyrat-border/30 border-studyrat-border"
          />
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default StudyLogForm;
