import { FileText } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";

export function FormHeader() {
  return (
    <>
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <CardTitle>Content Plan</CardTitle>
      </div>
      <CardDescription>
        Create a content plan for your series
      </CardDescription>
    </>
  );
}
