import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function buildAmazonUrl(asin: string, tag = "crivocerto-20"): string {
  return `https://www.amazon.com.br/dp/${asin}?tag=${tag}`;
}

export function buildMercadoLivreUrl(productId: string): string {
  return `https://www.mercadolivre.com.br/p/${productId}?partner=crivocerto`;
}
