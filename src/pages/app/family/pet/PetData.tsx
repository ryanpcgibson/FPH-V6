// =import React from "react";
// import { Outlet, useParams, Navigate, useLocation } from "react-router-dom";
// import { PetDataProvider } from "@/context/PetDataContext";
// import { useFamilyDataContext } from "@/context/FamilyDataContext";

// const PetDataProvider: React.FC = () => {
//   const {
//     familyData,
//     isLoading: isFamilyLoading,
//     error: familyError,
//   } = useFamilyDataContext();
//   const { petId: petIdParam } = useParams<{ petId: string }>();
//   const location = useLocation();

//   if (!petIdParam && familyData?.pets && familyData.pets.length > 0) {
//     const defaultPetId = familyData.pets[0].id;
//     const newPath = location.pathname.replace("/pet", `/pet/${defaultPetId}`);
//     return <Navigate to={newPath} replace />;
//   }

//   const petId = petIdParam ? parseInt(petIdParam, 10) : null;

//   if (petId === null || isNaN(petId)) {
//     return <div>Error: Invalid Pet ID</div>;
//   }

//   return (
//     <PetDataProvider petId={petId}>
//       <Outlet context={{ petId }} />
//     </PetDataProvider>
//   );
// };

// export default PetDataProvider;
