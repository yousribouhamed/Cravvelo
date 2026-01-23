"use client";

import Image from "next/image";
import { Link } from "@/src/lib/i18n/routing";
import MaxWidthWrapper from "../max-width-wrapper";
import LanguageSwitcher from "../language-switcher";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tLinks = useTranslations("footer.links");
  const tSections = useTranslations("footer.sections");

  const footerSections = {
    contact: [
      { title: "GitHub", href: "https://github.com/cravvelo" },
      { title: "Twitter", href: "https://twitter.com/cravvelo" },
      { title: tLinks("community"), href: "/community" },
    ],
    legal: [
      { title: tLinks("security"), href: "/security" },
      { title: tLinks("privacy"), href: "/privacy" },
      { title: tLinks("terms"), href: "/terms" },
      { title: tLinks("acceptableUse"), href: "/acceptable-use" },
    ],
    company: [
      { title: tLinks("about"), href: "/about" },
      { title: tLinks("pricing"), href: "/pricing" },
      { title: tLinks("jobs"), href: "/jobs" },
    ],
  };

  return (
    <footer className="w-full bg-primary mt-20">
      <MaxWidthWrapper>
        <div className="py-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Logo Section */}
            <div className="lg:col-span-1">
              <div className="flex flex-col items-center md:items-start">
                <Image
                  src="/white-cravvelo-logo.svg"
                  alt="Cravvelo Logo"
                  width={180}
                  height={60}
                  className="h-auto mb-4"
                />
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-white font-semibold text-base mb-4" dir="rtl">
                {tSections("contact")}
              </h3>
              <ul className="space-y-2">
                {footerSections.contact.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-white text-sm transition-colors"
                      >
                        {link.title}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white/80 hover:text-white text-sm transition-colors"
                      >
                        {link.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="text-white font-semibold text-base mb-4" dir="rtl">
                {tSections("legal")}
              </h3>
              <ul className="space-y-2">
                {footerSections.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-white text-sm transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="text-white font-semibold text-base mb-4" dir="rtl">
                {tSections("company")}
              </h3>
              <ul className="space-y-2">
                {footerSections.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-white text-sm transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Language Switcher Section */}
            <div>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Copyright Section at Bottom */}
          <div className="border-t border-white/20 pt-8">
            <div className="text-center">
              <p className="text-white/80 text-sm">
                {t("copyright")}
              </p>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
