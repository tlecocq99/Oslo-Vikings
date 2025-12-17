import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  Shield,
  Target,
  Users,
  Trophy,
  Heart,
  Star,
  Dumbbell,
  Badge,
} from "lucide-react";
import { JourneyTimeline } from "../components/JourneyTimeline";

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Community",
      description:
        "As Vikings we actively engage with the Club to have fun, to support and celebrate the accomplishments of our athletes, and to form lasting bonds",
    },
    {
      icon: Shield,
      title: "Sportsmanship",
      description:
        "We respect our fellow athletes, the Club, and the game of American Football whether on or off the field.",
    },
    {
      icon: Dumbbell,
      title: "Development",
      description:
        "We are all committed to become the best athlete, person, and club we can be through continuous learning and improvement",
    },
    {
      icon: Target,
      title: "Drive",
      description:
        "We strive to be champions by dedicating ourselves to perform at our best and by motivating each other to do the same",
    },
    {
      icon: Heart,
      title: "Inclusivity",
      description:
        "We strive to provide an athletic experience that all can partake in and enjoy, including both kids and adults of all fitness levels and physiques.",
    },
  ];

  const milestones = [
    {
      year: "1986",
      event: "Oslo Vikings Founded",
      description: "Team established with 20 founding members",
    },
    {
      year: "1989",
      event: "Junior Programs",
      description: "First junior program introduced",
    },
    {
      year: "1990",
      event: "First Championship",
      description: "Vikings win their first NM Championship title",
    },
    {
      year: "1994",
      event: "First International Competition",
      description: "First Norwegian team to compete internationally",
    },
    {
      year: "1998",
      event: "Eurocup participant",
      description: "Vikings take on Europe's best teams",
    },
    {
      year: "1999",
      event: "Dynasty Begins",
      description: "6th ranked club in Europe",
    },
    {
      year: "2023",
      event: "Consistency Established",
      description: "15th NM championship title won",
    },
    {
      year: "2024",
      event: "Crossing Borders",
      description:
        "Elite team joins Swedish Superseries for a two season quest",
    },
    {
      year: "2026",
      event: "Future",
      description: "What Next?",
    },
  ];

  return (
    <>
      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="dark:bg-viking-surface-alt py-12">
          <div className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-viking-charcoal dark:text-gray-200 mb-6 relative after:content-[''] after:block after:h-1 after:w-24 after:bg-viking-red after:rounded-full after:mx-auto after:mt-4">
              Overview
            </h1>
            <p className="text-lg">
              Founded in 1986, the Oslo Vikings are proud members of Norway’s
              American Sports Federation (NAIF), the International Federation of
              American Football (IFAF), and the broader Norwegian Sports
              Federation (NIF).
            </p>
            <p className="text-lg">
              We’re passionate about making football accessible and exciting for
              everyone — elite athletes, total beginners, big players, small
              players, and everyone in between. In recent years we’ve focused
              heavily on expanding opportunities for youth, offering a
              competitive, supportive, and incredibly fun team environment for
              kids who may not feel at home in more traditional Norwegian sports
              like soccer or handball.
            </p>
            <p className="text-lg">
              We’re always pushing to grow, improve, and strengthen our impact
              in the community. Our volunteer Board of Directors leads the way,
              managing daily operations, long-term planning, and the overall
              direction of the club. Supporting them is our senior department,
              led by the Head Coach, and our junior department, led by the
              Junior Manager, which includes our U14, U17, and U19 teams.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-4 bg-white dark:bg-viking-charcoal/80 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-viking-charcoal dark:text-gray-200 mb-8">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              The Oslo Vikings&apos; mission is to be the leading sports club in
              Norway through providing a fun, demanding American Football
              experience founded on Community, Sportsmanship, Development,
              Drive, and Inclusivity.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 bg-gray-50 dark:bg-viking-charcoal/60 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-200 mb-4">
                Our Values
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                The principles that guide every decision and action of the Oslo
                Vikings
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-viking-charcoal/70 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 lg:p-5"
                >
                  <div className="w-16 h-16 bg-viking-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-12 bg-gray-50 dark:bg-viking-charcoal/60 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-200 mb-4">
                Leadership
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Meet the people who help make the Oslo Vikings organization
                successful.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              <div className="bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-lg p-6 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-viking-red rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100 mb-2">
                  Anton Pettersen
                </h3>
                <p className="text-viking-red font-semibold mb-3">President</p>
              </div>
              <div className="bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-lg p-6 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-viking-red-dark rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Badge className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100 mb-2">
                  Lotta Begby
                </h3>
                <p className="text-viking-red font-semibold mb-3">
                  Vice President
                </p>
              </div>

              <div className="bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-lg p-6 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-viking-red rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100 mb-2">
                  Adam Lukasiewicz
                </h3>
                <p className="text-viking-red font-semibold mb-3">
                  Head of Sport
                </p>
              </div>

              <div className="bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-lg p-6 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-viking-red-dark rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100 mb-2">
                  Joachim Løvf
                </h3>
                <p className="text-viking-red font-semibold mb-3">
                  Junior Responsible
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
