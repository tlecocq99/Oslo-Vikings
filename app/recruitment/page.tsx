import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trophy, Users, Zap, Target } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata = { title: "Join Oslo Vikings" };

export default function RecruitmentPage() {
  const benefits = [
    {
      icon: Users,
      title: "Inclusive Teams",
      desc: "Senior Elite, D2, U17, U14 & Flag – a place for every level.",
    },
    {
      icon: Trophy,
      title: "Championship Culture",
      desc: "Train with experienced coaches focused on development.",
    },
    {
      icon: Zap,
      title: "Elite Facilities",
      desc: "Modern training environment and performance mindset.",
    },
    {
      icon: Target,
      title: "Clear Pathway",
      desc: "Progress from youth to senior competition within one club.",
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <section className="dark:bg-gray-800 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-viking-charcoal dark:text-gray-200 mb-6 relative after:content-[''] after:block after:h-1 after:w-24 after:bg-viking-red after:rounded-full after:mx-auto after:mt-4">
              Join Oslo Vikings
            </h1>
            <p className="text-xl text-viking-charcoal/80 dark:text-gray-300/80 max-w-3xl mx-auto mb-6">
              Ready to put on the helmet? We welcome new and experienced players
              across all age groups and competition levels.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-viking-red hover:bg-viking-red-dark text-white px-8 py-6 text-lg font-semibold"
            >
              <Link href="#apply">Apply Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white px-8 py-6 text-lg font-semibold"
            >
              <Link href="#faq">Questions?</Link>
            </Button>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-viking-charcoal/80 transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-lg p-6 text-center  hover:shadow-lg transition"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-viking-red flex items-center justify-center">
                    <b.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-viking-charcoal mb-2">
                    {b.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>

            <div id="apply" className="max-w-3xl mx-auto mb-20 text-center">
              <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-200 mb-4">
                How to Join
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Fill out our short interest form and a team coordinator will
                follow up with training times, equipment guidance, and next
                steps.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-viking-gold hover:bg-viking-gold-dark text-viking-charcoal font-semibold px-10 py-6 text-lg"
              >
                <Link href="https://forms.gle/example" target="_blank">
                  Open Interest Form
                </Link>
              </Button>
            </div>

            <div id="faq" className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-viking-charcoal dark:text-gray-200 tracking-tight mb-4 relative inline-block after:content-[''] after:block after:h-1 after:w-24 after:bg-viking-red after:rounded-full after:mx-auto after:mt-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-viking-charcoal/70 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
                  {/* Text here if you want it */}
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-viking-red/10 shadow-xl rounded-xl p-4 sm:p-8">
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem
                    value="item-1"
                    className="rounded-lg border border-gray-200 bg-gray-50 dark:border-viking-red overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 sm:px-6 text-left text-viking-charcoal dark:bg-gray-800 dark:text-gray-200 font-semibold text-base sm:text-lg">
                      Do I need prior experience?
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 text-gray-600 dark:text-white dark:bg-gray-800 text-sm leading-relaxed">
                      No. We coach fundamentals for every player – beginners are
                      welcome at all levels. Progression is structured and
                      supportive.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-2"
                    className="rounded-lg border border-gray-200 bg-gray-50 dark:border-viking-red overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 sm:px-6 text-left text-viking-charcoal dark:bg-gray-800 dark:text-gray-200 font-semibold text-base sm:text-lg">
                      What equipment do I need?
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 text-gray-600 dark:text-white dark:bg-gray-800 text-sm leading-relaxed">
                      Start with athletic wear and cleats. We’ll guide you on
                      obtaining pads and a helmet once you’re registered. Loaner
                      gear may be available for trial sessions.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-3"
                    className="rounded-lg border border-gray-200 bg-gray-50 dark:border-viking-red overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 sm:px-6 text-left text-viking-charcoal dark:bg-gray-800 dark:text-gray-200 font-semibold text-base sm:text-lg">
                      What does it cost?
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 text-gray-600 dark:text-white dark:bg-gray-800 text-sm leading-relaxed">
                      Fees vary by level and season. Financial assistance and
                      gear support options may be available—ask our coordinators
                      when you apply.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-4"
                    className="rounded-lg border border-gray-200 bg-gray-50 dark:border-viking-red overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 sm:px-6 text-left text-viking-charcoal dark:bg-gray-800 dark:text-gray-200 font-semibold text-base sm:text-lg">
                      What ages can join?
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 text-gray-600 dark:text-white dark:bg-gray-800 text-sm leading-relaxed">
                      We offer pathways for U14, U17, Senior D2, Senior Elite,
                      and Flag. Each level is development-focused with
                      opportunities to advance.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-5"
                    className="rounded-lg border border-gray-200 bg-gray-50 dark:border-viking-red overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 sm:px-6 text-left text-viking-charcoal dark:bg-gray-800 dark:text-gray-200 font-semibold text-base sm:text-lg">
                      How often do teams practice?
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 text-gray-600 dark:text-white dark:bg-gray-800 text-sm leading-relaxed">
                      Most squads train 2–3 times per week in season with
                      optional strength & conditioning sessions. Pre-season may
                      include additional install days.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-6"
                    className="rounded-lg border border-gray-200 bg-gray-50 dark:border-viking-red overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 sm:px-6 text-left text-viking-charcoal dark:bg-gray-800 dark:text-gray-200 font-semibold text-base sm:text-lg">
                      Can I try a session before committing?
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 text-gray-600 dark:text-white dark:bg-gray-800 text-sm leading-relaxed">
                      Yes—prospective players can attend an intro or open
                      training session. Register interest first so we can assign
                      you a contact and date.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
