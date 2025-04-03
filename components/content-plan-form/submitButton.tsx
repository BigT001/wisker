import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  apiConnected: boolean | null;
}

export function SubmitButton({ 
  isLoading, 
  apiConnected 
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="mt-4 gap-2 bg-primary text-white bg-black"
      disabled={isLoading || !apiConnected}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate Content Plan
        </>
      )}
    </Button>
  );
}
