import React, { useEffect, useState } from "react";
import { supabaseClient } from "../db/supabaseClient";

interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (user && user.email) {
        setProfile({
          id: user.id,
          email: user.email,
          display_name: user.user_metadata.display_name,
        });
      } else {
        setError("User not authenticated");
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading ...{" "}
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto text-center mt-16">
      <h1 className="text-4xl font-bold">User Profile</h1>
      <div className="mt-4">
        <p className="text-lg">
          <strong>Email:</strong> {profile?.email}
        </p>
        <p className="text-lg">
          <strong>Display Name:</strong> {profile?.display_name}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
