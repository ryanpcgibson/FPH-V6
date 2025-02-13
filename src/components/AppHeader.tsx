import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Link } from "react-router-dom";
import FPHLogo from "@/assets/Logo1.svg";
import { Card } from "./ui/card";

const AppHeader: React.FC = () => {

  let selectedFamilyId = null;
  let selectedFamilyName = null;

  try {
    ({ selectedFamilyId, selectedFamilyName } = useFamilyDataContext());
  } catch {}

  return (
    <Card className="w-full flex justify-end rounded-t-none">
      <div
        className="whitespace-nowrap flex items-center px-2"
        id="app-header-text-container"
      >
        <Link
          to={`/app/family/${selectedFamilyId}`}
          className="text-xl font-bold text-primary-foreground"
        >
          {selectedFamilyName && `The ${selectedFamilyName} Family`}
        </Link>
      </div>
      <div
        className="whitespace-nowrap flex items-center px-2"
        id="app-header-text-container"
      >
        <Link
          to={`/app/family/${selectedFamilyId}`}
          className="text-xl font-bold text-primary-foreground"
        >
          <img src={FPHLogo} alt="FPH Logo" className="h-8 w-8" />
        </Link>
      </div>
    </Card>
  );
};

export default AppHeader;
