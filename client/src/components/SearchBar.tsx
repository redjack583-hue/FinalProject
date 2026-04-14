import { Search } from "lucide-react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search..." }: InputProps) {
  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary z-10 transition-colors group-focus-within:text-foreground" />
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border/50 bg-secondary/40 py-4 pl-12 pr-6 text-base text-foreground shadow-card backdrop-blur-md placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
      />
    </div>
  );
}