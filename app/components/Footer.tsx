import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin } from "lucide-react";
import { TikTokIcon } from "./TikTokIcon";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo and Description */}
          <div className={styles.brandColumn}>
            <div className={styles.brandHeader}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/images/logo-white.png"
                  alt="Oslo Vikings Logo"
                  width={48}
                  height={48}
                  className={styles.logoImage}
                />
              </div>
              <div className={styles.logoText}>
                <div>
                  <span className={styles.logoPrimary}>Oslo Vikings</span>
                </div>
                <div className={styles.socialLinks}>
                  <Link
                    href="https://www.tiktok.com/@oslovikings"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Oslo Vikings on TikTok"
                    className={styles.socialLink}
                  >
                    <TikTokIcon
                      className={`${styles.socialLinkIcon} ${styles.socialLinkIconTikTok}`}
                    />
                  </Link>
                  <Link
                    href="https://www.facebook.com/OsloVikings"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Oslo Vikings on Facebook"
                    className={styles.socialLink}
                  >
                    <Facebook className={styles.socialLinkIcon} />
                  </Link>
                  <Link
                    href="https://www.instagram.com/oslovikings/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Oslo Vikings on Instagram"
                    className={styles.socialLink}
                  >
                    <Instagram className={styles.socialLinkIcon} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.linksList}>
              <li>
                <Link href="/news" className={styles.link}>
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/team" className={styles.link}>
                  Teams Info Hub
                </Link>
              </li>
              <li>
                <Link
                  href="https://amerikanskeidretter.no/amerikansk-fotball/"
                  className={styles.link}
                  target="_blank"
                >
                  Amerikansk Fotball Norge
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.link}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={styles.sectionTitle}>Contact</h3>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <span className={styles.contactText}>Oslo, Norway</span>
              </div>
              <div className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <span className={styles.contactText}>
                  styret@oslovikings.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <p className={styles.dividerText}>
            © {new Date().getFullYear()} Oslo Vikings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
