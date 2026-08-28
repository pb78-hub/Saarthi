"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GovernmentContextMark } from "@/components/GovernmentContextMark";
import { LanguagePicker } from "@/components/LanguagePicker";

const links = [
  ["/", "Home"],
  ["/file", "File a grievance"],
  ["/track", "Track status"],
  ["/faq", "Help"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedMobile = localStorage.getItem("saarthi_mobile");

    if (savedMobile) {
      setMobile(savedMobile);
    }

    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("saarthi_mobile");
    localStorage.removeItem("saarthi_user");

    setMobile("");
    setIsMenuOpen(false);

    router.push("/");
    router.refresh();
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">

        <div className="identity-row">
          <div className="department-context">
            <GovernmentContextMark />

            <p>
              <span>
                Public grievance process guide
              </span>

              <strong>
                Department of Administrative Reforms &amp;
                Public Grievances
              </strong>
            </p>
          </div>

          <div className="header-actions">
            <LanguagePicker />

            {mounted && mobile ? (
              <div className="user-actions">
                <span className="user-mobile">
                  {mobile}
                </span>

                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="login-button"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        <nav
          aria-label="Main navigation"
          className="main-nav"
        >
          <div className="brand-group">

            <div className="page-menu">
              <button
                className="menu-trigger"
                type="button"
                aria-expanded={isMenuOpen}
                aria-controls="page-menu"
                onClick={() =>
                  setIsMenuOpen(!isMenuOpen)
                }
              >
                <span
                  className="menu-dots"
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                </span>

                <span>
                  Pages
                </span>
              </button>

              {isMenuOpen && (
                <div
                  className="page-menu-panel"
                  id="page-menu"
                  role="menu"
                  aria-label="Choose a page"
                >
                  {links.map(([href, label]) => (
                    <Link
                      role="menuitem"
                      aria-current={
                        pathname === href
                          ? "page"
                          : undefined
                      }
                      className={
                        pathname === href
                          ? "active"
                          : ""
                      }
                      href={href}
                      key={href}
                      onClick={() =>
                        setIsMenuOpen(false)
                      }
                    >
                      {label}
                    </Link>
                  ))}

                  {mounted && mobile ? (
                    <button
                      type="button"
                      className="mobile-logout-button"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      role="menuitem"
                      onClick={() =>
                        setIsMenuOpen(false)
                      }
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>

            <Link
              className="wordmark"
              href="/"
            >
              Saarthi
              <span>·</span>
            </Link>
          </div>

          <div className="nav-links">
            {links.map(([href, label]) => (
              <Link
                aria-current={
                  pathname === href
                    ? "page"
                    : undefined
                }
                className={
                  pathname === href
                    ? "active"
                    : ""
                }
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

      </div>
    </header>
  );
}