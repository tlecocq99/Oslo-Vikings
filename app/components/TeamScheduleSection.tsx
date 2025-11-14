import type { ScheduleTable } from "@/app/services/fetchSchedule";

interface TeamScheduleSectionProps {
  teamName: string;
  schedule: ScheduleTable;
  anchorId?: string;
}

export function TeamScheduleSection({
  teamName,
  schedule,
  anchorId,
}: TeamScheduleSectionProps) {
  const hasSchedule =
    schedule.entries.length > 0 && schedule.columns.length > 0;

  return (
    <section
      id={anchorId ?? "team-schedule"}
      className="py-16 bg-gray-50 dark:bg-viking-charcoal/70 transition-colors"
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

        {!hasSchedule ? (
          <div className="bg-white/80 dark:bg-viking-charcoal/90 border border-dashed border-viking-red/40 dark:border-viking-red/40 rounded-xl p-10 text-center shadow-inner">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Schedule data will be posted soon. Check back for the latest
              fixtures.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10">
            <table className="min-w-full divide-y divide-viking-red/15 dark:divide-viking-red/20 text-left">
              <thead className="bg-viking-red text-white dark:bg-viking-red-dark dark:text-white">
                <tr>
                  {schedule.columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="px-4 py-3 text-sm font-semibold uppercase tracking-wide whitespace-nowrap"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-viking-charcoal/95 divide-y divide-viking-red/10 dark:divide-viking-red/15 text-sm sm:text-base">
                {schedule.entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="odd:bg-viking-red/5 dark:odd:bg-white/5"
                  >
                    {schedule.columns.map((column) => {
                      const value = entry.data[column.key]?.trim();
                      const lowerValue = value?.toLowerCase() ?? "";
                      const isHomeColumn = column.label
                        .toLowerCase()
                        .includes("home");
                      const highlightHomeTeam =
                        isHomeColumn && lowerValue.includes("oslo vikings");

                      const textColorClass = highlightHomeTeam
                        ? "text-viking-red dark:text-viking-red font-semibold"
                        : "text-gray-800 dark:text-gray-200";

                      return (
                        <td
                          key={`${entry.id}-${column.key}`}
                          className={`px-4 py-3 align-middle whitespace-nowrap ${textColorClass}`}
                        >
                          {value && value.length > 0 ? value : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
