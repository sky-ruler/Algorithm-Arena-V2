import React from "react";
import { clsx } from "clsx";

// Glass card. All hover behavior (border tint, lift, spotlight) is CSS —
// see .surface-card in index.css. The spotlight coordinates come from the
// single delegated listener in lib/spotlight.js via data-spotlight.
const Card = ({
  children,
  className,
  innerClassName,
  hoverEffect = true,
  // RGB string like "34, 197, 94" for difficulty-tinted hover.
  // Omit for generic cards — they use the theme accent.
  difficultyColor,
}) => (
  <div
    data-spotlight={hoverEffect ? "" : undefined}
    style={difficultyColor ? { "--card-accent-rgb": difficultyColor } : undefined}
    className={clsx(
      "surface-card overflow-hidden p-6",
      !hoverEffect && "card-static",
      className,
    )}
  >
    <div className={clsx("relative z-10", innerClassName)}>{children}</div>
  </div>
);

export default Card;
