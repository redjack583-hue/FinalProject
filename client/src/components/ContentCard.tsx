import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  badge?: string;
  meta?: string;
  to: string;
}

export function ContentCard({ title, description, badge, meta, to }:CardProps) {
  return (
    <div className="group flex flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {badge && (
        <span className="mb-4 w-fit rounded-full bg-secondary px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">
          {badge}
        </span>
      )}
      <h3 className="text-xl leading-snug">{title}</h3>
      {meta && <p className="mt-1.5 text-xs font-medium text-muted-foreground/80">{meta}</p>}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {description}
      </p>
      <Link
        to={to}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
      >
        View Details
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
