import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  badge?: string;
  meta?: string;
  to: string;
}

export function ContentCard({ title, description, badge, meta, to }: CardProps) {
  return (
    <div className="group flex flex-col rounded-lg border bg-card p-6 shadow-card transition-colors hover:border-primary/40 hover:bg-secondary/20">
      {badge && (
        <span className="mb-4 w-fit rounded-md bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">
          {badge}
        </span>
      )}
      <h3 className="text-xl leading-snug">{title}</h3>
      {meta && (
        <p className="mt-1.5 text-xs font-medium text-muted-foreground/80">
          {meta}
        </p>
      )}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {description}
      </p>
      <Link
        to={to}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
      >
        View Details
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}