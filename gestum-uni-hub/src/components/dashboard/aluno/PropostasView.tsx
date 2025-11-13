import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Proposta {
  id: string;
  titulo: string;
  texto: string;
  link_anexo: string | null;
  votos_apoio: number;
  votos_desapoio: number;
  data_publicacao: string;
  autor_id: string;
  profiles: {
    nome: string;
  };
  votos_propostas: Array<{ tipo_voto: string }>;
}

export const PropostasView = ({ profile }: { profile: any }) => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novaProposta, setNovaProposta] = useState({
    titulo: "",
    texto: "",
    link_anexo: "",
  });

  useEffect(() => {
    loadPropostas();
  }, []);

  const loadPropostas = async () => {
    try {
      const { data, error } = await supabase
        .from("propostas")
        .select(
          `
          *,
          profiles (nome),
          votos_propostas (tipo_voto)
        `
        )
        .order("data_publicacao", { ascending: false });

      if (error) throw error;
      setPropostas(data || []);
    } catch (error) {
      console.error("Erro ao carregar propostas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCriarProposta = async () => {
    if (!novaProposta.titulo.trim() || !novaProposta.texto.trim()) {
      toast.error("Preencha título e texto da proposta");
      return;
    }

    try {
      const { error } = await supabase.from("propostas").insert({
        titulo: novaProposta.titulo.trim(),
        texto: novaProposta.texto.trim(),
        link_anexo: novaProposta.link_anexo.trim() || null,
        autor_id: profile.id,
      });

      if (error) throw error;

      toast.success("Proposta criada com sucesso!");
      setNovaProposta({ titulo: "", texto: "", link_anexo: "" });
      setIsDialogOpen(false);
      loadPropostas();
    } catch (error) {
      console.error("Erro ao criar proposta:", error);
      toast.error("Erro ao criar proposta");
    }
  };

  const handleVotar = async (propostaId: string, tipoVoto: "apoio" | "desapoio") => {
    try {
      // Verificar se já votou
      const { data: votoExistente } = await supabase
        .from("votos_propostas")
        .select("*")
        .eq("proposta_id", propostaId)
        .eq("usuario_id", profile.id)
        .single();

      if (votoExistente) {
        // Se já votou no mesmo tipo, remove o voto
        if (votoExistente.tipo_voto === tipoVoto) {
          await supabase
            .from("votos_propostas")
            .delete()
            .eq("proposta_id", propostaId)
            .eq("usuario_id", profile.id);
          toast.success("Voto removido");
        } else {
          // Se votou diferente, atualiza
          await supabase
            .from("votos_propostas")
            .update({ tipo_voto: tipoVoto })
            .eq("proposta_id", propostaId)
            .eq("usuario_id", profile.id);
          toast.success("Voto atualizado");
        }
      } else {
        // Novo voto
        await supabase.from("votos_propostas").insert({
          proposta_id: propostaId,
          usuario_id: profile.id,
          tipo_voto: tipoVoto,
        });
        toast.success("Voto registrado");
      }

      loadPropostas();
    } catch (error) {
      console.error("Erro ao votar:", error);
      toast.error("Erro ao registrar voto");
    }
  };

  const getMeuVoto = (proposta: Proposta) => {
    return proposta.votos_propostas.find(() => true)?.tipo_voto;
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Propostas</h2>
          <p className="text-muted-foreground">
            Participe e vote nas propostas da comunidade escolar
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Lightbulb className="mr-2 h-4 w-4" />
              Nova Proposta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Proposta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Título da proposta"
                value={novaProposta.titulo}
                onChange={(e) =>
                  setNovaProposta({ ...novaProposta, titulo: e.target.value })
                }
              />
              <Textarea
                placeholder="Descrição detalhada"
                value={novaProposta.texto}
                onChange={(e) =>
                  setNovaProposta({ ...novaProposta, texto: e.target.value })
                }
                rows={4}
              />
              <Input
                placeholder="Link de anexo (opcional)"
                value={novaProposta.link_anexo}
                onChange={(e) =>
                  setNovaProposta({ ...novaProposta, link_anexo: e.target.value })
                }
              />
              <Button onClick={handleCriarProposta} className="w-full">
                Criar Proposta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {propostas.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-32">
              <Lightbulb className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Nenhuma proposta cadastrada ainda
              </p>
            </CardContent>
          </Card>
        ) : (
          propostas.map((proposta) => {
            const meuVoto = getMeuVoto(proposta);
            return (
              <Card key={proposta.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{proposta.titulo}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Por {proposta.profiles.nome} •{" "}
                    {format(new Date(proposta.data_publicacao), "PPp", {
                      locale: ptBR,
                    })}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground">{proposta.texto}</p>
                  {proposta.link_anexo && (
                    <a
                      href={proposta.link_anexo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Ver anexo
                    </a>
                  )}
                  <div className="flex items-center gap-4">
                    <Button
                      variant={meuVoto === "apoio" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVotar(proposta.id, "apoio")}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {proposta.votos_apoio}
                    </Button>
                    <Button
                      variant={meuVoto === "desapoio" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleVotar(proposta.id, "desapoio")}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      {proposta.votos_desapoio}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
