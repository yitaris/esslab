import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient.ts"

// Define types for user data and session
interface User {
  id: string;
  name: string;
  title: string;
  branch_name: string;
  avatar_url: string;
  branch_id: string;
  email: string;
}

interface Session {
  user: User | null;
  access_token: string | null;
}

interface AuthContextType {
  signInUser: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  getSKT: (branch_id: string) => Promise<any[]>; // Replace `any[]` with the appropriate type
  deleteSKT: (id: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        console.error("Sign-in error:", error.message);
        return { success: false, error: error.message };
      }

      await fetchUserDetails(data.user.id);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      return { success: false, error: "An unexpected error occurred." };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    localStorage.removeItem("user"); // Clear localStorage on sign out
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("branch_id, name, title, branch_name, avatar_url, tasks, email")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user details:", error.message);
        return;
      }

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data)); // Store user data in localStorage
    } catch (error) {
      console.error("Unexpected error while fetching user details:", error);
    }
  };

  const getSKT = async (branch_id: string) => {
    try {
      const { data, error } = await supabase
        .from("SKT")
        .select("*")
        .eq("branch", branch_id);

      if (error) {
        console.error("Error fetching SKT details:", error.message);
        return [];
      }
      return data;
    } catch (error) {
      console.error("Unexpected error while fetching SKT details:", error);
      return [];
    }
  };

  const deleteSKT = async (id: string) => {
    try {
      const { error } = await supabase.from("SKT").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting SKT:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        setUser(session.user);
        await fetchUserDetails(session.user.id);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        fetchUserDetails(session.user.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ signInUser, session, user, signOut, getSKT, deleteSKT }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
