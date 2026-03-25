import React from "react";

export const FruiteeLogo = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "h-24",
    default: "h-32",
    large: "h-48",
  };

  if (size === "hero") {
    // The logo image is 16:9 with ~30% whitespace above and ~40% below the text.
    // We use a clipping container to crop both and show only the logo portion.
    return (
      <div className={`overflow-hidden ${className}`} style={{ height: '14rem' }} data-testid="fruitee-logo-wrap">
        <img
          src="https://customer-assets.emergentagent.com/job_brand-central-30/artifacts/ffcxwng2_fruitee_logo_no_bg%20logo.png"
          alt="Fruitee"
          className="w-auto mx-auto"
          style={{ height: '30rem', marginTop: '-7rem' }}
          data-testid="fruitee-logo"
        />
      </div>
    );
  }

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
