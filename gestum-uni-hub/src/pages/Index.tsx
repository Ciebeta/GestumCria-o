import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Shield, Calendar, Lightbulb } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-hero p-6 rounded-3xl shadow-2xl">
              <GraduationCap className="w-20 h-20 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary/70 bg-clip-text text-transparent mb-4">
            Gestum
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Sistema de Gestão Escolar
          </p>
          <p className="text-sm text-muted-foreground">CIE BETA</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Calendar,
              title: "Calendário",
              description: "Acompanhe eventos e atividades escolares",
            },
            {
              icon: Shield,
              title: "Denúncias Anônimas",
              description: "Canal seguro para reportar situações",
            },
            {
              icon: Lightbulb,
              title: "Propostas",
              description: "Participe e vote em ideias da comunidade",
            },
            {
              icon: GraduationCap,
              title: "Gestão Integrada",
              description: "Ferramentas completas para professores",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6 bg-primary hover:bg-primary-hover shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Acessar Sistema
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
