"use client";

import { GameCardContent, type GameCardProps } from "./GameCardContent";

export default function GameCardClient(props: GameCardProps) {
  return <GameCardContent {...props} />;
}
