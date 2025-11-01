import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CaseCardProps {
  id: string;
  caseNumber: string;
  title: string;
  client: string;
  status: "active" | "pending" | "closed";
  lastUpdated: string;
  nextHearing?: string;
}

const statusConfig = {
  active: {
    color: "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20",
    gradient: "from-green-500/5 to-emerald-500/5",
  },
  pending: {
    color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20",
    gradient: "from-amber-500/5 to-orange-500/5",
  },
  closed: {
    color: "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-gray-500/20",
    gradient: "from-gray-500/5 to-slate-500/5",
  },
};

export function CaseCard({ id, caseNumber, title, client, status, lastUpdated, nextHearing }: CaseCardProps) {
  const location = useLocation();
  const isLawyer = location.pathname.startsWith("/lawyer");
  const config = statusConfig[status];

  return (
    <Card className="group relative overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
      
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="mb-2 text-xs font-mono border-primary/20">
              {caseNumber}
            </Badge>
            <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
          </div>
          <Badge className={`${config.color} border capitalize shrink-0`}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{client}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>Updated {lastUpdated}</span>
          </div>
        </div>
        
        {nextHearing && (
          <div className="rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-3 border border-blue-500/20">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-600">Next Hearing</p>
                <p className="text-sm font-semibold text-blue-700">{nextHearing}</p>
              </div>
            </div>
          </div>
        )}
        
        <Button 
          asChild 
          className="w-full group/btn bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md" 
          size="sm"
        >
          <Link to={isLawyer ? `/lawyer/cases/${id}` : `/client/cases/${id}`} className="flex items-center justify-center gap-2">
            View Details
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
