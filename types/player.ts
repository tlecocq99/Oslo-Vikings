export type PlayerCard = {
  name?: string;
  position?: string;
  number?: string;
  height?: string;
  weight?: string;
  photo?: { filename: string; alt: string };
  bio?: string;
  image?: string; // background image URL
};
export type PlayerCardProps = PlayerCard[];
