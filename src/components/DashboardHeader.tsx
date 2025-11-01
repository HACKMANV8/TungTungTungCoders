import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  userRole: "lawyer" | "client";
}

interface User {
  name: string;
  email: string;
  role: string;
}

interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

export function DashboardHeader({ userRole }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${api.baseURL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to cases page with search query
      const casesPath = userRole === "lawyer" ? "/lawyer/cases" : "/client/cases";
      navigate(`${casesPath}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6 shadow-sm">
      <SidebarTrigger />
      
      <div className="flex-1 flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search cases, clients, documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="p-4">
              <h4 className="font-medium leading-none">Notifications</h4>
              <div className="mt-4 space-y-2">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="text-sm">
                      <p>{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No new notifications.</p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-3 border-l pl-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
