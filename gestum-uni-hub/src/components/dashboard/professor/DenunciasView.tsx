import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const DenunciasView = ({ profile }: { profile: any }) => {
  const [denuncias, setDenuncias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDenuncias();
  }, []);

  const loadDenuncias = async () => {
    try {
      const { data, error } = await supabase
        .from("denuncias")
        .select("*")
        .order("data_envio", { ascending: false });
      if (error) throw error;
      setDenuncias(data || []);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarStatus = async (id: string, status: string) => {
    try {
      await supabase.from("denuncias").update({ 
        status: status as "recebida" | "analise" | "concluida" 
      }).eq("id", id);
      toast.success("Status atualizado");
      loadDenuncias();
    } catch (error) {
      toast.error("Erro ao atualizar");
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
      <h2 className="text-3xl font-bold">Denúncias Recebidas</h2>
      {denuncias.map((denuncia) => (
        <Card key={denuncia.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{denuncia.tipo_inconveniente}</CardTitle>
              <Badge>{denuncia.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {denuncia.ano_escolar_ocorrencia}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{denuncia.descricao}</p>
            <Select value={denuncia.status} onValueChange={(v) => atualizarStatus(denuncia.id, v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recebida">Recebida</SelectItem>
                <SelectItem value="analise">Em Análise</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
