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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      agent_jobs: {
        Row: {
          action: string
          completed_at: string | null
          id: string
          metadata: Json | null
          started_at: string
          status: string
        }
        Insert: {
          action: string
          completed_at?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status: string
        }
        Update: {
          action?: string
          completed_at?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          id: string
          key_value: string
          last_used_at: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_value: string
          last_used_at?: string | null
          name?: string
        }
        Update: {
          created_at?: string
          id?: string
          key_value?: string
          last_used_at?: string | null
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id: string
          name: string
          slug: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      clicks_tracking: {
        Row: {
          affiliate_url: string
          created_at: string
          id: string
          platform: string
          post_id: string
          user_agent: string | null
        }
        Insert: {
          affiliate_url: string
          created_at?: string
          id?: string
          platform: string
          post_id: string
          user_agent?: string | null
        }
        Update: {
          affiliate_url?: string
          created_at?: string
          id?: string
          platform?: string
          post_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      cliques: {
        Row: {
          created_at: string
          deal_id: string
          id: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          id?: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cliques_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          affiliate_url: string
          categoria: string | null
          category: string | null
          created_at: string | null
          discount_price: number | null
          id: string
          image_url: string | null
          original_price: number | null
          status: string | null
          store: string | null
          title: string
        }
        Insert: {
          affiliate_url: string
          categoria?: string | null
          category?: string | null
          created_at?: string | null
          discount_price?: number | null
          id?: string
          image_url?: string | null
          original_price?: number | null
          status?: string | null
          store?: string | null
          title: string
        }
        Update: {
          affiliate_url?: string
          categoria?: string | null
          category?: string | null
          created_at?: string | null
          discount_price?: number | null
          id?: string
          image_url?: string | null
          original_price?: number | null
          status?: string | null
          store?: string | null
          title?: string
        }
        Relationships: []
      }
      guide_products: {
        Row: {
          contextual_pitch: string
          guide_id: string
          product_id: string
          rank_position: number
        }
        Insert: {
          contextual_pitch: string
          guide_id: string
          product_id: string
          rank_position: number
        }
        Update: {
          contextual_pitch?: string
          guide_id?: string
          product_id?: string
          rank_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "guide_products_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_guides_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_products_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_views: {
        Row: {
          guide_id: string | null
          id: string
          referer: string | null
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          guide_id?: string | null
          id?: string
          referer?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          guide_id?: string | null
          id?: string
          referer?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guide_views_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_guides_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_views_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
        ]
      }
      guides: {
        Row: {
          category_slug: string
          context_slug: string
          created_at: string | null
          faq_json: Json | null
          headline: string
          id: string
          intro_text: string
          last_revalidated_at: string | null
          persona_slug: string
          url_path: string
        }
        Insert: {
          category_slug: string
          context_slug: string
          created_at?: string | null
          faq_json?: Json | null
          headline: string
          id?: string
          intro_text: string
          last_revalidated_at?: string | null
          persona_slug: string
          url_path: string
        }
        Update: {
          category_slug?: string
          context_slug?: string
          created_at?: string | null
          faq_json?: Json | null
          headline?: string
          id?: string
          intro_text?: string
          last_revalidated_at?: string | null
          persona_slug?: string
          url_path?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          affiliate_links: Json | null
          category_id: string | null
          cons: string[] | null
          content: string | null
          excerpt: string | null
          featured: boolean | null
          hero_image: string | null
          id: string
          pros: string[] | null
          published_at: string | null
          rating: number | null
          reading_time: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          affiliate_links?: Json | null
          category_id?: string | null
          cons?: string[] | null
          content?: string | null
          excerpt?: string | null
          featured?: boolean | null
          hero_image?: string | null
          id: string
          pros?: string[] | null
          published_at?: string | null
          rating?: number | null
          reading_time?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          affiliate_links?: Json | null
          category_id?: string | null
          cons?: string[] | null
          content?: string | null
          excerpt?: string | null
          featured?: boolean | null
          hero_image?: string | null
          id?: string
          pros?: string[] | null
          published_at?: string | null
          rating?: number | null
          reading_time?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          affiliate_links: Json | null
          brand: string | null
          category_slug: string
          cons: Json | null
          created_at: string | null
          crivo_score: number | null
          hero_image: string | null
          id: string
          is_trending: boolean | null
          name: string
          pros: Json | null
          score_breakdown: Json | null
          slug: string
          spec_summary: string | null
          updated_at: string | null
        }
        Insert: {
          affiliate_links?: Json | null
          brand?: string | null
          category_slug: string
          cons?: Json | null
          created_at?: string | null
          crivo_score?: number | null
          hero_image?: string | null
          id?: string
          is_trending?: boolean | null
          name: string
          pros?: Json | null
          score_breakdown?: Json | null
          slug: string
          spec_summary?: string | null
          updated_at?: string | null
        }
        Update: {
          affiliate_links?: Json | null
          brand?: string | null
          category_slug?: string
          cons?: Json | null
          created_at?: string | null
          crivo_score?: number | null
          hero_image?: string | null
          id?: string
          is_trending?: boolean | null
          name?: string
          pros?: Json | null
          score_breakdown?: Json | null
          slug?: string
          spec_summary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_guides_view: {
        Row: {
          category_slug: string | null
          context_slug: string | null
          created_at: string | null
          headline: string | null
          id: string | null
          last_revalidated_at: string | null
          persona_slug: string | null
          products_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_7_day_metrics: {
        Args: never
        Returns: {
          amazon_clicks: number
          day_date: string
          mercadolivre_clicks: number
          shopee_clicks: number
        }[]
      }
      get_admin_dashboard_metrics: { Args: never; Returns: Json }
      get_top_deals: {
        Args: never
        Returns: {
          affiliate_url: string
          categoria: string
          clicks_count: number
          deal_id: string
          discount_price: number
          image_url: string
          original_price: number
          title: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
