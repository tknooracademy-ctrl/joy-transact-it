import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, ProductCardData } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product extends ProductCardData {
  category_id: string;
  is_best_seller: boolean;
  created_at: string;
}

const Shop = () => {
  const { slug } = useParams<{ slug: string }>();
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "featured");

  useEffect(() => {
    (async () => {
      let query = supabase
        .from("products")
        .select("id, slug, name, images, category_id, is_best_seller, created_at, categories(name, slug), product_variants(price)")
        .eq("is_active", true);
      if (slug) {
        const { data: cat } = await supabase.from("categories").select("id, name").eq("slug", slug).maybeSingle();
        if (cat) {
          query = query.eq("category_id", cat.id);
          setCategoryName(cat.name);
        }
      } else {
        setCategoryName(null);
      }
      const { data } = await query;
      const mapped = (data ?? []).map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        images: p.images,
        category_id: p.category_id ?? "",
        category_name: (p.categories as { name: string } | null)?.name,
        is_best_seller: p.is_best_seller,
        created_at: p.created_at,
        min_price: Math.min(...(p.product_variants ?? []).map((v: { price: number }) => Number(v.price))) || undefined,
      }));
      setProducts(mapped);
    })();
  }, [slug]);

  const filtered = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => (a.min_price ?? 0) - (b.min_price ?? 0)); break;
      case "price-desc": list = [...list].sort((a, b) => (b.min_price ?? 0) - (a.min_price ?? 0)); break;
      case "newest": list = [...list].sort((a, b) => b.created_at.localeCompare(a.created_at)); break;
      case "bestselling": list = [...list].sort((a, b) => Number(b.is_best_seller) - Number(a.is_best_seller)); break;
    }
    return list;
  }, [products, search, sort]);

  const title = categoryName ?? "All Products";

  return (
    <>
      <SEO title={`${title} — KeralaChips`} description={`Shop ${title.toLowerCase()} — authentic Kerala snacks.`} canonical={slug ? `/category/${slug}` : "/shop"} />
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">{filtered.length} products</p>

        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <Input
            placeholder="Search snacks..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setParams({ q: e.target.value, sort }); }}
            className="md:max-w-sm"
          />
          <Select value={sort} onValueChange={(v) => { setSort(v); setParams({ q: search, sort: v }); }}>
            <SelectTrigger className="md:w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="bestselling">Best Selling</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;
