import type { Metadata } from "next";
import ShopPageClient from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Oslo Vikings – Shop",
  description: "Browse and purchase official Oslo Vikings merchandise.",
};

export default function ShopPage() {
  return <ShopPageClient />;
}
