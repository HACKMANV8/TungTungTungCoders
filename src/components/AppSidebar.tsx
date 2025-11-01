import { Scale, LayoutDashboard, FolderOpen, FileText, Users, Settings, LogOut } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface AppSidebarProps {
  userRole: "lawyer" | "client";
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    navigate("/");
  };

  const lawyerItems = [
    { title: "Dashboard", url: "/lawyer/dashboard", icon: LayoutDashboard },
    { title: "Cases", url: "/lawyer/cases", icon: FolderOpen },
    { title: "Clients", url: "/lawyer/clients", icon: Users },
    { title: "Documents", url: "/lawyer/documents", icon: FileText },
    { title: "Settings", url: "/lawyer/settings", icon: Settings },
  ];

  const clientItems = [
    { title: "Dashboard", url: "/client/dashboard", icon: LayoutDashboard },
    { title: "My Cases", url: "/client/cases", icon: FolderOpen },
    { title: "Documents", url: "/client/documents", icon: FileText },
    { title: "Settings", url: "/client/settings", icon: Settings },
  ];

  const items = userRole === "lawyer" ? lawyerItems : clientItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">LawLynk</h2>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
