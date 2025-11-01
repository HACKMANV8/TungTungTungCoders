import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveNebulaShader } from "@/components/ui/liquid-shader";
import { Scale, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [defaultTab, setDefaultTab] = useState("login");
  const [defaultRole, setDefaultRole] = useState("LAWYER");

  useEffect(() => {
    const tab = searchParams.get("tab");
    const role = searchParams.get("role");
    
    if (tab === "signup") {
      setDefaultTab("signup");
    }
    if (role === "client") {
      setDefaultRole("CLIENT");
    } else if (role === "lawyer") {
      setDefaultRole("LAWYER");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch(`${api.baseURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast({
          title: "Login successful!",
          description: "Redirecting to your dashboard...",
        });
        navigate(data.user.role === "lawyer" ? "/lawyer/dashboard" : "/client/dashboard");
      } else {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.message || "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "An Error Occurred",
        description: "Could not connect to the server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;
    const role = formData.get("role") as string;

    try {
      const response = await fetch(`${api.baseURL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast({
          title: "Account Created!",
          description: "Redirecting to your dashboard...",
        });
        navigate(role.toLowerCase() === "lawyer" ? "/lawyer/dashboard" : "/client/dashboard");
      } else {
        const errorData = await response.json();
        toast({
          title: "Registration Failed",
          description: errorData.message || "Please check your details and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "An Error Occurred",
        description: "Could not connect to the server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Nebula Background */}
      <InteractiveNebulaShader disableCenterDimming={true} />
      
      {/* Back to Home Button */}
      <Button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 bg-black/50 hover:bg-black/70 text-cyan-300 border border-cyan-500/30 backdrop-blur-md"
        variant="ghost"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      {/* Auth Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-xl bg-black/70 border-cyan-500/30">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/50">
            <Scale className="h-9 w-9 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">LawLynk</CardTitle>
          <CardDescription className="text-cyan-100/70 text-base">Sign in to manage your cases</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={defaultTab} onValueChange={setDefaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-cyan-500/20">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/50"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/50"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-cyan-300 font-medium">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="lawyer@example.com" 
                    required 
                    className="bg-black/50 border-cyan-500/30 text-white placeholder:text-cyan-100/30 focus:border-cyan-400 focus:ring-cyan-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-cyan-300 font-medium">Password</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    className="bg-black/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-cyan-300 font-medium">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    required 
                    className="bg-black/50 border-cyan-500/30 text-white placeholder:text-cyan-100/30 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-cyan-300 font-medium">Email</Label>
                  <Input 
                    id="signup-email" 
                    name="signup-email" 
                    type="email" 
                    placeholder="lawyer@example.com" 
                    required 
                    className="bg-black/50 border-cyan-500/30 text-white placeholder:text-cyan-100/30 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-cyan-300 font-medium">Password</Label>
                  <Input 
                    id="signup-password" 
                    name="signup-password" 
                    type="password" 
                    required 
                    className="bg-black/50 border-cyan-500/30 text-white focus:border-amber-400 focus:ring-amber-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-cyan-300 font-medium">I am a</Label>
                  <select 
                    id="role" 
                    name="role" 
                    defaultValue={defaultRole}
                    className="flex h-10 w-full rounded-md border border-cyan-500/30 bg-black/50 text-white px-3 py-2 text-sm focus:border-amber-400 focus:ring-amber-400/20 focus:outline-none"
                  >
                    <option value="LAWYER" className="bg-black">Lawyer</option>
                    <option value="CLIENT" className="bg-black">Client</option>
                  </select>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Auth;