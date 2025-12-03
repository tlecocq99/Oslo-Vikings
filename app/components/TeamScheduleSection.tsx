import type { ScheduleTable } from "@/app/services/fetchSchedule";

interface TeamScheduleSectionProps {
  teamName: string;
  schedule: ScheduleTable;
  anchorId?: string;
}

export function TeamScheduleSection({
  teamName,
  anchorId,
}: TeamScheduleSectionProps) {
  return (
    <section
      id={anchorId ?? "team-schedule"}
      className="py-16 bg-gray-50 dark:bg-viking-charcoal/70 transition-colors scroll-mt-32"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-100 mb-3">
            {teamName} Schedule
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Follow upcoming games and recent results for the {teamName} program.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-viking-charcoal/90 border border-dashed border-viking-red/40 dark:border-viking-red/40 rounded-xl p-10 text-center shadow-inner">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Coming soon!
          </p>
        </div>
      </div>
    </section>
  );
}
