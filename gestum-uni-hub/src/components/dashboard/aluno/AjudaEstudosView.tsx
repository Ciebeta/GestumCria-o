import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookOpen, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AjudaEstudosView = () => {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEnviarPergunta = async () => {
    if (!pergunta.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, digite sua dúvida",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResposta("");

    try {
      const { data, error } = await supabase.functions.invoke("ajuda-estudos", {
        body: { pergunta },
      });

      if (error) throw error;

      setResposta(data.resposta);
      toast({
        title: "Resposta recebida!",
        description: "A IA analisou sua dúvida",
      });
    } catch (error) {
      console.error("Erro ao enviar pergunta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua pergunta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Ajuda nos Estudos
        </h2>
        <p className="text-muted-foreground">
          Tire suas dúvidas acadêmicas com nossa inteligência artificial
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faça sua Pergunta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Digite sua dúvida aqui... Ex: Como resolver equações de segundo grau?"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button
            onClick={handleEnviarPergunta}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Pergunta
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {resposta && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Resposta da IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-foreground">{resposta}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!resposta && !isLoading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-40 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Digite sua dúvida acima e receba uma explicação detalhada
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
