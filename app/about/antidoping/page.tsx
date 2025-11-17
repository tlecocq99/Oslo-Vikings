import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, ClipboardCheck, Scale, FileText } from "lucide-react";

const commitments = [
  {
    title: "Clean Sport First",
    description:
      "We comply with all regulations set by Antidoping Norway (ADNO) and the Norwegian Olympic and Paralympic Committee.",
    icon: ShieldCheck,
  },
  {
    title: "Education",
    description:
      "Players, coaches, and parents receive yearly guidance on supplements, testing procedures, and risk reduction.",
    icon: ClipboardCheck,
  },
  {
    title: "Fair Process",
    description:
      "We respect the rights of athletes through transparent communication, due diligence, and support during any case.",
    icon: Scale,
  },
];

const resources = [
  {
    title: "Antidoping Norway",
    description:
      "Official national guidelines, prohibited lists, and reporting tools.",
    href: "https://www.antidoping.no",
  },
  {
    title: "WADA Prohibited List",
    description:
      "Up-to-date overview of substances and methods banned in sport.",
    href: "https://www.wada-ama.org/en/resources/prohibited-list",
  },
  {
    title: "Clean Sport Education Portal",
    description: "E-learning modules for athletes, support staff, and parents.",
    href: "https://renutover.no",
  },
  {
    title: "Report a Concern",
    description: "Confidential whistleblowing channel via Antidoping Norway.",
    href: "https://www.antidoping.no/tips",
  },
];

export default function AntidopingPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-viking-charcoal/80 transition-colors">
        <section className="relative isolate overflow-hidden bg-[url('/images/backgrounds/teamClose.avif')] bg-cover bg-center">
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"
            aria-hidden
          />
          <div className="relative mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-viking-red">
              Integrity & Compliance
            </p>
            <h1 className="mt-4 font-Anton_SC text-4xl font-bold text-white sm:text-5xl">
              Antidoping Commitment
            </h1>
            <p className="mt-6 max-w-3xl text-base text-gray-200 sm:text-lg">
              The Oslo Vikings are dedicated to a clean and fair competition
              environment. We follow national and international antidoping
              frameworks and provide proactive education for every member of our
              community.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-viking-charcoal/90">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-viking-charcoal dark:text-gray-100">
              What Clean Sport Means to Us
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-gray-700 dark:text-gray-300">
              Every Viking accepts personal responsibility for competing clean.
              The club supports that commitment with structure, resources, and
              accountability.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {commitments.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-viking-charcoal/70"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-viking-red/90">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-viking-charcoal dark:text-gray-100">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-viking-charcoal/70">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-viking-charcoal dark:text-gray-100">
              Practical Guidance
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-viking-charcoal/80">
                <h3 className="text-2xl font-semibold text-viking-charcoal dark:text-gray-100">
                  Testing Procedures
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Athletes in all Oslo Vikings programs, including youth, may be
                  subject to in-competition or out-of-competition testing.
                  Always keep identification on hand, report immediately to
                  doping control when notified, and log medications in the ADAMS
                  whereabouts system when applicable.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-viking-charcoal/80">
                <h3 className="text-2xl font-semibold text-viking-charcoal dark:text-gray-100">
                  Supplements & Medication
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Supplements carry risk of contamination. Consult Antidoping
                  Norway’s supplement guide, use batch-tested products, and keep
                  receipts. For medical use exemptions (TUE), coordinate with
                  our medical staff before treatment begins.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-viking-charcoal/90">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-viking-charcoal dark:text-gray-100">
              Helpful Resources
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {resources.map((resource) => (
                <div
                  key={resource.title}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-lg dark:border-white/10 dark:bg-viking-charcoal/70"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-viking-red/90">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-viking-charcoal dark:text-gray-100">
                    {resource.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {resource.description}
                  </p>
                  <Link
                    target="_blank"
                    href={resource.href}
                    className="mt-3 inline-flex items-center text-sm font-semibold text-viking-red underline decoration-2 underline-offset-4 hover:text-viking-red/80"
                  >
                    Visit resource
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
