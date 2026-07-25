export const tokens = {
  color: {
    brand: "#176B5B",
    info: "#2563EB",
    success: "#15803D",
    warning: "#B45309",
    danger: "#B42318",
  },
  spacing: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    6: "1.5rem",
    8: "2rem",
  },
  radius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
  },
  icon: {
    sm: "1rem",
    md: "1.25rem",
    lg: "1.5rem",
  },
} as const;

export type DesignTokens = typeof tokens;
