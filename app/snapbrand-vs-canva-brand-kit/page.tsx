import { MarketingSeoPage } from "@/components/MarketingSeoPage";
import {
  SEO_MARKETING_PAGES,
  metadataForSeoMarketingPage,
} from "@/lib/seo-marketing-pages";

const def = SEO_MARKETING_PAGES["snapbrand-vs-canva-brand-kit"];

export const metadata = metadataForSeoMarketingPage(def);

export default function SnapbrandVsCanvaBrandKitPage() {
  return <MarketingSeoPage def={def} />;
}
