import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentPlanResultProps {
  contentPlan: any;
}

export function ContentPlanResult({ contentPlan }: ContentPlanResultProps) {
  const { toast } = useToast();

  const handleSaveContentPlan = () => {
    const dataStr = JSON.stringify(contentPlan, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," +
      encodeURIComponent(dataStr);

    const exportFileDefaultName = "content-plan.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Content plan saved",
      description: "The content plan has been downloaded as JSON",
      variant: "success",
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Generated Content Plan</CardTitle>
        <CardDescription>
          Series: {contentPlan.series_concept}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Cat Personality</h3>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-md bg-muted p-3">
                <h4 className="font-medium">Traits</h4>
                <ul className="mt-1 list-disc pl-4 text-sm">
                  {contentPlan.cat_personality.traits.map(
                    (trait: string, i: number) => (
                      <li key={i}>{trait}</li>
                    )
                  )}
                </ul>
              </div>

              <div className="rounded-md bg-muted p-3">
                <h4 className="font-medium">Quirks</h4>
                <ul className="mt-1 list-disc pl-4 text-sm">
                  {contentPlan.cat_personality.quirks.map(
                    (quirk: string, i: number) => (
                      <li key={i}>{quirk}</li>
                    )
                  )}
                </ul>
              </div>

              <div className="rounded-md bg-muted p-3">
                <h4 className="font-medium">Catchphrases</h4>
                <ul className="mt-1 list-disc pl-4 text-sm">
                  {contentPlan.cat_personality.catchphrases.map(
                    (phrase: string, i: number) => (
                      <li key={i}>"{phrase}"</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Episodes</h3>
            <div className="mt-2 space-y-3">
              {contentPlan.episodes.map((episode: any, i: number) => (
                <div key={i} className="rounded-md border p-3">
                  <h4 className="font-medium">
                    {i + 1}. {episode.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {episode.premise}
                  </p>
                  <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <span className="font-medium">Setting:</span>{" "}
                      {episode.setting}
                    </div>
                    <div>
                      <span className="font-medium">Items:</span>{" "}
                      {episode.items.join(", ")}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium">Conflict:</span>{" "}
                      {episode.conflict}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium">Resolution:</span>{" "}
                      {episode.resolution}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end pt-4 px-6 pb-6 border-t">
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleSaveContentPlan}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Content Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
