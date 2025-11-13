import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Send, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const DenunciasView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [denuncia, setDenuncia] = useState({
    descricao: "",
    ano_escolar: "",
    tipo_inconveniente: "",
  });

  const handleEnviarDenuncia = async () => {
    if (
      !denuncia.descricao.trim() ||
      !denuncia.ano_escolar ||
      !denuncia.tipo_inconveniente
    ) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("denuncias").insert({
        descricao: denuncia.descricao.trim(),
        ano_escolar_ocorrencia: denuncia.ano_escolar,
        tipo_inconveniente: denuncia.tipo_inconveniente,
      });

      if (error) throw error;

      toast.success("Denúncia enviada com sucesso. Sua identidade permanece anônima.");
      setDenuncia({
        descricao: "",
        ano_escolar: "",
        tipo_inconveniente: "",
      });
    } catch (error) {
      console.error("Erro ao enviar denúncia:", error);
      toast.error("Erro ao enviar denúncia. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Canal de Denúncias
        </h2>
        <p className="text-muted-foreground">
          Relate situações de forma totalmente anônima e segura
        </p>
      </div>

      <Alert className="bg-primary/10 border-primary">
        <Shield className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">100% Anônimo e Seguro</AlertTitle>
        <AlertDescription>
          Sua identidade é completamente protegida. Nenhuma informação pessoal é
          registrada ao enviar uma denúncia.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Fazer uma Denúncia Anônima</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Ano/Série da Ocorrência
            </label>
            <Select
              value={denuncia.ano_escolar}
              onValueChange={(value) =>
                setDenuncia({ ...denuncia, ano_escolar: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano/série" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1º Ano">1º Ano</SelectItem>
                <SelectItem value="2º Ano">2º Ano</SelectItem>
                <SelectItem value="3º Ano">3º Ano</SelectItem>
                <SelectItem value="4º Ano">4º Ano</SelectItem>
                <SelectItem value="5º Ano">5º Ano</SelectItem>
                <SelectItem value="6º Ano">6º Ano</SelectItem>
                <SelectItem value="7º Ano">7º Ano</SelectItem>
                <SelectItem value="8º Ano">8º Ano</SelectItem>
                <SelectItem value="9º Ano">9º Ano</SelectItem>
                <SelectItem value="1º Médio">1º Médio</SelectItem>
                <SelectItem value="2º Médio">2º Médio</SelectItem>
                <SelectItem value="3º Médio">3º Médio</SelectItem>
                <SelectItem value="Não sei">Não sei informar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Tipo de Inconveniente
            </label>
            <Select
              value={denuncia.tipo_inconveniente}
              onValueChange={(value) =>
                setDenuncia({ ...denuncia, tipo_inconveniente: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bullying">Bullying</SelectItem>
                <SelectItem value="Agressão Física">Agressão Física</SelectItem>
                <SelectItem value="Agressão Verbal">Agressão Verbal</SelectItem>
                <SelectItem value="Discriminação">Discriminação</SelectItem>
                <SelectItem value="Cyberbullying">Cyberbullying</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Descrição da Ocorrência
            </label>
            <Textarea
              placeholder="Descreva o que aconteceu com o máximo de detalhes possível..."
              value={denuncia.descricao}
              onChange={(e) =>
                setDenuncia({ ...denuncia, descricao: e.target.value })
              }
              rows={6}
              className="resize-none"
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Importante: Forneça o máximo de informações possível para que a equipe
              gestora possa investigar e tomar as medidas adequadas.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleEnviarDenuncia}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Denúncia Anônima
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
