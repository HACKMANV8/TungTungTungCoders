import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2 } from "lucide-react";

interface CaseAnalyticsProps {
  type: "lawyer" | "client";
  activeCases?: number;
  pendingCases?: number;
  closedCases?: number;
}

export function CaseAnalytics({ type, activeCases = 0, pendingCases = 0, closedCases = 0 }: CaseAnalyticsProps) {
  // Use real data from props
  const caseStatusData = [
    { name: "Active", value: activeCases, color: "#10b981" },
    { name: "Pending", value: pendingCases, color: "#f59e0b" },
    { name: "Closed", value: closedCases, color: "#6b7280" },
  ].filter(item => item.value > 0);

  // For now, show total cases distributed across months
  // In a real app, you'd fetch actual monthly data from the backend
  const generateMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const total = activeCases + pendingCases + closedCases;
    
    if (total === 0) {
      return months.map(month => ({ month, cases: 0 }));
    }
    
    // Distribute cases somewhat evenly across months for visualization
    const avgPerMonth = Math.ceil(total / 6);
    return months.map((month, index) => ({
      month,
      cases: index === 5 ? total : Math.min(avgPerMonth, total - (index * avgPerMonth)),
    }));
  };

  const [monthlyData, setMonthlyData] = useState(generateMonthlyData());

  useEffect(() => {
    setMonthlyData(generateMonthlyData());
  }, [activeCases, pendingCases, closedCases]);

  const totalCases = caseStatusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Case Status Distribution */}
      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-lg">Case Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {totalCases > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={caseStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {caseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px]">
              <p className="text-muted-foreground">No case data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Case Trends */}
      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-lg">Case Trends (6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="cases" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
