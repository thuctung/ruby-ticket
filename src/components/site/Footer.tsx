import { PHONE_ADMIN } from "@/commons/constant";
import { t } from "@/lib/i18n/t";
import { LangKey } from "@/types";

export default function Footer({ locale }: { locale: LangKey }) {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 text-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-white text-base font-bold mb-4 tracking-wider">RubyTravel </h4>
            <p className="text-neutral-400 leading-relaxed">{t(locale, "common.footer.tagline")}</p>
          </div>
          <div>
            <h4 className="text-white text-base font-bold mb-4 tracking-wider">
              {t(locale, "common.footer.links")}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {t(locale, "common.footer.services")}
                </a>
              </li>
              <li>
                <a href="#sites" className="hover:text-white transition-colors">
                  {t(locale, "common.footer.sites")}
                </a>
              </li>
              <li>
                <a href="#agent" className="hover:text-white transition-colors">
                  {t(locale, "common.footer.agent")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-base font-bold mb-4 tracking-wider">
              {t(locale, "common.footer.policy")}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t(locale, "common.footer.terms")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t(locale, "common.footer.privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t(locale, "common.footer.refund")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-base font-bold mb-4 tracking-wider">
              {t(locale, "common.footer.contact")}
            </h4>
            <p className="leading-relaxed">
              Hotline: <span className="text-white">{PHONE_ADMIN}</span>
              <br />
              Email: <span className="text-white">{process.env.NEXT_PUBLIC_EMAIL_COMPANY}</span>
            </p>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-neutral-900 text-xs text-neutral-600">
          <p>&copy; 2026 Ruby Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
