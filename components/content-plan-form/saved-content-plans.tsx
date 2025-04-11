// components/saved-content-plans.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Trash2,
  Eye,
  Edit,
  Plus,
  Search,
  FolderOpen,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface ContentPlan {
  id: string;
  series_concept: string;
  cat_name: string;
  created_at: string;
  episodes: any[];
  cat_personality: {
    traits: string[];
    quirks: string[];
    catchphrases: string[];
  };
}

interface SavedContentPlansProps {
  onSelectPlan: (plan: ContentPlan) => void;
}

export default function SavedContentPlans({ onSelectPlan }: SavedContentPlansProps) {
  const [contentPlans, setContentPlans] = useState<ContentPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ContentPlan | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  // Load saved content plans from localStorage on component mount
  useEffect(() => {
    loadSavedContentPlans();
  }, []);

  const loadSavedContentPlans = () => {
    setIsLoading(true);
    try {
      // Get all keys from localStorage that start with "content-plan-"
      const planKeys = Object.keys(localStorage).filter(key => 
        key.startsWith("content-plan-")
      );
      
      // Parse each plan from localStorage
      const plans: ContentPlan[] = planKeys
        .map(key => {
          try {
            const planData = JSON.parse(localStorage.getItem(key) || "");
            return {
              ...planData,
              id: key.replace("content-plan-", ""),
              created_at: planData.created_at || new Date().toISOString()
            };
          } catch (e) {
            console.error(`Error parsing plan ${key}:`, e);
            return null;
          }
        })
        .filter(plan => plan !== null)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setContentPlans(plans as ContentPlan[]);
    } catch (error) {
      console.error("Error loading saved content plans:", error);
      toast({
        title: "Error",
        description: "Failed to load saved content plans",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = (plan: ContentPlan) => {
    setSelectedPlan(plan);
    setShowDeleteDialog(true);
  };

  const confirmDeletePlan = () => {
    if (!selectedPlan) return;
    
    try {
      localStorage.removeItem(`content-plan-${selectedPlan.id}`);
      setContentPlans(plans => plans.filter(p => p.id !== selectedPlan.id));
      
      toast({
        title: "Content plan deleted",
        description: "The content plan has been successfully deleted",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content plan",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedPlan(null);
    }
  };

  const handleSelectPlan = (plan: ContentPlan) => {
    onSelectPlan(plan);
    toast({
      title: "Content plan loaded",
      description: `"${plan.series_concept}" has been loaded successfully`,
      variant: "success",
    });
  };

  const handleImportPlan = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const planData = JSON.parse(event.target?.result as string);
          const id = `imported-${Date.now()}`;
          planData.created_at = new Date().toISOString();
          
          localStorage.setItem(`content-plan-${id}`, JSON.stringify(planData));
          loadSavedContentPlans();
          
          toast({
            title: "Content plan imported",
            description: "The content plan has been successfully imported",
            variant: "success",
          });
        } catch (error) {
          toast({
            title: "Import failed",
            description: "The selected file is not a valid content plan",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  // Filter content plans based on search query
  const filteredPlans = contentPlans.filter(plan => 
    plan.series_concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.cat_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Saved Content Plans</h2>
        <Button onClick={handleImportPlan} variant="outline" className="gap-2">
          <FolderOpen className="h-4 w-4" />
          Import Plan
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search content plans..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredPlans.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No content plans found</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              {searchQuery 
                ? "No content plans match your search query" 
                : "You haven't created any content plans yet"}
            </p>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{plan.series_concept}</CardTitle>
                    <CardDescription className="mt-1">
                      {format(new Date(plan.created_at), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {plan.episodes.length} episodes
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Cat Name:</span>
                    <span className="text-sm ml-2">{plan.cat_name}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Traits:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {plan.cat_personality.traits.slice(0, 3).map((trait, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                      {plan.cat_personality.traits.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{plan.cat_personality.traits.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-1">
                    <span className="text-sm font-medium">Episodes:</span>
                    <ScrollArea className="h-24 mt-1 rounded-md border p-2">
                      <ul className="text-sm space-y-1">
                        {plan.episodes.map((episode, i) => (
                          <li key={i} className="line-clamp-1">
                            <span className="font-medium">{i + 1}.</span> {episode.title}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  onClick={() => handleDeletePlan(plan)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedPlan?.series_concept}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeletePlan}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
