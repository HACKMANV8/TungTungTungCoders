import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

interface Activity {
  id: string;
  type: "case_update" | "document" | "hearing" | "completed" | "alert";
  title: string;
  description: string;
  time: string;
  caseNumber?: string;
}

interface ActivityTimelineProps {
  activities?: Activity[];
}

const activityConfig = {
  case_update: {
    icon: FileText,
    color: "bg-blue-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600",
  },
  document: {
    icon: FileText,
    color: "bg-purple-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-600",
  },
  hearing: {
    icon: Calendar,
    color: "bg-amber-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
  },
  completed: {
    icon: CheckCircle2,
    color: "bg-green-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600",
  },
  alert: {
    icon: AlertCircle,
    color: "bg-red-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-600",
  },
};

export function ActivityTimeline({ activities = [] }: ActivityTimelineProps) {
  // Default activities if none provided
  const defaultActivities: Activity[] = [
    {
      id: "1",
      type: "case_update",
      title: "Case Updated",
      description: "New evidence submitted for review",
      time: "2 hours ago",
      caseNumber: "CS-2025-001",
    },
    {
      id: "2",
      type: "hearing",
      title: "Upcoming Hearing",
      description: "Court hearing scheduled",
      time: "Tomorrow, 10:00 AM",
      caseNumber: "CS-2025-003",
    },
    {
      id: "3",
      type: "document",
      title: "Document Uploaded",
      description: "Contract review completed",
      time: "Yesterday",
      caseNumber: "CS-2025-002",
    },
    {
      id: "4",
      type: "completed",
      title: "Case Closed",
      description: "Settlement reached successfully",
      time: "3 days ago",
      caseNumber: "CS-2024-145",
    },
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <Card className="shadow-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayActivities.map((activity, index) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <div key={activity.id} className="flex gap-4 relative group">
                {/* Connector Line */}
                {index < displayActivities.length - 1 && (
                  <div className="absolute left-5 top-10 h-full w-0.5 bg-border" />
                )}

                {/* Icon */}
                <div className={`relative flex-shrink-0 ${config.bgColor} p-2 rounded-lg h-fit group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${config.textColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      {activity.caseNumber && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {activity.caseNumber}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
