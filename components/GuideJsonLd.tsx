import { JsonLd } from "@/components/JsonLd";
import {
  articleSchema,
  breadcrumbListSchema,
} from "@/lib/schema/jsonld-builders";
import { SITE_CONTENT_REVIEWED_ISO, SITE_URL } from "@/lib/site";

export function GuideJsonLd({
  path,
  headline,
  description,
}: {
  path: string;
  headline: string;
  description: string;
}) {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return (
    <>
      <JsonLd
        data={articleSchema({
          headline,
          description,
          url,
          dateModified: SITE_CONTENT_REVIEWED_ISO,
        })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: headline, path: path.startsWith("/") ? path : `/${path}` },
        ])}
      />
    </>
  );
}
