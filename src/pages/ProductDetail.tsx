import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Minus, Plus, Truck, ShieldCheck } from "lucide-react";

interface Variant { id: string; weight_label: string; price: number; compare_at_price: number | null; stock: number; }
interface Product {
  id: string; slug: string; name: string; description: string | null; ingredients: string | null;
  shelf_life: string | null; storage: string | null; fssai_number: string | null; brand: string | null;
  country_of_origin: string; images: string[] | null; nutrition: unknown;
  product_variants: Variant[];
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCart((s) => s.addItem);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (data) {
        const p = data as unknown as Product;
        p.product_variants = (p.product_variants ?? []).sort((a, b) => a.price - b.price);
        setProduct(p);
        setSelectedVariant(p.product_variants[0] ?? null);
      }
    })();
  }, [slug]);

  if (!product) return <div className="container py-20 text-center">Loading...</div>;

  const handleAdd = () => {
    if (!selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      variantLabel: selectedVariant.weight_label,
      price: Number(selectedVariant.price),
      image: product.images?.[0],
    }, qty);
    toast({ title: "Added to cart", description: `${product.name} (${selectedVariant.weight_label}) × ${qty}` });
  };

  const handleBuyNow = () => { handleAdd(); navigate("/checkout"); };

  return (
    <>
      <SEO
        title={`${product.name} — KeralaChips`}
        description={product.description ?? undefined}
        canonical={`/product/${product.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.images,
          brand: product.brand,
          offers: selectedVariant && {
            "@type": "Offer",
            price: selectedVariant.price,
            priceCurrency: "INR",
            availability: selectedVariant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        }}
      />
      <div className="container py-10 grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
            {product.images?.[activeImage] && (
              <img src={product.images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
            )}
          </div>
          {(product.images?.length ?? 0) > 1 && (
            <div className="flex gap-2">
              {product.images!.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`h-20 w-20 rounded-lg overflow-hidden border-2 ${i === activeImage ? "border-primary" : "border-transparent"}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand && <p className="text-sm uppercase tracking-widest text-muted-foreground">{product.brand}</p>}
          <h1 className="text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
          {product.description && <p className="mt-4 text-muted-foreground">{product.description}</p>}

          {selectedVariant && (
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">₹{selectedVariant.price}</span>
              {selectedVariant.compare_at_price && (
                <span className="text-lg line-through text-muted-foreground">₹{selectedVariant.compare_at_price}</span>
              )}
              {selectedVariant.stock > 0
                ? <Badge variant="secondary">In stock</Badge>
                : <Badge variant="destructive">Out of stock</Badge>}
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Weight</p>
            <div className="flex flex-wrap gap-2">
              {product.product_variants.map((v) => (
                <Button
                  key={v.id}
                  variant={selectedVariant?.id === v.id ? "default" : "outline"}
                  onClick={() => setSelectedVariant(v)}
                >
                  {v.weight_label} · ₹{v.price}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="icon" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <Button variant="ghost" size="icon" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
            <Button onClick={handleAdd} className="flex-1" size="lg">
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button onClick={handleBuyNow} variant="secondary" size="lg">Buy Now</Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Truck className="h-4 w-4" /> Free shipping over ₹500</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4" /> Secure Razorpay checkout</div>
          </div>

          <div className="mt-8 space-y-4 text-sm">
            {product.ingredients && <div><span className="font-semibold">Ingredients: </span>{product.ingredients}</div>}
            {product.shelf_life && <div><span className="font-semibold">Shelf life: </span>{product.shelf_life}</div>}
            {product.storage && <div><span className="font-semibold">Storage: </span>{product.storage}</div>}
            {product.fssai_number && <div><span className="font-semibold">FSSAI: </span>{product.fssai_number}</div>}
            <div><span className="font-semibold">Country of origin: </span>{product.country_of_origin}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
