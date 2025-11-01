import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CaseCard } from "@/components/CaseCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Users, DollarSign, Clock, Loader2, TrendingUp, Sparkles } from "lucide-react";
import { dashboardApi, LawyerDashboardData, activityApi, Activity } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AdvancedStatsCard } from "@/components/dashboard/AdvancedStatsCard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { CaseAnalytics } from "@/components/dashboard/CaseAnalytics";
import { QuickActions } from "@/components/dashboard/QuickActions";

const LawyerDashboard = () => {
  const [dashboardData, setDashboardData] = useState<LawyerDashboardData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardData, activitiesData] = await Promise.all([
          dashboardApi.getLawyerDashboard(),
          activityApi.getRecentActivities(),
        ]);
        setDashboardData(dashboardData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Generate sample chart data
  const generateChartData = (count: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
      value: Math.floor(Math.random() * (count * 0.5)) + (count * 0.5),
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole="lawyer">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="lawyer">
      <div className="space-y-8 pb-8">
        {/* Header with Greeting */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none">
                <Sparkles className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
            <p className="mt-2 text-muted-foreground text-lg">
              Welcome back! Here's your practice overview.
            </p>
          </div>
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AdvancedStatsCard
            title="Active Cases"
            value={dashboardData?.activeCases ?? 0}
            icon={FolderOpen}
            trend={{ value: "+12% this month", positive: true }}
            chartData={generateChartData(dashboardData?.activeCases ?? 24)}
            gradient="from-blue-500 to-cyan-500"
            iconBg="bg-blue-500/10"
          />
          <AdvancedStatsCard
            title="Total Clients"
            value={dashboardData?.totalClients ?? 0}
            icon={Users}
            trend={{ value: "+8 this month", positive: true }}
            chartData={generateChartData(dashboardData?.totalClients ?? 156)}
            gradient="from-purple-500 to-pink-500"
            iconBg="bg-purple-500/10"
          />
          <AdvancedStatsCard
            title="Monthly Revenue"
            value={dashboardData?.monthlyRevenue ? formatCurrency(dashboardData.monthlyRevenue) : "$0"}
            icon={DollarSign}
            trend={{ value: "+18% increase", positive: true }}
            chartData={generateChartData(45000)}
            gradient="from-green-500 to-emerald-500"
            iconBg="bg-green-500/10"
          />
          <AdvancedStatsCard
            title="Pending Tasks"
            value={dashboardData?.pendingTasks ?? 0}
            icon={Clock}
            trend={{ value: "Due this week", positive: true }}
            chartData={generateChartData(dashboardData?.pendingTasks ?? 8)}
            gradient="from-amber-500 to-orange-500"
            iconBg="bg-amber-500/10"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <QuickActions userRole="lawyer" />
        </div>

        {/* Analytics Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Case Analytics</h2>
          <CaseAnalytics 
            type="lawyer" 
            activeCases={dashboardData?.activeCases ?? 0}
            pendingCases={dashboardData?.pendingCases ?? 0}
            closedCases={dashboardData?.closedCases ?? 0}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Cases - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-semibold">Recent Cases</h2>
            {dashboardData?.recentCases && dashboardData.recentCases.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {dashboardData.recentCases.map((caseItem) => (
                  <CaseCard
                    key={caseItem.id}
                    id={caseItem.id}
                    caseNumber={caseItem.caseNumber}
                    title={caseItem.title}
                    client={caseItem.clientName}
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
                  <p className="text-muted-foreground">No recent cases found</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Activity Timeline - Takes 1 column */}
          <div className="lg:col-span-1">
            <ActivityTimeline activities={activities} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LawyerDashboard;
