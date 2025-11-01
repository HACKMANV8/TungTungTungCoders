import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface Lawyer {
  id: string;
  name: string;
}

const CreateCase = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<string | null>(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await fetch(`${api.baseURL}/api/lawyers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLawyers(data);
        } else {
          toast({ title: "Error", description: "Could not fetch lawyers.", variant: "destructive" });
        }
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Could not connect to the server.", variant: "destructive" });
      }
    };
    fetchLawyers();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("case-title") as string;
    const description = formData.get("case-description") as string;
    const nextHearing = formData.get("next-hearing") as string;
    const caseValue = formData.get("case-value") as string;

    if (!selectedLawyer) {
      toast({ title: "Error", description: "Please select a lawyer.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const caseResponse = await fetch(`${api.baseURL}/api/cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          title, 
          description, 
          nextHearing, 
          caseValue: caseValue ? parseFloat(caseValue) : null,
          lawyer: { id: selectedLawyer } 
        }),
      });

      if (!caseResponse.ok) {
        throw new Error("Failed to create case");
      }

      toast({ title: "Success", description: "Case created successfully!" });
      navigate("/client/cases");

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to create case. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="client">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Create a New Case</h1>
        <Card>
          <CardHeader>
            <CardTitle>Case Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="case-title">Case Title</Label>
                <Input id="case-title" name="case-title" placeholder="e.g., Personal Injury Claim" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="case-description">Case Description</Label>
                <Textarea id="case-description" name="case-description" placeholder="Provide a detailed description of your case..." rows={6} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next-hearing">Next Hearing Date (Optional)</Label>
                <Input id="next-hearing" name="next-hearing" type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="case-value">Case Value (Optional)</Label>
                <Input 
                  id="case-value" 
                  name="case-value" 
                  type="number" 
                  step="0.01"
                  min="0"
                  placeholder="e.g., 5000.00" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lawyer-select">Select a Lawyer</Label>
                <Select onValueChange={setSelectedLawyer} required>
                  <SelectTrigger id="lawyer-select">
                    <SelectValue placeholder="Choose a lawyer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {lawyers.map((lawyer) => (
                      <SelectItem key={lawyer.id} value={lawyer.id}>
                        {lawyer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Case"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateCase;