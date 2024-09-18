import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";

const WelcomePage = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md mb-8 md:mb-0 md:mr-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our App</h1>
        <p className="text-lg">
          This is a brief introduction to our application. Here you can find information about its features and how to get started.
        </p>
      </div>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Sign In</h2>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePage;
