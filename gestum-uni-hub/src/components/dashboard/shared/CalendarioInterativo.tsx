import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, Loader2 } from "lucide-react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  tipo: string;
  criador_id: string | null;
}

export const CalendarioInterativo = ({ profile }: { profile: any }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosDoDia, setEventosDoDia] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    descricao: "",
    data_inicio: format(new Date(), "yyyy-MM-dd"),
    data_fim: format(new Date(), "yyyy-MM-dd"),
    tipo: "outros" as const,
  });
  const { toast } = useToast();

  const isProfessorOrGestao = profile?.tipo_perfil === "professor" || profile?.tipo_perfil === "gestao";

  useEffect(() => {
    loadEventos();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const eventosDia = eventos.filter((evento) => {
        const inicio = new Date(evento.data_inicio);
        const fim = new Date(evento.data_fim);
        return selectedDate >= inicio && selectedDate <= fim;
      });
      setEventosDoDia(eventosDia);
    }
  }, [selectedDate, eventos]);

  const loadEventos = async () => {
    try {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .order("data_inicio", { ascending: true });

      if (error) throw error;
      setEventos(data || []);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os eventos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCriarEvento = async () => {
    if (!novoEvento.titulo.trim()) {
      toast({
        title: "Atenção",
        description: "O título do evento é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("eventos").insert({
        ...novoEvento,
        criador_id: profile.id,
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Evento criado com sucesso",
      });
      setDialogOpen(false);
      setNovoEvento({
        titulo: "",
        descricao: "",
        data_inicio: format(new Date(), "yyyy-MM-dd"),
        data_fim: format(new Date(), "yyyy-MM-dd"),
        tipo: "outros",
      });
      loadEventos();
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento",
        variant: "destructive",
      });
    }
  };

  const handleDeletarEvento = async (eventoId: string) => {
    try {
      const { error } = await supabase.from("eventos").delete().eq("id", eventoId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Evento deletado com sucesso",
      });
      loadEventos();
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar o evento",
        variant: "destructive",
      });
    }
  };

  const getEventoBadgeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      prova: "bg-destructive text-destructive-foreground",
      palestra: "bg-primary text-primary-foreground",
      feriado: "bg-success text-success-foreground",
      visita: "bg-accent text-accent-foreground",
      reuniao: "bg-warning text-warning-foreground",
      outros: "bg-muted text-muted-foreground",
    };
    return colors[tipo] || colors.outros;
  };

  const diasComEventos = eventos.map((evento) => {
    const inicio = new Date(evento.data_inicio);
    const fim = new Date(evento.data_fim);
    return eachDayOfInterval({ start: inicio, end: fim });
  }).flat();

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
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Calendário Escolar
          </h2>
          <p className="text-muted-foreground">
            {isProfessorOrGestao 
              ? "Gerencie os eventos e atividades da escola"
              : "Acompanhe os eventos e suas atividades pessoais"}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={novoEvento.titulo}
                  onChange={(e) => setNovoEvento({ ...novoEvento, titulo: e.target.value })}
                  placeholder="Nome do evento"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={novoEvento.descricao}
                  onChange={(e) => setNovoEvento({ ...novoEvento, descricao: e.target.value })}
                  placeholder="Detalhes do evento"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={novoEvento.tipo}
                  onValueChange={(value) => setNovoEvento({ ...novoEvento, tipo: value as typeof novoEvento.tipo })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prova">Prova</SelectItem>
                    <SelectItem value="palestra">Palestra</SelectItem>
                    <SelectItem value="feriado">Feriado</SelectItem>
                    <SelectItem value="visita">Visita</SelectItem>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data Início</label>
                  <Input
                    type="date"
                    value={novoEvento.data_inicio}
                    onChange={(e) => setNovoEvento({ ...novoEvento, data_inicio: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data Fim</label>
                  <Input
                    type="date"
                    value={novoEvento.data_fim}
                    onChange={(e) => setNovoEvento({ ...novoEvento, data_fim: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleCriarEvento} className="w-full">
                Criar Evento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendário Mensal</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border"
              modifiers={{
                comEvento: diasComEventos,
              }}
              modifiersStyles={{
                comEvento: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  color: 'hsl(var(--primary))',
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Eventos em {format(selectedDate, "PPP", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventosDoDia.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Nenhum evento neste dia
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {eventosDoDia.map((evento) => (
                  <Card key={evento.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{evento.titulo}</h4>
                          <Badge className={getEventoBadgeColor(evento.tipo)} variant="secondary">
                            {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                          </Badge>
                        </div>
                        {evento.criador_id === profile.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletarEvento(evento.id)}
                          >
                            Excluir
                          </Button>
                        )}
                      </div>
                      {evento.descricao && (
                        <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eventos
              .filter((e) => new Date(e.data_inicio) >= new Date())
              .slice(0, 5)
              .map((evento) => (
                <div key={evento.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{evento.titulo}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(evento.data_inicio), "PPP", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge className={getEventoBadgeColor(evento.tipo)}>
                    {evento.tipo}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
