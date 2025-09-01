"use client";
import Image from "next/image";

interface PlayerCardProps {
    name?: string;
    position?: string;
    number?: string;
    height?: string;
    weight?: string;
    photo?: {
      filename: string;
      alt: string;
    };
    bio?: string;
    image?: string; // Add image property for background
  };

export default function PlayerCard({ ...props }: PlayerCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative">
        <div
          className="h-48 bg-cover bg-no-repeat flex items-center justify-center relative"
          style={{
            backgroundImage: props.image
              ? `url(${props.image})`
              : props.photo?.filename
              ? `url(${props.photo.filename})`
              : "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
            backgroundPosition:
              props.image || props.photo?.filename
                ? "center 42%"
                : "center center",
          }}
        >
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Fallback number display when no image */}
          {!props.image && !props.photo?.filename && (
            <div className="relative z-10 text-white text-6xl font-bold drop-shadow-lg">
              #{props.number || "00"}
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 bg-viking-gold text-viking-charcoal px-2 py-1 rounded font-bold shadow-lg z-20">
          #{props.number || "00"}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-viking-charcoal mb-2">
          {props.name || "Player Name"}
        </h3>

        <p className="text-viking-red font-semibold mb-3">
          {props.position || "Position"}
        </p>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Height: {props.height || "N/A"}</span>
          <span>Weight: {props.weight || "N/A"}</span>
        </div>

        {props.bio && (
          <p className="text-gray-700 text-sm leading-relaxed">{props.bio}</p>
        )}
      </div>
    </div>
  );
}
