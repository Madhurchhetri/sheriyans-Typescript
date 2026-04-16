import { formatPrice } from "./format";

export const getPrice = (product) => {
  if (product?.priceAmount != null) {
    return formatPrice(product.priceAmount, product.priceCurrency);
  }

  if (typeof product?.price === "number") {
    return formatPrice(product.price, product.currency || "USD");
  }

  if (product?.price?.amount) {
    return formatPrice(product.price.amount, product.price.currency);
  }

  return null;
};

export const timeAgo = (dateStr) => {
  if (!dateStr) return "";

  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;

  return new Date(dateStr).toLocaleDateString();
};