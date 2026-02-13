import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DonationCancel = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
        <XCircle className="w-10 h-10 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">Donation Cancelled</h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
        No worries — you haven't been charged. Feel free to come back anytime you'd like to contribute.
      </p>
      <Button onClick={() => navigate("/")} size="lg" className="h-12 text-base font-semibold">
        Try Again
      </Button>
    </main>
  );
};

export default DonationCancel;
