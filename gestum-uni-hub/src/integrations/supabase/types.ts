export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      denuncias: {
        Row: {
          ano_escolar_ocorrencia: string
          data_atualizacao: string | null
          data_envio: string | null
          descricao: string
          id: string
          status: Database["public"]["Enums"]["denuncia_status"] | null
          tipo_inconveniente: string
        }
        Insert: {
          ano_escolar_ocorrencia: string
          data_atualizacao?: string | null
          data_envio?: string | null
          descricao: string
          id?: string
          status?: Database["public"]["Enums"]["denuncia_status"] | null
          tipo_inconveniente: string
        }
        Update: {
          ano_escolar_ocorrencia?: string
          data_atualizacao?: string | null
          data_envio?: string | null
          descricao?: string
          id?: string
          status?: Database["public"]["Enums"]["denuncia_status"] | null
          tipo_inconveniente?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          created_at: string | null
          criador_id: string | null
          data_fim: string
          data_inicio: string
          descricao: string | null
          id: string
          serie_alvo_id: string | null
          tipo: Database["public"]["Enums"]["event_type"]
          titulo: string
        }
        Insert: {
          created_at?: string | null
          criador_id?: string | null
          data_fim: string
          data_inicio: string
          descricao?: string | null
          id?: string
          serie_alvo_id?: string | null
          tipo?: Database["public"]["Enums"]["event_type"]
          titulo: string
        }
        Update: {
          created_at?: string | null
          criador_id?: string | null
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          id?: string
          serie_alvo_id?: string | null
          tipo?: Database["public"]["Enums"]["event_type"]
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_criador_id_fkey"
            columns: ["criador_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_serie_alvo_id_fkey"
            columns: ["serie_alvo_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_lidos: {
        Row: {
          data_leitura: string | null
          feedback_id: string
          professor_id: string
        }
        Insert: {
          data_leitura?: string | null
          feedback_id: string
          professor_id: string
        }
        Update: {
          data_leitura?: string | null
          feedback_id?: string
          professor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_lidos_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedbacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_lidos_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          aluno_id: string | null
          data_envio: string | null
          id: string
          mensagem: string
        }
        Insert: {
          aluno_id?: string | null
          data_envio?: string | null
          id?: string
          mensagem: string
        }
        Update: {
          aluno_id?: string | null
          data_envio?: string | null
          id?: string
          mensagem?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          data_nascimento: string | null
          id: string
          nome: string
          rg: string | null
          serie_id: string | null
          tipo_perfil: Database["public"]["Enums"]["profile_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_nascimento?: string | null
          id: string
          nome: string
          rg?: string | null
          serie_id?: string | null
          tipo_perfil: Database["public"]["Enums"]["profile_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_nascimento?: string | null
          id?: string
          nome?: string
          rg?: string | null
          serie_id?: string | null
          tipo_perfil?: Database["public"]["Enums"]["profile_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_serie_id_fkey"
            columns: ["serie_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      propostas: {
        Row: {
          autor_id: string | null
          data_publicacao: string | null
          id: string
          link_anexo: string | null
          texto: string
          titulo: string
          votos_apoio: number | null
          votos_desapoio: number | null
        }
        Insert: {
          autor_id?: string | null
          data_publicacao?: string | null
          id?: string
          link_anexo?: string | null
          texto: string
          titulo: string
          votos_apoio?: number | null
          votos_desapoio?: number | null
        }
        Update: {
          autor_id?: string | null
          data_publicacao?: string | null
          id?: string
          link_anexo?: string | null
          texto?: string
          titulo?: string
          votos_apoio?: number | null
          votos_desapoio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "propostas_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      series: {
        Row: {
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      votos_propostas: {
        Row: {
          data_voto: string | null
          proposta_id: string
          tipo_voto: string | null
          usuario_id: string
        }
        Insert: {
          data_voto?: string | null
          proposta_id: string
          tipo_voto?: string | null
          usuario_id: string
        }
        Update: {
          data_voto?: string | null
          proposta_id?: string
          tipo_voto?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votos_propostas_proposta_id_fkey"
            columns: ["proposta_id"]
            isOneToOne: false
            referencedRelation: "propostas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votos_propostas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      denuncia_status: "recebida" | "analise" | "concluida"
      event_type:
        | "prova"
        | "palestra"
        | "feriado"
        | "visita"
        | "reuniao"
        | "outros"
      profile_type: "aluno" | "professor" | "gestao" | "gremio"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      denuncia_status: ["recebida", "analise", "concluida"],
      event_type: [
        "prova",
        "palestra",
        "feriado",
        "visita",
        "reuniao",
        "outros",
      ],
      profile_type: ["aluno", "professor", "gestao", "gremio"],
    },
  },
} as const
