import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ProductCard, ProductCardData } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import { ArrowRight, Truck, ShieldCheck, Leaf } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

const useHomeData = () => {
  const [featured, setFeatured] = useState<ProductCardData[]>([]);
  const [bestsellers, setBestsellers] = useState<ProductCardData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase
          .from("products")
          .select("id, slug, name, images, is_featured, is_best_seller, product_variants(price)")
          .eq("is_active", true)
          .limit(20),
        supabase.from("categories").select("id, name, slug, image_url").eq("is_active", true).order("sort_order"),
      ]);
      const mapped = (prods ?? []).map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        images: p.images,
        min_price: Math.min(...(p.product_variants ?? []).map((v: { price: number }) => Number(v.price))) || undefined,
        is_featured: p.is_featured,
        is_best_seller: p.is_best_seller,
      }));
      setFeatured(mapped.filter((p) => (p as { is_featured: boolean }).is_featured).slice(0, 8));
      setBestsellers(mapped.filter((p) => (p as { is_best_seller: boolean }).is_best_seller).slice(0, 8));
      setCategories(cats ?? []);
    })();
  }, []);

  return { featured, bestsellers, categories };
};

const Home = () => {
  const { featured, bestsellers, categories } = useHomeData();

  return (
    <>
      <SEO
        title="KeralaChips — Authentic Kerala Snacks Delivered Across India"
        description="Shop banana chips, mixture, murukku, achappam and more. Freshly made in Kerala, delivered pan-India."
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "KeralaChips",
          url: "/",
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent via-background to-secondary">
        <div className="container py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Authentic • Fresh • Delivered</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              A taste of <span className="text-primary">Kerala</span> at your doorstep.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              Handpicked snacks fried in pure coconut oil, packed fresh, shipped across India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/shop">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/category/gift-boxes">Gift Boxes</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-muted">
            <img
              src="https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=1200"
              alt="Kerala banana chips"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="container py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Truck, title: "Free shipping over ₹500", desc: "Delivered across India" },
          { icon: Leaf, title: "Fresh & authentic", desc: "Made in small batches" },
          { icon: ShieldCheck, title: "Secure payments", desc: "UPI, Cards, Netbanking" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="container py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground mt-1">From crunchy classics to sweet indulgences</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((c) => (
            <Link key={c.id} to={`/category/${c.slug}`} className="group">
              <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-2">
                {c.image_url && (
                  <img src={c.image_url} alt={c.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                )}
              </div>
              <p className="text-sm font-medium text-center group-hover:text-primary">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container py-12">
          <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Best sellers */}
      {bestsellers.length > 0 && (
        <section className="container py-12 bg-accent/30 rounded-2xl my-8">
          <h2 className="text-3xl font-bold mb-6 px-4">Best Sellers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
