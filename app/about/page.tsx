import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Shield, Target, Users, Trophy, Heart, Star } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Honor",
      description:
        "We play with integrity and respect, representing Norwegian values on and off the field.",
    },
    {
      icon: Target,
      title: "Excellence",
      description:
        "Striving for perfection in every practice, every play, and every game.",
    },
    {
      icon: Users,
      title: "Brotherhood",
      description:
        "United as one team, one family, supporting each other through victory and challenge.",
    },
    {
      icon: Heart,
      title: "Passion",
      description:
        "Fueled by love for the game and pride in representing Oslo and Norway.",
    },
  ];

  const milestones = [
    {
      year: "2010",
      event: "Oslo Vikings Founded",
      description: "Team established with 20 founding members",
    },
    {
      year: "2012",
      event: "First Championship",
      description: "Won the Norwegian League Championship",
    },
    {
      year: "2015",
      event: "Stadium Opening",
      description: "Viking Stadium officially opened",
    },
    {
      year: "2018",
      event: "International Recognition",
      description: "First Norwegian team to compete internationally",
    },
    {
      year: "2023",
      event: "Dynasty Begins",
      description: "Third consecutive championship title",
    },
  ];

  return (
    <>
      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="dark:bg-gray-800 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-viking-charcoal dark:text-gray-200 mb-6 relative after:content-[''] after:block after:h-1 after:w-24 after:bg-viking-red after:rounded-full after:mx-auto after:mt-4">
              Contact Us About the Vikings
            </h1>
            <p className="text-xl text-viking-charcoal/80 dark:text-gray-300/80 max-w-3xl mx-auto">
              Discover the story behind Norway's premier American football team
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-white dark:bg-viking-charcoal/80 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-200 mb-8">
              Our Mission
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              The Oslo Vikings are dedicated to excellence in American football
              while promoting Norwegian values of teamwork, perseverance, and
              community. We strive to be champions both on the field and in our
              commitment to developing young athletes and giving back to our
              community.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50 dark:bg-viking-charcoal/60 transition-colors">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-viking-charcoal/70 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
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

        {/* History Timeline */}
        <section className="py-16 bg-white dark:bg-viking-charcoal/80 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-200 mb-4">
                Our Journey
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                From humble beginnings to championship glory
              </p>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:space-x-6 space-y-4 sm:space-y-0"
                >
                  <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-viking-gold rounded-full flex items-center justify-center">
                    <span className="text-viking-charcoal font-bold text-sm sm:text-base">
                      {milestone.year}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-viking-charcoal dark:text-gray-100 mb-2">
                      {milestone.event}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-16 bg-gray-50 dark:bg-viking-charcoal/60 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-200 mb-4">
                Leadership
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Meet the people who make the Oslo Vikings organization
                successful
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-lg p-6 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-viking-red rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100 mb-2">
                  Astrid Larsen
                </h3>
                <p className="text-viking-red font-semibold mb-3">
                  Team President
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Visionary leader driving the strategic direction and growth of
                  the Oslo Vikings organization.
                </p>
              </div>

              <div className="bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-lg p-6 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-viking-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-10 h-10 text-viking-charcoal" />
                </div>
                <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100 mb-2">
                  Gunnar Pedersen
                </h3>
                <p className="text-viking-red font-semibold mb-3">
                  General Manager
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Experienced sports executive managing team operations, player
                  acquisition, and strategic planning.
                </p>
              </div>

              <div className="bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-lg p-6 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-viking-red rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100 mb-2">
                  Ingrid Haugen
                </h3>
                <p className="text-viking-red font-semibold mb-3">
                  Director of Operations
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Ensuring smooth daily operations and coordinating all team
                  activities and logistics.
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
