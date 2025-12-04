import type { Recruit } from "@/app/types/recruit";

interface TeamRecruitsSectionProps {
  teamName: string;
  recruits: Recruit[];
  anchorId?: string;
}

export function TeamRecruitsSection({
  teamName,
  recruits,
  anchorId,
}: TeamRecruitsSectionProps) {
  const sectionId = anchorId ?? "team-recruits";
  const hasRecruits = recruits.length > 0;

  return (
    <section
      id={sectionId}
      className="bg-white dark:bg-viking-charcoal/40 border-b border-gray-200/60 dark:border-gray-800/60 scroll-mt-32"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-viking-red mb-3">
            Recruits
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-viking-charcoal dark:text-white">
            {teamName} Recruits
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Fighting their way to the top.
          </p>
        </header>

        {!hasRecruits ? (
          <div className="rounded-2xl border border-dashed border-viking-red/50 bg-white/90 dark:bg-viking-charcoal/70 px-6 py-12 text-center shadow-inner">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Recruit information will be updated soon. Check back for the
              latest additions to the Senior Elite program.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            {recruits.map((recruit, index) => (
              <article
                key={`${recruit.id}-${index}`}
                className="rounded-2xl bg-viking-charcoal/80 text-white shadow-md hover:shadow-xl transition-shadow duration-200"
              >
                <div className="p-6 space-y-4">
                  <div className="space-y-2 text-center">
                    <div className="inline-flex flex-col items-center">
                      <h3 className="text-lg font-semibold text-white">
                        {recruit.name}
                      </h3>
                      <span
                        className="mt-1 block h-0.5 bg-viking-red flex-none"
                        style={{ width: "15rem" }}
                        aria-hidden="true"
                      />
                    </div>
                    {recruit.position && (
                      <span className="inline-flex items-center rounded-full bg-viking-red px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        {recruit.position}
                      </span>
                    )}
                  </div>
                  {recruit.fields.length > 0 && (
                    <dl className="space-y-3 text-sm text-white/90">
                      {recruit.fields.map((field, fieldIndex) => (
                        <div
                          key={`${recruit.id}-field-${fieldIndex}`}
                          className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3"
                        >
                          <dt className="font-semibold text-white sm:min-w-[120px]">
                            {field.label}
                          </dt>
                          <dd>{field.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
