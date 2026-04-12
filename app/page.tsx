import HomePageClient from "@/components/HomePageClient";
import { JsonLd, softwareApplicationHomepageSchema } from "@/components/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareApplicationHomepageSchema()} />
      <HomePageClient />
    </>
  );
}
