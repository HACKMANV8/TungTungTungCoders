import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, Users, Upload, MessageSquare, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  userRole: "lawyer" | "client";
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const navigate = useNavigate();

  const lawyerActions = [
    {
      icon: FolderOpen,
      label: "View Cases",
      description: "See all your cases",
      gradient: "from-blue-500 to-cyan-500",
      onClick: () => navigate("/lawyer/cases"),
    },
    {
      icon: Users,
      label: "View Clients",
      description: "Manage your clients",
      gradient: "from-purple-500 to-pink-500",
      onClick: () => navigate("/lawyer/clients"),
    },
    {
      icon: FileText,
      label: "Documents",
      description: "Access documents",
      gradient: "from-amber-500 to-orange-500",
      onClick: () => navigate("/lawyer/documents"),
    },
    {
      icon: Calendar,
      label: "Settings",
      description: "Account settings",
      gradient: "from-green-500 to-emerald-500",
      onClick: () => navigate("/lawyer/settings"),
    },
  ];

  const clientActions = [
    {
      icon: Plus,
      label: "New Case Request",
      description: "Submit a new case",
      gradient: "from-blue-500 to-cyan-500",
      onClick: () => navigate("/client/create-case"),
    },
    {
      icon: FolderOpen,
      label: "My Cases",
      description: "View your cases",
      gradient: "from-purple-500 to-pink-500",
      onClick: () => navigate("/client/cases"),
    },
    {
      icon: FileText,
      label: "Documents",
      description: "Access documents",
      gradient: "from-amber-500 to-orange-500",
      onClick: () => navigate("/client/documents"),
    },
    {
      icon: Calendar,
      label: "Settings",
      description: "Account settings",
      gradient: "from-green-500 to-emerald-500",
      onClick: () => navigate("/client/settings"),
    },
  ];

  const actions = userRole === "lawyer" ? lawyerActions : clientActions;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Card
            key={index}
            className="group relative overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={action.onClick}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <CardContent className="relative p-6">
              <div className="flex flex-col items-start gap-3">
                <div className={`bg-gradient-to-br ${action.gradient} p-3 rounded-xl text-white group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{action.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
