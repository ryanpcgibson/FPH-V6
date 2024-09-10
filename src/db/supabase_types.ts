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
      families: {
        Row: {
          added_by: string | null
          created_at: string
          id: number
          name: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "families_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      family_users: {
        Row: {
          family_id: number
          member_type: Database["public"]["Enums"]["member_types"]
          user_id: string
        }
        Insert: {
          family_id: number
          member_type: Database["public"]["Enums"]["member_types"]
          user_id: string
        }
        Update: {
          family_id?: number
          member_type?: Database["public"]["Enums"]["member_types"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_users_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_users_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_users_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_ext"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          added_by: string | null
          created_at: string
          end_date: string | null
          family_id: number | null
          id: number
          map_reference: string | null
          name: string
          start_date: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          end_date?: string | null
          family_id?: number | null
          id?: number
          map_reference?: string | null
          name: string
          start_date: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          end_date?: string | null
          family_id?: number | null
          id?: number
          map_reference?: string | null
          name?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      moments: {
        Row: {
          added_by: string | null
          body: string | null
          created_at: string
          end_date: string | null
          id: number
          start_date: string
          title: string
        }
        Insert: {
          added_by?: string | null
          body?: string | null
          created_at?: string
          end_date?: string | null
          id?: number
          start_date: string
          title: string
        }
        Update: {
          added_by?: string | null
          body?: string | null
          created_at?: string
          end_date?: string | null
          id?: number
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "moments_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_moments: {
        Row: {
          moment_id: number
          pet_id: number
        }
        Insert: {
          moment_id: number
          pet_id?: number
        }
        Update: {
          moment_id?: number
          pet_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "pet_moments_moment_id_fkey"
            columns: ["moment_id"]
            isOneToOne: false
            referencedRelation: "moments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_moments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          added_by: string | null
          created_at: string
          end_date: string | null
          family_id: number
          id: number
          name: string
          start_date: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          end_date?: string | null
          family_id: number
          id?: number
          name: string
          start_date: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          end_date?: string | null
          family_id?: number
          id?: number
          name?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "pets_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          added_by: string | null
          created_at: string
          id: number
          moment_id: number | null
          path: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          id?: number
          moment_id?: number | null
          path: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          id?: number
          moment_id?: number | null
          path?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_moment_id_fkey"
            columns: ["moment_id"]
            isOneToOne: false
            referencedRelation: "moments"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      users_ext: {
        Row: {
          display_name: string | null
          email: string | null
          family_id: number | null
          id: string | null
          member_type: Database["public"]["Enums"]["member_types"] | null
        }
        Relationships: [
          {
            foreignKeyName: "family_users_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      dbg_update_name_by_email: {
        Args: {
          p_email: string
          p_display_name: string
        }
        Returns: undefined
      }
      get_editable_user_family_ids: {
        Args: {
          p_user_id: string
        }
        Returns: {
          family_id: number
        }[]
      }
      get_family_ids_for_user: {
        Args: {
          p_user_id: string
        }
        Returns: {
          family_id: number
        }[]
      }
      get_family_records: {
        Args: {
          param_family_id: number
        }
        Returns: Json
      }
    }
    Enums: {
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
      member_types: "owner" | "editor" | "viewer"
      profile_types: "editor" | "contributorviewer"
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
