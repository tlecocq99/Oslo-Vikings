import { GameCardContent, type GameCardProps } from "./GameCardContent";

export type { GameCardProps };

export default function GameCard(props: GameCardProps) {
  return <GameCardContent {...props} />;
}
