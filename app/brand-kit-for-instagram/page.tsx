import { MarketingSeoPage } from "@/components/MarketingSeoPage";
import {
  SEO_MARKETING_PAGES,
  metadataForSeoMarketingPage,
} from "@/lib/seo-marketing-pages";

const def = SEO_MARKETING_PAGES["brand-kit-for-instagram"];

export const metadata = metadataForSeoMarketingPage(def);

export default function BrandKitForInstagramPage() {
  return <MarketingSeoPage def={def} />;
}
