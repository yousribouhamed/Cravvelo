import Head from "next/head";

const DirectoryPage = () => {
  const links = [
    {
      name: "الرئيسية",
      href: "/",
    },
    {
      name: "الخدمات",
      href: "/features",
    },
    {
      name: "معلومات عنا",
      href: "/about-us",
    },
    {
      name: "تواصل معنا",
      href: "/contact-us",
    },
  ];

  return (
    <div>
      <Head>
        <title>كرافيلو - دليل الصفحات</title>
        <meta
          name="description"
          content="استكشف صفحات موقع كرافيلو: الرئيسية، الخدمات، معلومات عنا، وتواصل معنا. اكتشف كيفية استخدام خدمات كرافيلو لتحقيق أقصى استفادة من دوراتك عبر الإنترنت."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "كرافيلو - دليل الصفحات",
              description:
                "استكشف صفحات موقع كرافيلو: الرئيسية، الخدمات، معلومات عنا، وتواصل معنا. اكتشف كيفية استخدام خدمات كرافيلو لتحقيق أقصى استفادة من دوراتك عبر الإنترنت.",
              url: "https://www.cravvelo.com/directory",
              mainEntity: links.map((link) => ({
                "@type": "WebPage",
                name: link.name,
                url: `https://www.cravvelo.com${link.href}`,
              })),
            }),
          }}
        />
      </Head>
      <main>
        <h1>كرافيلو - دليل الصفحات</h1>
        <p>
          استكشف الصفحات المختلفة لموقعنا الإلكتروني وتعرف على المزيد حول خدمات
          كرافيلو.
        </p>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.name}</a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default DirectoryPage;
