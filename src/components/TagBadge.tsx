type TagBadgeProps = {
  children: string;
  className?: string;
};

export function TagBadge({ children, className = "" }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border border-accent/50 bg-transparent px-2 py-0.5 text-xs font-medium text-accent ${className}`}
    >
      {children}
    </span>
  );
}
