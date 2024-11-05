import { useState, useEffect } from "react";
import { supabaseClient } from "../db/supabaseClient";
import { useAuth } from "@/context/AuthContext";

interface Family {
  id: number;
  name: string;
  member_type: string;
}

export function useFamilies() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFamilies();
    }
  }, [user]);

  const fetchFamilies = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from("families")
        .select("id, name, family_users!inner(member_type)")
        .eq("family_users.user_id", user?.id || "");

      if (error) throw error;
      setFamilies(
        data.map(({ id, name, family_users }) => ({
          id,
          name,
          member_type: family_users[0].member_type,
        }))
      );
    } catch (err) {
      setError("Failed to fetch families");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createFamily = async (name: string) => {
    try {
      const { data, error: insertError } = await supabaseClient
        .from("families")
        .insert({ name })
        .select()
        .single();

      if (insertError) throw insertError;

      const { error: relationError } = await supabaseClient
        .from("family_users")
        .insert({
          family_id: data.id,
          user_id: user?.id,
          member_type: "owner",
        });

      if (relationError) throw relationError;
      await fetchFamilies();
    } catch (err) {
      setError("Failed to create family");
      console.error(err);
    }
  };

  const updateFamily = async (id: number, name: string) => {
    try {
      const { data: familyUser, error: checkError } = await supabaseClient
        .from("family_users")
        .select("member_type")
        .eq("family_id", id)
        .eq("user_id", user?.id)
        .single();

      if (checkError) throw checkError;
      if (!["owner", "admin"].includes(familyUser.member_type)) {
        throw new Error("Insufficient permissions");
      }

      const { error } = await supabaseClient
        .from("families")
        .update({ name })
        .eq("id", id);

      if (error) throw error;
      setFamilies(families.map((f) => (f.id === id ? { ...f, name } : f)));
    } catch (err) {
      setError("Failed to update family");
      console.error(err);
    }
  };

  const deleteFamily = async (id: number) => {
    try {
      const { data: familyUser, error: checkError } = await supabaseClient
        .from("family_users")
        .select("member_type")
        .eq("family_id", id)
        .eq("user_id", user?.id)
        .single();

      if (checkError) throw checkError;
      if (familyUser.member_type !== "owner") {
        throw new Error("Only owners can delete families");
      }

      const { error } = await supabaseClient
        .from("families")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setFamilies(families.filter((f) => f.id !== id));
    } catch (err) {
      setError("Failed to delete family");
      console.error(err);
    }
  };

  return {
    families,
    isLoading,
    error,
    fetchFamilies,
    createFamily,
    updateFamily,
    deleteFamily,
  };
}

export type UseFamiliesReturn = ReturnType<typeof useFamilies>;
