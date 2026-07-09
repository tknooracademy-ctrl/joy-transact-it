import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (password.length < 8) { toast({ title: "Password must be at least 8 characters", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) toast({ title: error.message, variant: "destructive" });
    else { toast({ title: "Password updated" }); navigate("/account"); }
  };

  return (
    <>
      <SEO title="Reset Password — KeralaChips" />
      <div className="container py-16 max-w-md">
        <Card className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <div><Label>New password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button className="w-full" onClick={submit} disabled={loading}>Update password</Button>
        </Card>
      </div>
    </>
  );
};
export default ResetPassword;
