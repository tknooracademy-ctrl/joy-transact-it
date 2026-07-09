import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";

interface Order { id: string; order_number: string; total: number; status: string; created_at: string; }

const Orders = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [user, loading, navigate]);
  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("id, order_number, total, status, created_at").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders((data as Order[]) ?? []);
    });
  }, [user]);

  return (
    <>
      <SEO title="My Orders — KeralaChips" />
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>
        {orders.length === 0 ? (
          <p className="text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Card key={o.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">#{o.order_number}</p>
                  <p className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{Number(o.total).toFixed(2)}</p>
                  <Badge variant="secondary" className="capitalize">{o.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default Orders;
