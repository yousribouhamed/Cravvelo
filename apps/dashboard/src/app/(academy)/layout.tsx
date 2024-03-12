import "@ui/styles/globals.css";
import "@ui/font/stylesheet.css";
import type { Metadata } from "next";
import Providers from "@/src/components/Providers";
import Script from "next/script";
import { getSiteData } from "./_actions";
import AcademiaFooter from "./_components/layout/academy-footer";

export const fetchCache = "force-no-store";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData({ subdomain: domain });
  if (!data) {
    return null;
  }
  const { name: title, description, favicon, logo } = data;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ["/opengraph-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image.png"],
    },

    icons: [favicon ?? "/favicon-placeholder.png"],
    metadataBase: new URL(`https://${domain}`),
    // Optional: Set canonical URL to custom domain if it exists
    ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
      data.customDomain && {
        alternates: {
          canonical: `https://${data.customDomain}`,
        },
      }),
  };
}

//

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning dir="rtl" lang="ar">
      <head />
      <Providers>
        <body className={` antialiased bg-zinc-50 h-fit min-h-screen`}>
          {children}
          <AcademiaFooter />
        </body>
      </Providers>

      <Script
        src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"
        async
      />
    </html>
  );
}
