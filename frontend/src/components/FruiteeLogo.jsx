import React from "react";

export const FruiteeLogo = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "h-24",
    default: "h-32",
    large: "h-48",
    hero: "h-[12rem] md:h-[18rem]",
  };

  return (
    <img
      src="https://customer-assets.emergentagent.com/job_brand-central-30/artifacts/ffcxwng2_fruitee_logo_no_bg%20logo.png"
      alt="Fruitee"
      className={`${sizeClasses[size]} w-auto ${className}`}
      data-testid="fruitee-logo"
    />
  );
};

export default FruiteeLogo;
