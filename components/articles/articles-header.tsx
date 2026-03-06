import Link from "next/link";
import Image from "next/image";
import { ArticlesMobileNav } from "./articles-mobile-nav";

const NAV_LINKS = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/#community", label: "Community" },
  { href: "/articles", label: "Articles" },
];

export function ArticlesHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/foot_logo.png"
              alt="GoutWize logo"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <span className="font-heading text-2xl font-bold text-gw-navy">
              Gout<span className="text-gw-blue">Wize</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gw-navy hover:text-gw-blue font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="bg-gw-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-gw-blue-dark transition-colors"
            >
              Join the Community
            </Link>
          </nav>

          <ArticlesMobileNav />
        </div>
      </div>
    </header>
  );
}
