import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  images: string[] | null;
  min_price?: number;
  category_name?: string;
}

export const ProductCard = ({ product }: { product: ProductCardData }) => (
  <Link to={`/product/${product.slug}`} className="group">
    <Card className="overflow-hidden border-border/60 transition-shadow hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-muted">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        {product.category_name && (
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{product.category_name}</p>
        )}
        <h3 className="font-semibold line-clamp-1 group-hover:text-primary">{product.name}</h3>
        {product.min_price !== undefined && (
          <p className="mt-2 font-bold text-primary">From ₹{product.min_price}</p>
        )}
      </div>
    </Card>
  </Link>
);
