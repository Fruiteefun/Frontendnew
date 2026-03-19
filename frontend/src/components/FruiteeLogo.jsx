import React from "react";

export const FruiteeLogo = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "text-xl",
    default: "text-2xl",
    large: "text-4xl",
  };

  return (
    <span
      className={`font-outfit font-bold ${sizeClasses[size]} ${className}`}
      data-testid="fruitee-logo"
    >
      <span className="text-foreground">fru</span>
      <span className="relative inline-block">
        <span className="bg-gradient-to-br from-orange-400 to-pink-500 bg-clip-text text-transparent">
          i
        </span>
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
      </span>
      <span className="text-foreground">tee</span>
    </span>
  );
};

export default FruiteeLogo;
