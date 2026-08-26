"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [["/", "Home"], ["/file", "File a grievance"], ["/track", "Track status"], ["/faq", "Help"]];
export function SiteHeader() {
  const pathname = usePathname();
  return <header className="site-header"><nav aria-label="Main navigation"><Link className="wordmark" href="/">Saarthi<span>·</span></Link><div className="nav-links">{links.map(([href, label]) => <Link aria-current={pathname === href ? "page" : undefined} className={pathname === href ? "active" : ""} href={href} key={href}>{label}</Link>)}</div></nav></header>;
}
