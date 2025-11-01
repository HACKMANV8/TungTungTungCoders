import { Button } from "@/components/ui/button";
import { InteractiveNebulaShader } from "@/components/ui/liquid-shader";
import { Scale, Shield, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Interactive Nebula Background */}
      <InteractiveNebulaShader disableCenterDimming={true} />

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto flex items-center justify-between px-6 py-6 backdrop-blur-md bg-black/40 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/50">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">LawLynk</span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate("/auth?role=lawyer")} variant="outline" className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400">
            Lawyer Login
          </Button>
          <Button onClick={() => navigate("/auth?role=client")} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/30">
            Client Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl backdrop-blur-xl bg-black/60 rounded-3xl p-12 shadow-2xl border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 pointer-events-none" />
          <div className="relative">
          <h1 className="text-5xl font-black leading-tight lg:text-7xl">
            <span className="text-white">Modern Case Management for</span>
            <span className="block mt-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg"> Legal Professionals</span>
          </h1>
          <p className="mt-8 text-xl text-cyan-100/80 leading-relaxed">
            Streamline your practice with intelligent case tracking, client communication, and document management all in one place.
          </p>
          <div className="mt-12 space-y-6">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={() => navigate("/auth?role=lawyer&tab=signup")} className="text-lg px-10 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-2xl shadow-cyan-500/50 font-bold">
                Register as Lawyer
              </Button>
              <Button size="lg" onClick={() => navigate("/auth?role=client&tab=signup")} className="text-lg px-10 py-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-2xl shadow-amber-500/50 font-bold">
                Register as Client
              </Button>
            </div>
            <Button size="lg" className="text-lg px-10 py-6 bg-transparent hover:bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400/50 hover:border-cyan-400 backdrop-blur-sm shadow-lg shadow-cyan-500/20">
              Watch Demo
            </Button>
          </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Powerful Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl backdrop-blur-lg bg-black/50 border border-cyan-500/30 p-6 shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105 hover:border-cyan-400/50 group">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-400/70 transition-all">
              <Scale className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-cyan-300">Case Management</h3>
            <p className="mt-3 text-sm text-cyan-100/70 leading-relaxed">
              Organize and track all your cases with powerful filtering and search capabilities.
            </p>
          </div>

          <div className="rounded-xl backdrop-blur-lg bg-black/50 border border-amber-500/30 p-6 shadow-lg hover:shadow-amber-500/30 transition-all hover:scale-105 hover:border-amber-400/50 group">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/50 group-hover:shadow-amber-400/70 transition-all">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-amber-300">Client Portal</h3>
            <p className="mt-3 text-sm text-cyan-100/70 leading-relaxed">
              Give clients secure access to their case information and documents.
            </p>
          </div>

          <div className="rounded-xl backdrop-blur-lg bg-black/50 border border-blue-500/30 p-6 shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105 hover:border-blue-400/50 group">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/50 group-hover:shadow-blue-400/70 transition-all">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-blue-300">Secure & Compliant</h3>
            <p className="mt-3 text-sm text-cyan-100/70 leading-relaxed">
              Bank-level encryption and compliance with legal industry standards.
            </p>
          </div>

          <div className="rounded-xl backdrop-blur-lg bg-black/50 border border-violet-500/30 p-6 shadow-lg hover:shadow-violet-500/30 transition-all hover:scale-105 hover:border-violet-400/50 group">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 shadow-lg shadow-violet-500/50 group-hover:shadow-violet-400/70 transition-all">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-violet-300">Automated Workflows</h3>
            <p className="mt-3 text-sm text-cyan-100/70 leading-relaxed">
              Automate routine tasks and focus on what matters most.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/90 via-orange-500/90 to-amber-600/90 backdrop-blur-xl p-16 text-center shadow-2xl border border-amber-400/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          <div className="relative">
          <h2 className="text-4xl font-black lg:text-5xl text-white drop-shadow-lg">Ready to Transform Your Practice?</h2>
          <p className="mt-6 text-xl text-white/90 font-medium">
            Join hundreds of legal professionals already using LawLynk
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="text-lg px-12 py-6 bg-white hover:bg-cyan-50 text-cyan-600 font-bold border-0 shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all" onClick={() => navigate("/auth?role=lawyer&tab=signup")}>
              Start as Lawyer
            </Button>
            <Button size="lg" className="text-lg px-12 py-6 bg-white hover:bg-cyan-50 text-orange-600 font-bold border-0 shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all" onClick={() => navigate("/auth?role=client&tab=signup")}>
              Start as Client
            </Button>
          </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 py-8 backdrop-blur-md bg-black/40">
        <div className="container mx-auto px-6 text-center text-sm text-cyan-300/60">
          <p>© 2025 LawLynk. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Index;
