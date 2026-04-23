import { Metadata } from "next";
import Script from "next/script";
import { getResourceMetadata } from "@/config/seo-metadata";
import { generateBreadcrumbSchema, generateCanonicalUrl } from "@/lib/seo-utils";

interface CreateResourcePageOptions {
  slug: string;
  clientComponent: React.ComponentType<any>;
  getInitialProps?: (supabase: any, user: any) => Promise<Record<string, any>>;
}

export async function createResourcePageMetadata(slug: string): Promise<Metadata> {
  const resourceMeta = getResourceMetadata(slug);
  return {
    title: resourceMeta.title,
    description: resourceMeta.description,
  };
}

export function createResourcePageComponent(
  slug: string,
  ClientComponent: React.ComponentType<any>,
  getInitialProps?: (supabase: any, user: any) => Promise<Record<string, any>>
) {
  return async function ResourcePage(props: any) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
    const isSaved = savedResources.includes(slug);

    const initialProps = getInitialProps
      ? await getInitialProps(supabase, user)
      : {};

    const resourceMeta = getResourceMetadata(slug);
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: "Home", url: "https://crispyleaders.com" },
      { name: "Resources", url: "https://crispyleaders.com/resources" },
      { name: resourceMeta.title.split(" — ")[0], url: generateCanonicalUrl(`/resources/${slug}`) },
    ]);

    return (
      <>
        <Script
          id={`breadcrumb-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <ClientComponent {...initialProps} isSaved={isSaved} />
      </>
    );
  };
}
