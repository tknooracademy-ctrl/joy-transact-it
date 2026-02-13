import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DonationSuccess = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-6">
        <CheckCircle className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">Thank You!</h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
        Your donation has been received. Your generosity makes a real difference — thank you for your support!
      </p>
      <Button onClick={() => navigate("/")} size="lg" className="h-12 text-base font-semibold">
        Back to Home
      </Button>
    </main>
  );
};

export default DonationSuccess;
