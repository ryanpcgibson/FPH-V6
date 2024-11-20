// import React, { createContext, useContext, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { supabaseClient } from "@/db/supabaseClient";
// import { Families } from "@/db/db_types";

// const FamiliesContext = createContext<
//   | {
//       families: Families | undefined;
//       isLoading: boolean;
//       isError: boolean;
//       error: Error | null;
//     }
//   | undefined
// >(undefined);

// export const FamiliesProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const familiesQuery = useQuery({
//     queryKey: ["families"],
//     queryFn: async () => {
//       const { data, error } = await supabaseClient.rpc("get_families");
//       if (error) throw new Error(error.message);
//       if (!data) throw new Error("No data returned from the database");
//       return data as Families;
//     },
//   });

//   const contextValue = useMemo(
//     () => ({
//       families: familiesQuery.data,
//       isLoading: familiesQuery.isLoading,
//       isError: familiesQuery.isError,
//       error: familiesQuery.error,
//     }),
//     [familiesQuery]
//   );

//   return (
//     <FamiliesContext.Provider value={contextValue}>
//       {children}
//     </FamiliesContext.Provider>
//   );
// };

// export const useUserFamiliesContext = (): {
//   families: Families | undefined;
//   isLoading: boolean;
//   isError: boolean;
//   error: Error | null;
// } => {
//   const context = useContext(FamiliesContext);
//   if (context === undefined) {
//     throw new Error("useFamilies must be used within a FamiliesProvider");
//   }
//   return context;
// };

// export default FamiliesProvider;
