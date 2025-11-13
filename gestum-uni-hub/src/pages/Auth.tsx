import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <AuthLayout
      title={isSignUp ? "Criar Conta" : "Bem-vindo de volta"}
      subtitle={
        isSignUp
          ? "Preencha os dados para criar sua conta"
          : "Entre com suas credenciais para continuar"
      }
    >
      {isSignUp ? <SignUpForm /> : <SignInForm />}

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {isSignUp ? "Já possui uma conta?" : "Ainda não possui uma conta?"}
        </p>
        <Button
          variant="link"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:text-primary-hover font-semibold"
        >
          {isSignUp ? "Fazer Login" : "Criar Conta"}
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Auth;
