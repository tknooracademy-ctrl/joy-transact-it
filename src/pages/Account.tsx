import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [user, loading, navigate]);
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setFullName(data.full_name ?? ""); setPhone(data.phone ?? ""); }
    });
  }, [user]);

  if (!user) return null;

  const save = async () => {
    const { error } = await supabase.from("profiles").update({ full_name: fullName, phone }).eq("id", user.id);
    if (error) toast({ title: error.message, variant: "destructive" });
    else toast({ title: "Profile saved" });
  };

  return (
    <>
      <SEO title="My Account — KeralaChips" />
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Link to="/account" className="block p-3 rounded-lg bg-accent font-medium">Profile</Link>
            <Link to="/account/orders" className="block p-3 rounded-lg hover:bg-accent/50">Orders</Link>
            <Link to="/wishlist" className="block p-3 rounded-lg hover:bg-accent/50">Wishlist</Link>
            <Button variant="ghost" className="w-full justify-start" onClick={async () => { await signOut(); navigate("/"); }}>Sign out</Button>
          </div>
          <Card className="md:col-span-2 p-6 space-y-4">
            <h2 className="font-semibold text-lg">Profile</h2>
            <div><Label>Email</Label><Input value={user.email ?? ""} disabled /></div>
            <div><Label>Full name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <Button onClick={save}>Save changes</Button>
          </Card>
        </div>
      </div>
    </>
  );
};
export default Account;
