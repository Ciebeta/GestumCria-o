-- Gestum Database Schema
-- Sistema de Gestão Escolar Completo

-- 1. Criar enum para tipos de perfil
CREATE TYPE public.profile_type AS ENUM ('aluno', 'professor', 'gestao', 'gremio');

-- 2. Criar enum para tipos de evento
CREATE TYPE public.event_type AS ENUM ('prova', 'palestra', 'feriado', 'visita', 'reuniao', 'outros');

-- 3. Criar enum para status de denúncia
CREATE TYPE public.denuncia_status AS ENUM ('recebida', 'analise', 'concluida');

-- 4. Tabela de séries/anos escolares
CREATE TABLE public.series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo_perfil profile_type NOT NULL,
  data_nascimento DATE,
  serie_id UUID REFERENCES public.series(id),
  rg TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de eventos (Calendário)
CREATE TABLE public.eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  tipo event_type NOT NULL DEFAULT 'outros',
  serie_alvo_id UUID REFERENCES public.series(id),
  criador_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de denúncias anônimas
CREATE TABLE public.denuncias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao TEXT NOT NULL,
  ano_escolar_ocorrencia TEXT NOT NULL,
  tipo_inconveniente TEXT NOT NULL,
  status denuncia_status DEFAULT 'recebida',
  data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela de feedbacks (mensagens públicas de alunos)
CREATE TABLE public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabela para controle de leitura de feedbacks
CREATE TABLE public.feedback_lidos (
  feedback_id UUID REFERENCES public.feedbacks(id) ON DELETE CASCADE,
  professor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  data_leitura TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (feedback_id, professor_id)
);

-- 10. Tabela de propostas
CREATE TABLE public.propostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  texto TEXT NOT NULL,
  autor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  link_anexo TEXT,
  votos_apoio INTEGER DEFAULT 0,
  votos_desapoio INTEGER DEFAULT 0,
  data_publicacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Tabela para controlar votos (evitar votos duplicados)
CREATE TABLE public.votos_propostas (
  proposta_id UUID REFERENCES public.propostas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tipo_voto TEXT CHECK (tipo_voto IN ('apoio', 'desapoio')),
  data_voto TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (proposta_id, usuario_id)
);

-- Enable Row Level Security
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.denuncias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_lidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votos_propostas ENABLE ROW LEVEL SECURITY;

-- RLS Policies para Séries (todos podem visualizar)
CREATE POLICY "Todos podem visualizar séries"
  ON public.series FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies para Profiles
CREATE POLICY "Usuários podem visualizar todos os perfis"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies para Eventos
CREATE POLICY "Todos podem visualizar eventos"
  ON public.eventos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Gestão pode criar eventos"
  ON public.eventos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND tipo_perfil IN ('gestao', 'professor')
    )
  );

CREATE POLICY "Gestão pode atualizar eventos"
  ON public.eventos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND tipo_perfil IN ('gestao', 'professor')
    )
  );

CREATE POLICY "Gestão pode deletar eventos"
  ON public.eventos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND tipo_perfil IN ('gestao', 'professor')
    )
  );

-- RLS Policies para Denúncias (anônimas - sem relação com usuário)
CREATE POLICY "Todos podem enviar denúncias"
  ON public.denuncias FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Gestão pode visualizar denúncias"
  ON public.denuncias FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND tipo_perfil IN ('gestao', 'professor')
    )
  );

CREATE POLICY "Gestão pode atualizar status de denúncias"
  ON public.denuncias FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND tipo_perfil IN ('gestao', 'professor')
    )
  );

-- RLS Policies para Feedbacks
CREATE POLICY "Alunos podem criar feedbacks"
  ON public.feedbacks FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = aluno_id
  );

CREATE POLICY "Todos podem visualizar feedbacks"
  ON public.feedbacks FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies para Feedback Lidos
CREATE POLICY "Professores podem marcar feedbacks como lidos"
  ON public.feedback_lidos FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = professor_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND tipo_perfil IN ('professor', 'gestao')
    )
  );

CREATE POLICY "Todos podem visualizar feedbacks lidos"
  ON public.feedback_lidos FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies para Propostas
CREATE POLICY "Todos podem visualizar propostas"
  ON public.propostas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar propostas"
  ON public.propostas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = autor_id);

CREATE POLICY "Autores podem atualizar suas propostas"
  ON public.propostas FOR UPDATE
  TO authenticated
  USING (auth.uid() = autor_id);

-- RLS Policies para Votos
CREATE POLICY "Usuários podem votar"
  ON public.votos_propostas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem visualizar votos"
  ON public.votos_propostas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem atualizar seus votos"
  ON public.votos_propostas FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem deletar seus votos"
  ON public.votos_propostas FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Trigger para atualizar updated_at em profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, tipo_perfil, data_nascimento)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
    COALESCE((NEW.raw_user_meta_data->>'tipo_perfil')::profile_type, 'aluno'),
    COALESCE((NEW.raw_user_meta_data->>'data_nascimento')::date, NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Inserir séries padrão
INSERT INTO public.series (nome) VALUES
  ('1º Ano'),
  ('2º Ano'),
  ('3º Ano'),
  ('4º Ano'),
  ('5º Ano'),
  ('6º Ano'),
  ('7º Ano'),
  ('8º Ano'),
  ('9º Ano'),
  ('1º Médio'),
  ('2º Médio'),
  ('3º Médio');