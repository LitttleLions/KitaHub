export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          association: string | null
          awards: Json | null
          benefits: Json | null
          bundesland: string | null
          capacity_free: string | null
          capacity_total: string | null
          certifications: Json | null
          city: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          email: string | null
          employees: string | null
          founded_year: string | null
          gallery: Json | null
          has_open_positions: boolean | null
          house_number: string | null
          id: string
          is_premium: boolean | null
          latitude: number | null
          location: string | null
          logo_url: string | null
          longitude: number | null
          max_age: string | null
          min_age: string | null
          name: string
          opening_hours_text: string | null
          phone: string | null
          postal_code: string | null
          premium_until: string | null
          rating: number | null
          review_count: number | null
          slug: string
          source_url: string | null
          special_pedagogy: string | null
          sponsor_name: string | null
          sponsor_type: string | null
          street: string | null
          type: string | null
          updated_at: string | null
          video_url: string | null
          website: string | null
        }
        Insert: {
          association?: string | null
          awards?: Json | null
          benefits?: Json | null
          bundesland?: string | null
          capacity_free?: string | null
          capacity_total?: string | null
          certifications?: Json | null
          city?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          employees?: string | null
          founded_year?: string | null
          gallery?: Json | null
          has_open_positions?: boolean | null
          house_number?: string | null
          id?: string
          is_premium?: boolean | null
          latitude?: number | null
          location?: string | null
          logo_url?: string | null
          longitude?: number | null
          max_age?: string | null
          min_age?: string | null
          name: string
          opening_hours_text?: string | null
          phone?: string | null
          postal_code?: string | null
          premium_until?: string | null
          rating?: number | null
          review_count?: number | null
          slug: string
          source_url?: string | null
          special_pedagogy?: string | null
          sponsor_name?: string | null
          sponsor_type?: string | null
          street?: string | null
          type?: string | null
          updated_at?: string | null
          video_url?: string | null
          website?: string | null
        }
        Update: {
          association?: string | null
          awards?: Json | null
          benefits?: Json | null
          bundesland?: string | null
          capacity_free?: string | null
          capacity_total?: string | null
          certifications?: Json | null
          city?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          employees?: string | null
          founded_year?: string | null
          gallery?: Json | null
          has_open_positions?: boolean | null
          house_number?: string | null
          id?: string
          is_premium?: boolean | null
          latitude?: number | null
          location?: string | null
          logo_url?: string | null
          longitude?: number | null
          max_age?: string | null
          min_age?: string | null
          name?: string
          opening_hours_text?: string | null
          phone?: string | null
          postal_code?: string | null
          premium_until?: string | null
          rating?: number | null
          review_count?: number | null
          slug?: string
          source_url?: string | null
          special_pedagogy?: string | null
          sponsor_name?: string | null
          sponsor_type?: string | null
          street?: string | null
          type?: string | null
          updated_at?: string | null
          video_url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          benefits: Json | null
          clickable: boolean | null
          company_id: string | null
          created_at: string | null
          description: string | null
          education: string | null
          employment_start: string | null
          experience: string | null
          expired_at: string | null
          featured: boolean | null
          id: string
          kita_image_url: string | null
          location: string | null
          posted_date: string | null
          requirements: Json | null
          salary: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          benefits?: Json | null
          clickable?: boolean | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          education?: string | null
          employment_start?: string | null
          experience?: string | null
          expired_at?: string | null
          featured?: boolean | null
          id?: string
          kita_image_url?: string | null
          location?: string | null
          posted_date?: string | null
          requirements?: Json | null
          salary?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          benefits?: Json | null
          clickable?: boolean | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          education?: string | null
          employment_start?: string | null
          experience?: string | null
          expired_at?: string | null
          featured?: boolean | null
          id?: string
          kita_image_url?: string | null
          location?: string | null
          posted_date?: string | null
          requirements?: Json | null
          salary?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "liste_urls"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_posts: {
        Row: {
          authors: Json | null
          breadcrumbs: Json | null
          categories: number[] | null
          category_terms: Json | null
          content_rendered: string | null
          date_modified: string | null
          date_published: string | null
          excerpt_rendered: string | null
          featured_media_id: number | null
          featured_media_url: string | null
          full_path: string | null
          id: number
          imported_at: string | null
          slug: string
          source_link: string
          tag_terms: Json | null
          tags: number[] | null
          title: string
          yoast_json: Json | null
        }
        Insert: {
          authors?: Json | null
          breadcrumbs?: Json | null
          categories?: number[] | null
          category_terms?: Json | null
          content_rendered?: string | null
          date_modified?: string | null
          date_published?: string | null
          excerpt_rendered?: string | null
          featured_media_id?: number | null
          featured_media_url?: string | null
          full_path?: string | null
          id: number
          imported_at?: string | null
          slug: string
          source_link: string
          tag_terms?: Json | null
          tags?: number[] | null
          title: string
          yoast_json?: Json | null
        }
        Update: {
          authors?: Json | null
          breadcrumbs?: Json | null
          categories?: number[] | null
          category_terms?: Json | null
          content_rendered?: string | null
          date_modified?: string | null
          date_published?: string | null
          excerpt_rendered?: string | null
          featured_media_id?: number | null
          featured_media_url?: string | null
          full_path?: string | null
          id?: number
          imported_at?: string | null
          slug?: string
          source_link?: string
          tag_terms?: Json | null
          tags?: number[] | null
          title?: string
          yoast_json?: Json | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          content_text: string
          cover_image_url: string | null
          created_at: string
          id: string
          inline_image_urls: string[] | null
          openai_prompt: string | null
          reading_time_minutes: number | null
          seo_description: string | null
          seo_keywords: string[] | null
          slug: string
          target_age_max: number | null
          target_age_min: number | null
          themes: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content_text: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          inline_image_urls?: string[] | null
          openai_prompt?: string | null
          reading_time_minutes?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          slug: string
          target_age_max?: number | null
          target_age_min?: number | null
          themes?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content_text?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          inline_image_urls?: string[] | null
          openai_prompt?: string | null
          reading_time_minutes?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          slug?: string
          target_age_max?: number | null
          target_age_min?: number | null
          themes?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      liste_urls: {
        Row: {
          id: string | null
          website: string | null
        }
        Insert: {
          id?: string | null
          website?: string | null
        }
        Update: {
          id?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
