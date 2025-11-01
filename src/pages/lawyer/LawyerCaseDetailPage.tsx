import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CaseDetail } from "@/components/CaseDetail";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Case } from "@/types/case";

const LawyerCaseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [caseData, setCaseData] = useState<Case | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await fetch(`${api.baseURL}/api/cases/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCaseData(data);
        } else {
          toast({ title: "Error", description: "Could not fetch case details.", variant: "destructive" });
        }
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Could not connect to the server.", variant: "destructive" });
      }
    };
    if (id) {
      fetchCase();
    }
  }, [id, toast]);

  const handleCaseUpdate = (updatedCase: Case) => {
    setCaseData(updatedCase);
  };

  return (
    <DashboardLayout userRole="lawyer">
      {caseData ? <CaseDetail caseData={caseData} userRole="lawyer" onCaseUpdate={handleCaseUpdate} /> : <p>Loading...</p>}
    </DashboardLayout>
  );
};

export default LawyerCaseDetailPage;