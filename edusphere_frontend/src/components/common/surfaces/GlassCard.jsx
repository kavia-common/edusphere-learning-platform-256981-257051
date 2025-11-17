import React from "react";

/**
 * GlassCard surface: a flexible glassmorphism-styled container.
 * - Uses global .glass-card styles for visuals.
 * - Accepts 'as' prop to render as another element (e.g., form, section).
 * - Spreads any additional props to the root element and merges style.
 */
// PUBLIC_INTERFACE
export function GlassCard({ as: Tag = "div", children, style, ...rest }) {
  /** Glassmorphism card container component. */
  return (
    <Tag
      className={`glass-card${rest.className ? ` ${rest.className}` : ""}`}
      style={{ padding: 16, borderRadius: 16, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default GlassCard;
