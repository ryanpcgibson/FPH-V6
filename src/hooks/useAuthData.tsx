import { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "../db/supabaseClient";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuthData = () => {
  const [authData, setAuthData] = useState<Omit<AuthContextType, "signOut">>({
    session: null,
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const setData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabaseClient.auth.getSession();
        if (error) throw error;
        if (!session) {
          // Add a small delay before setting the "User not authenticated" error
          setTimeout(() => {
            setAuthData((prev) => {
              if (!prev.user) {
                return {
                  session: null,
                  user: null,
                  isLoading: false,
                  error: new Error("User not authenticated"),
                };
              }
              return prev;
            });
          }, 500); // 500ms delay
        } else {
          setAuthData({
            session,
            user: session.user,
            isLoading: false,
            error: null,
          });
        }
      } catch (e) {
        setAuthData((prev) => ({
          ...prev,
          isLoading: false,
          error: e instanceof Error ? e : new Error("An error occurred"),
        }));
      }
    };

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setAuthData((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isLoading: false,
          error: null, // Clear any previous error when auth state changes
        }));
      }
    );

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = () => supabaseClient.auth.signOut();

  return { ...authData, signOut };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authData = useAuthData();

  return (
    <AuthContext.Provider value={authData}>
      {!authData.isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
