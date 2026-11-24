"use client";

export interface TabItem {
  key: string;
  label: string;
}

interface Props {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
}

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-slate-200">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
              isActive
                ? "border-teal-700 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
