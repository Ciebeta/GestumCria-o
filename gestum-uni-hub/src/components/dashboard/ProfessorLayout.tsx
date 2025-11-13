import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MessageSquare,
  Lightbulb,
  Shield,
  LogOut,
  Menu,
  Users,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarioView } from "./professor/CalendarioView";
import { FeedbacksView } from "./professor/FeedbacksView";
import { PropostasView } from "./professor/PropostasView";
import { DenunciasView } from "./professor/DenunciasView";
import { AjudaEstudosView } from "./aluno/AjudaEstudosView";

interface ProfessorLayoutProps {
  profile: any;
}

type TabType = "calendario" | "feedbacks" | "propostas" | "denuncias" | "ajuda";

export const ProfessorLayout = ({ profile }: ProfessorLayoutProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("calendario");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/auth");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const menuItems = [
    { id: "calendario" as TabType, label: "Calendário", icon: Calendar },
    { id: "feedbacks" as TabType, label: "Feedbacks", icon: MessageSquare },
    { id: "propostas" as TabType, label: "Propostas", icon: Lightbulb },
    { id: "denuncias" as TabType, label: "Denúncias", icon: Shield },
    { id: "ajuda" as TabType, label: "Ajuda nos Estudos", icon: BookOpen },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "calendario":
        return <CalendarioView profile={profile} />;
      case "feedbacks":
        return <FeedbacksView profile={profile} />;
      case "propostas":
        return <PropostasView profile={profile} />;
      case "denuncias":
        return <DenunciasView profile={profile} />;
      case "ajuda":
        return <AjudaEstudosView />;
      default:
        return <CalendarioView profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-hero p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Gestum - {profile.tipo_perfil === "gestao" ? "Gestão" : "Professor"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Bem-vindo, {profile.nome}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <nav className="bg-card rounded-xl border border-border p-4 sticky top-24">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === item.id
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-background/95 z-40 p-4">
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </nav>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};
