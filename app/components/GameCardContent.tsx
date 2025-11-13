import clsx from "clsx";
import { Calendar, MapPin, Clock } from "lucide-react";
import styles from "./GameCard.module.css";

export interface GameCardProps {
  home_team?: string;
  away_team?: string;
  date?: string;
  time?: string;
  location?: string;
  home_score?: number;
  away_score?: number;
  status?: "upcoming" | "live" | "completed";
}

export function GameCardContent({
  home_team,
  away_team,
  date,
  time,
  location,
  home_score,
  away_score,
  status,
}: GameCardProps) {
  const isOsloHome = home_team?.toLowerCase().includes("oslo");
  const isOsloAway = away_team?.toLowerCase().includes("oslo");

  return (
    <div className={styles.card}>
      {/* Game Status */}
      <div className={styles.header}>
        <span
          className={clsx(styles.statusBadge, {
            [styles.statusCompleted]: status === "completed",
            [styles.statusLive]: status === "live",
            [styles.statusUpcoming]: !status || status === "upcoming",
          })}
        >
          {status === "completed"
            ? "Final"
            : status === "live"
            ? "LIVE"
            : "Upcoming"}
        </span>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Calendar className={styles.icon} />
            <span>{date}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock className={styles.icon} />
            <span>{time}</span>
          </div>
        </div>
      </div>

      {/* Teams and Score */}
      <div className={styles.grid}>
        <div
          className={clsx(styles.team, {
            [styles.teamHighlight]: isOsloHome,
          })}
        >
          <div className={styles.teamName}>{home_team}</div>
          <div className={styles.teamRole}>HOME</div>
        </div>

        <div className={styles.scoreWrapper}>
          {status === "completed" ? (
            <div className={styles.scoreFinal}>
              {home_score} - {away_score}
            </div>
          ) : (
            <div className={styles.scoreUpcoming}>VS</div>
          )}
        </div>

        <div
          className={clsx(styles.team, {
            [styles.teamHighlight]: isOsloAway,
          })}
        >
          <div className={styles.teamName}>{away_team}</div>
          <div className={styles.teamRole}>AWAY</div>
        </div>
      </div>

      {/* Location */}
      {location && (
        <div className={styles.location}>
          <MapPin className={styles.icon} />
          <span className={styles.locationText}>{location}</span>
        </div>
      )}
    </div>
  );
}
