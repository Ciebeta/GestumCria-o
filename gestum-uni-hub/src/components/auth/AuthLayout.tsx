import { ReactNode } from "react";
import { GraduationCap } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-hero p-4 rounded-2xl shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary/70 bg-clip-text text-transparent mb-2">
            Gestum
          </h1>
          <p className="text-sm text-muted-foreground">
            CIE BETA - Sistema de Gestão Escolar
          </p>
        </div>

        <div className="bg-card shadow-xl rounded-2xl p-8 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
