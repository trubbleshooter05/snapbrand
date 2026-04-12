import {
  articleSchema,
  breadcrumbListSchema,
} from "@/lib/schema/jsonld-builders";
import { SITE_CONTENT_REVIEWED_ISO, SITE_URL, getDefaultArticleByline } from "@/lib/site";
import type { SeoMarketingPageDef } from "@/lib/seo-marketing-pages";
import { JsonLd } from "@/components/JsonLd";
import SeoTemplatePage from "@/components/SeoTemplatePage";

export function MarketingSeoPage({ def }: { def: SeoMarketingPageDef }) {
  const articleMeta = getDefaultArticleByline();
  const pageUrl = `${SITE_URL}${def.path}`;

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: def.h1,
          description: def.description,
          url: pageUrl,
          dateModified: SITE_CONTENT_REVIEWED_ISO,
        })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: def.h1, path: def.path },
        ])}
      />
      <SeoTemplatePage
        eyebrow={def.eyebrow}
        h1={def.h1}
        intro={def.intro}
        sections={def.sections}
        relatedPages={def.relatedPages}
        articleMeta={articleMeta}
      />
    </>
  );
}
