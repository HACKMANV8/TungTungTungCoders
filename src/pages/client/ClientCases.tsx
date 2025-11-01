import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CaseCard } from "@/components/CaseCard";

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: "ACTIVE" | "PENDING" | "CLOSED";
  lawyer: { name: string };
  updatedAt: string;
  nextHearing?: string;
}

const ClientCases = () => {
  const { toast } = useToast();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch(`${api.baseURL}/api/cases`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCases(data.cases || []);
        } else {
          toast({ title: "Error", description: "Could not fetch cases.", variant: "destructive" });
        }
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Could not connect to the server.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, [toast]);

  const formatLastUpdated = (updatedAt: string) => {
    const date = new Date(updatedAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const formatNextHearing = (nextHearing?: string) => {
    if (!nextHearing) return undefined;
    const date = new Date(nextHearing);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole="client">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="client">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Cases</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your legal matters
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-primary">{cases.length} Cases</Badge>
            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Link to="/client/create-case">
                <Plus className="mr-2 h-4 w-4" />
                New Case
              </Link>
            </Button>
          </div>
        </div>

        {cases.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((caseItem) => (
              <CaseCard
                key={caseItem.id}
                id={caseItem.id}
                caseNumber={caseItem.caseNumber}
                title={caseItem.title}
                client={caseItem.lawyer?.name || "Pending Assignment"}
                status={caseItem.status.toLowerCase() as "active" | "pending" | "closed"}
                lastUpdated={formatLastUpdated(caseItem.updatedAt)}
                nextHearing={formatNextHearing(caseItem.nextHearing)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No cases yet</p>
              <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Link to="/client/create-case">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Case
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientCases;