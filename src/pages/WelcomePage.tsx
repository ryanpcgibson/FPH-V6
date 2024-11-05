import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";

const WelcomePage = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen p-4 ">
      <div className="w-full max-w-md mb-8 md:mb-0 md:mr-8">
        <h1 className="text-4xl font-bold mb-4">Family Pet History</h1>
        <p className="text-lg">
          This app works best in landscape (wide) mode on smaller screens.
          Please sign in with email and password provided.
        </p>
      </div>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePage;
