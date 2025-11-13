import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const FeedbacksView = ({ profile }: { profile: any }) => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*, profiles(nome), feedback_lidos(professor_id)")
        .order("data_envio", { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const marcarComoLido = async (feedbackId: string) => {
    try {
      await supabase.from("feedback_lidos").insert({
        feedback_id: feedbackId,
        professor_id: profile.id,
      });
      toast.success("Marcado como lido");
      loadFeedbacks();
    } catch (error: any) {
      if (error.code === "23505") {
        toast.info("Você já marcou este feedback como lido");
      } else {
        toast.error("Erro ao marcar como lido");
      }
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
      <h2 className="text-3xl font-bold">Feedbacks dos Alunos</h2>
      {feedbacks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-32">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhum feedback recebido</p>
          </CardContent>
        </Card>
      ) : (
        feedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardHeader>
              <CardTitle className="text-lg">{feedback.profiles.nome}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(new Date(feedback.data_envio), "PPp", { locale: ptBR })}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{feedback.mensagem}</p>
              {!feedback.feedback_lidos.some(
                (l: any) => l.professor_id === profile.id
              ) ? (
                <Button onClick={() => marcarComoLido(feedback.id)}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Marcar como Lido
                </Button>
              ) : (
                <div className="text-success flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Você marcou como lido</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
