interface IconProps {
  className?: string;
}

export function PlayIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7.5 4.6v14.8c0 .83.9 1.34 1.6.9l11.1-7.4c.63-.42.63-1.37 0-1.79L9.1 3.7c-.7-.44-1.6.07-1.6.9Z" />
    </svg>
  );
}

export function PauseIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.5 4.5h3.6v15H6.5zM13.9 4.5h3.6v15h-3.6z" />
    </svg>
  );
}

export function ResetIcon({ className = "h-4.5 w-4.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 2.8-6.5L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function CloseIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function OrbitGlyph({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(-20 12 12)"
      />
      <circle cx="20.4" cy="8.2" r="1.6" fill="currentColor" />
    </svg>
  );
}
