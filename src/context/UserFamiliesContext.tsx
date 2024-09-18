import React, { createContext, useState, useContext, useEffect } from "react";
import { supabaseClient } from "../db/supabaseClient";
// import { useAuth } from "@/hooks/useAuthData";
import { useUser } from "@/context/UserContext";

interface Family {
  id: number;
  name: string;
  member_type: string; // Add this line
}

interface FamiliesContextType {
  families: Family[];
  isLoading: boolean;
  error: string | null;
  createFamily: (name: string) => Promise<void>;
  updateFamily: (id: number, name: string) => Promise<void>;
  deleteFamily: (id: number) => Promise<void>;
}

const FamiliesContext = createContext<FamiliesContextType | undefined>(
  undefined
);

export const FamiliesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //   const { user } = useAuth();
  const { user, isLoading: isLoadingUser, error: errorUser } = useUser();

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

  useEffect(() => {
    if (user) {
      fetchFamilies();
    } else if (errorUser || !isLoadingUser) {
      setIsLoading(false);
    }
  }, [user]);

  // TODO Placeholder for createFamily
  const createFamily = async (name: string) => {
    try {
      const { data, error } = await supabaseClient
        .from("families")
        .insert({ name, user_id: user?.id })
        .select();

      if (error) throw error;
      //   setFamilies([...families, data[0]]); // TODO
    } catch (err) {
      setError("Failed to create family");
      console.error(err);
    }
  };

  // TODO Placeholder for updateFamily
  const updateFamily = async (id: number, name: string) => {
    try {
      const { error } = await supabaseClient
        .from("families")
        .update({ name })
        .eq("id", id);
      // .eq("family_users.user_id", user?.id); // TODO

      if (error) throw error;
      setFamilies(families.map((f) => (f.id === id ? { ...f, name } : f)));
    } catch (err) {
      setError("Failed to update family");
      console.error(err);
    }
  };

  // TODO Placeholder for deleteFamily
  const deleteFamily = async (id: number) => {
    try {
      const { error } = await supabaseClient
        .from("families")
        .delete()
        .eq("id", id);
      // .eq("user_id", user?.id);

      if (error) throw error;
      setFamilies(families.filter((f) => f.id !== id));
    } catch (err) {
      setError("Failed to delete family");
      console.error(err);
    }
  };

  return (
    <FamiliesContext.Provider
      value={{
        families,
        isLoading,
        error,
        createFamily,
        updateFamily,
        deleteFamily,
      }}
    >
      {children}
    </FamiliesContext.Provider>
  );
};

export const useUserFamiliesContext = () => {
  const context = useContext(FamiliesContext);
  if (context === undefined) {
    throw new Error("useFamilies must be used within a FamiliesProvider");
  }
  return context;
};
