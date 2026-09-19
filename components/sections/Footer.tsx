import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";

/** Five link groups, matching the structural reference's footer. */
const groups: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "How it folds", href: "/#how-it-works" },
      { label: "Benefits", href: "/benefits" },
      { label: "Comparison", href: "/#comparison" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Shipping policy", href: "/shipping-policy" },
      { label: "Refund policy", href: "/refund-policy" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Track an order", href: "/track" },
      { label: "Returns & claims", href: "/claims-policy" },
      { label: "Sign in", href: "/account/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookie-policy" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

const socials: { name: IconName; href: string; label: string }[] = [
  { name: "instagram", href: site.socials.instagram, label: "Instagram" },
  { name: "tiktok", href: site.socials.tiktok, label: "TikTok" },
  { name: "facebook", href: site.socials.facebook, label: "Facebook" },
  { name: "youtube", href: site.socials.youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="grain relative bg-bark-deep px-5 pt-16 pb-[calc(env(safe-area-inset-bottom)+2rem)] text-oat-soft sm:px-8">
      <div className="relative mx-auto max-w-310">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          {/* Brand + newsletter */}
          <div className="max-w-sm">
            <Logo variant="light" />
            <p className="mt-4 text-[0.92rem] leading-[1.65] text-oat-mute">
              {site.description}
            </p>
            <div className="mt-7">
              <NewsletterForm />
            </div>
          </div>

          {/* Link groups */}
          <nav
            aria-label="Footer"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="font-label text-[0.68rem] font-bold tracking-[0.16em] text-oat uppercase">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-[0.9rem] text-oat-mute transition-colors duration-300 hover:text-oat"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t border-bark-line pt-7 sm:flex-row">
          <p className="text-[0.78rem] text-oat-mute">
            © {new Date().getFullYear()} {site.legalName}. {site.address}.
          </p>
          <ul className="flex items-center gap-2">
            {socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full text-oat-mute transition-colors duration-300 hover:bg-white/10 hover:text-oat"
                >
                  <Icon name={s.name} className="size-4.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
