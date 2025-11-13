import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Feedback {
  id: string;
  mensagem: string;
  data_envio: string;
  aluno_id: string;
  profiles: {
    nome: string;
  };
  feedback_lidos: Array<{ professor_id: string }>;
}

export const FeedbacksView = ({ profile }: { profile: any }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from("feedbacks")
        .select(
          `
          *,
          profiles (nome),
          feedback_lidos (professor_id)
        `
        )
        .eq("aluno_id", profile.id)
        .order("data_envio", { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error("Erro ao carregar feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnviarFeedback = async () => {
    if (!mensagem.trim()) {
      toast.error("Por favor, escreva uma mensagem");
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.from("feedbacks").insert({
        aluno_id: profile.id,
        mensagem: mensagem.trim(),
      });

      if (error) throw error;

      toast.success("Feedback enviado com sucesso!");
      setMensagem("");
      loadFeedbacks();
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Erro ao enviar feedback");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Canal de Feedbacks
        </h2>
        <p className="text-muted-foreground">
          Envie suas mensagens e sugestões para os professores
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enviar Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Escreva sua mensagem aqui..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button
            onClick={handleEnviarFeedback}
            disabled={isSending}
            className="w-full sm:w-auto"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Feedback
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Meus Feedbacks</h3>
        {feedbacks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-32">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-center">
                Você ainda não enviou nenhum feedback
              </p>
            </CardContent>
          </Card>
        ) : (
          feedbacks.map((feedback) => (
            <Card key={feedback.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(feedback.data_envio), "PPp", {
                        locale: ptBR,
                      })}
                    </span>
                    {feedback.feedback_lidos.length > 0 && (
                      <div className="flex items-center gap-1 text-success">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs">
                          Lido por {feedback.feedback_lidos.length} professor(es)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-foreground">{feedback.mensagem}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
