import SeoTemplatePage from "@/components/SeoTemplatePage";
import {
  SEO_MARKETING_PAGES,
  metadataForSeoMarketingPage,
} from "@/lib/seo-marketing-pages";

const def = SEO_MARKETING_PAGES["snapbrand-vs-looka"];

export const metadata = metadataForSeoMarketingPage(def);

export default function SnapbrandVsLookaPage() {
  return (
    <SeoTemplatePage
      eyebrow={def.eyebrow}
      h1={def.h1}
      intro={def.intro}
      sections={def.sections}
      relatedPages={def.relatedPages}
    />
  );
}
