import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const emailSchema = z.string().trim().email().max(255);
const passwordSchema = z.string().min(8).max(100);

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate("/account"); }, [user, navigate]);

  const signIn = async () => {
    if (!emailSchema.safeParse(email).success || !passwordSchema.safeParse(password).success) {
      toast({ title: "Invalid email or password", variant: "destructive" }); return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    else navigate("/account");
  };

  const signUp = async () => {
    if (!emailSchema.safeParse(email).success || !passwordSchema.safeParse(password).success) {
      toast({ title: "Invalid email or password (min 8 chars)", variant: "destructive" }); return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    else toast({ title: "Account created", description: "Check your email to verify." });
  };

  const forgot = async () => {
    if (!emailSchema.safeParse(email).success) {
      toast({ title: "Enter your email first", variant: "destructive" }); return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast({ title: error.message, variant: "destructive" });
    else toast({ title: "Password reset email sent" });
  };

  return (
    <>
      <SEO title="Sign in — KeralaChips" canonical="/auth" />
      <div className="container py-16 max-w-md">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-1">Welcome</h1>
          <p className="text-muted-foreground mb-6 text-sm">Sign in or create an account to shop faster and track orders.</p>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-3 mt-4">
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <Button className="w-full" onClick={signIn} disabled={loading}>Sign in</Button>
              <button className="text-sm text-primary hover:underline" onClick={forgot}>Forgot password?</button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-3 mt-4">
              <div><Label>Full name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" /></div>
              <Button className="w-full" onClick={signUp} disabled={loading}>Create account</Button>
            </TabsContent>
          </Tabs>
        </Card>
        <p className="text-xs text-center text-muted-foreground mt-4">
          By continuing you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </>
  );
};

export default Auth;
