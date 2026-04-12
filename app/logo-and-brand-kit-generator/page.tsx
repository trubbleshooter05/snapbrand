import { MarketingSeoPage } from "@/components/MarketingSeoPage";
import {
  SEO_MARKETING_PAGES,
  metadataForSeoMarketingPage,
} from "@/lib/seo-marketing-pages";

const def = SEO_MARKETING_PAGES["logo-and-brand-kit-generator"];

export const metadata = metadataForSeoMarketingPage(def);

export default function LogoAndBrandKitGeneratorPage() {
  return <MarketingSeoPage def={def} />;
}
