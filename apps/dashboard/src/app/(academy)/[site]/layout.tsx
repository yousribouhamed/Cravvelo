import Providers from "@/src/components/Providers";
import "@ui/styles/globals.css";
import { Metadata } from "next";
import Head from "next/head";
import { getSiteData } from "../_actions";
import { getSubDomainValue } from "../lib";

export const fetchCache = "force-no-store";

export async function generateMetadata({
  params,
}: {
  params: { site: string };
}): Promise<Metadata | null> {
  const subdomain = getSubDomainValue({ value: params.site });

  const data = await getSiteData({ subdomain });

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

    icons: [favicon],
    metadataBase: new URL(`https://${subdomain}`),
    // Optional: Set canonical URL to custom domain if it exists
    ...(params.site.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
      data.customDomain && {
        alternates: {
          canonical: `https://${data.customDomain}`,
        },
      }),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { site: string };
}) {
  const subdomain = getSubDomainValue({ value: params.site });

  const data = await getSiteData({ subdomain });

  // fetch the website
  return (
    <>
      <Head>
        <title>{data?.name}</title>
        <link rel="icon" type="image/x-icon" href={data?.favicon} />
      </Head>
      <Providers>
        <body className={` antialiased bg-zinc-50 h-fit min-h-screen`}>
          {children}
          {/* <AcademiaFooter /> */}
        </body>
      </Providers>
    </>
  );
}
