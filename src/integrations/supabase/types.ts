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
          awards: Json | null
          benefits: Json | null
          bundesland: string | null
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
          name: string
          phone: string | null
          postal_code: string | null
          premium_until: string | null
          rating: number | null
          review_count: number | null
          slug: string
          special_pedagogy: string | null
          street: string | null
          type: string | null
          updated_at: string | null
          video_url: string | null
          website: string | null
        }
        Insert: {
          awards?: Json | null
          benefits?: Json | null
          bundesland?: string | null
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
          name: string
          phone?: string | null
          postal_code?: string | null
          premium_until?: string | null
          rating?: number | null
          review_count?: number | null
          slug: string
          special_pedagogy?: string | null
          street?: string | null
          type?: string | null
          updated_at?: string | null
          video_url?: string | null
          website?: string | null
        }
        Update: {
          awards?: Json | null
          benefits?: Json | null
          bundesland?: string | null
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
          name?: string
          phone?: string | null
          postal_code?: string | null
          premium_until?: string | null
          rating?: number | null
          review_count?: number | null
          slug?: string
          special_pedagogy?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
