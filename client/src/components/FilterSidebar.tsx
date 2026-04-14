interface SidebarProps {
  title: string;
  filters: {
    label: string;
    options: string[];
    selected: string[];
    onChange: (values: string[]) => void;
  }[];
}

export function FilterSidebar({ title, filters }: SidebarProps) {
  const handleToggle = (
    current: string[],
    value: string,
    update: (v: string[]) => void
  ) => {
    update(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  return (
    <aside className="rounded-xl border bg-card p-5 shadow-card">
      <h3 className="font-display text-base text-foreground">{title}</h3>

      {filters.map((f) => (
        <div key={f.label} className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {f.label}
          </p>

          <div className="flex flex-col gap-2">
            {f.options.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary/40"
              >
                <input
                  type="checkbox"
                  checked={f.selected.includes(opt)}
                  onChange={() =>
                    handleToggle(f.selected, opt, f.onChange)
                  }
                  className="h-4 w-4 rounded border border-secondary bg-background"
                />
                <span className="text-foreground">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}