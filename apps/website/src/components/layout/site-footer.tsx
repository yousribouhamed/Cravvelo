import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "../max-width-wrapper";

const footerSections = {
  contact: [
    { title: "GitHub", href: "https://github.com/cravvelo" },
    { title: "Twitter", href: "https://twitter.com/cravvelo" },
    { title: "المجتمع", href: "/community" },
  ],
  legal: [
    { title: "الأمان", href: "/security" },
    { title: "سياسة الخصوصية", href: "/privacy" },
    { title: "شروط الخدمة", href: "/terms" },
    { title: "سياسة الاستخدام المقبول", href: "/acceptable-use" },
  ],
  company: [
    { title: "حول", href: "/about" },
    { title: "الأسعار", href: "/pricing" },
    { title: "الوظائف", href: "/jobs" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-primary mt-20">
      <MaxWidthWrapper>
        <div className="py-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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
                تواصل
              </h3>
              <ul className="space-y-2">
                {footerSections.contact.map((link) => (
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

            {/* Legal Section */}
            <div>
              <h3 className="text-white font-semibold text-base mb-4" dir="rtl">
                قانوني
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
                الشركة
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
          </div>

          {/* Copyright Section at Bottom */}
          <div className="border-t border-white/20 pt-8">
            <div className="text-center">
              <p className="text-white/80 text-sm">
                © 2024 Cravvelo. جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
