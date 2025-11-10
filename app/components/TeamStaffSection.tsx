import Image from "next/image";
import type { StaffMember } from "@/app/types/staff";

const FALLBACK_HEADSHOT = "/images/players/playerFiller.png";

interface TeamStaffSectionProps {
  teamName: string;
  staff: StaffMember[];
}

export function TeamStaffSection({ teamName, staff }: TeamStaffSectionProps) {
  if (!staff.length) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-viking-charcoal/30 border-b border-gray-200/60 dark:border-gray-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-viking-gold mb-2">
            Staff
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-viking-charcoal dark:text-white">
            {teamName} Coaching Staff
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {staff.map((member) => (
            <StaffCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StaffCard({ member }: { member: StaffMember }) {
  const initials = getInitials(member.name);

  return (
    <article className="rounded-2xl border border-gray-200/60 dark:border-gray-800/80 bg-white/95 dark:bg-viking-charcoal/60 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="shrink-0">
          <Avatar
            image={member.image}
            alt={member.imageAlt}
            fallback={initials}
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-viking-charcoal dark:text-white">
            {member.name}
          </h3>
          <p className="text-xs uppercase tracking-wide text-viking-red/80 dark:text-viking-gold/80 mt-2">
            {member.role}
          </p>
          <div className="mt-3 space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
            {member.email && (
              <p>
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-viking-red dark:hover:text-viking-gold underline-offset-4 hover:underline"
                >
                  {member.email}
                </a>
              </p>
            )}
            {member.phone && (
              <p>
                <a
                  href={`tel:${member.phone}`}
                  className="hover:text-viking-red dark:hover:text-viking-gold"
                >
                  {member.phone}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Avatar({
  image,
  alt,
  fallback,
}: {
  image?: string;
  alt?: string;
  fallback: string;
}) {
  const src = image && image.trim().length > 0 ? image : FALLBACK_HEADSHOT;
  const altText =
    alt ??
    (image
      ? `${fallback} portrait`
      : `${fallback || "Oslo Vikings"} placeholder portrait`);

  return (
    <div className="relative w-24 h-24 md:w-28 md:h-28">
      <Image
        src={src}
        alt={altText}
        fill
        sizes="128px"
        className="rounded-full object-cover shadow-lg"
      />
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);

  if (!parts.length) {
    return "OV";
  }

  const first = parts[0]?.charAt(0) ?? "";
  const second = parts.length > 1 ? parts[1].charAt(0) : "";
  const initials = `${first}${second}`.toUpperCase();

  return initials || "OV";
}
