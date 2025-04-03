import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentPlanFormData } from "./types";

interface FormFieldsProps {
  formData: ContentPlanFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function FormFields({ formData, handleChange }: FormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="series_title">Series Title</Label>
        <Input
          id="series_title"
          name="series_title"
          value={formData.series_title}
          onChange={handleChange}
          placeholder="Enter series title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="episodes">Number of Episodes</Label>
        <Input
          id="episodes"
          name="episodes"
          type="number"
          min={1}
          max={10}
          value={formData.episodes}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cat_name">Cat Name</Label>
        <Input
          id="cat_name"
          name="cat_name"
          value={formData.cat_name}
          onChange={handleChange}
          placeholder="Name of the cat character"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content_style">Content Style</Label>
        <Input
          id="content_style"
          name="content_style"
          value={formData.content_style}
          onChange={handleChange}
          placeholder="e.g., humorous, family-friendly"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="setting">Setting</Label>
        <Input
          id="setting"
          name="setting"
          value={formData.setting}
          onChange={handleChange}
          placeholder="e.g., modern shopping mall, pet store"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_audience">Target Audience</Label>
        <Input
          id="target_audience"
          name="target_audience"
          value={formData.target_audience}
          onChange={handleChange}
          placeholder="e.g., families with children, cat lovers"
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="additional_characters">
          Additional Characters
        </Label>
        <Input
          id="additional_characters"
          name="additional_characters"
          value={formData.additional_characters}
          onChange={handleChange}
          placeholder="e.g., store clerks, other shoppers, a dog friend"
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="description">
          Additional Description (Optional)
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your series concept in more detail"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
