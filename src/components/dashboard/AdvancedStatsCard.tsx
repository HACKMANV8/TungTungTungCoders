import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface AdvancedStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  chartData?: Array<{ value: number }>;
  gradient?: string;
  iconBg?: string;
}

export function AdvancedStatsCard({
  title,
  value,
  icon: Icon,
  trend,
  chartData,
  gradient = "from-blue-500 to-cyan-500",
  iconBg = "bg-blue-500/10",
}: AdvancedStatsCardProps) {
  return (
    <Card className="group relative overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`${iconBg} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {value}
          </div>
          {trend && (
            <Badge
              variant={trend.positive ? "default" : "secondary"}
              className={`${
                trend.positive
                  ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                  : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
              } border-none`}
            >
              {trend.value}
            </Badge>
          )}
        </div>
        
        {chartData && chartData.length > 0 && (
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="currentColor"
                  strokeWidth={2}
                  dot={false}
                  className="text-primary"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
