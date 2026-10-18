"use client";
import type { ReactNode } from "react";

export const inputCls =
  "w-full px-3.5 py-2.5 border border-line rounded-lg bg-white text-ink focus:outline-none focus:ring-2 focus:ring-accent text-[15px]";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-ink-50 mt-1">{hint}</p>}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return multiline ? (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={inputCls} placeholder={placeholder} />
  ) : (
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder={placeholder} />
  );
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
export { move as moveItem };

export function SmallBtn({
  children,
  onClick,
  danger = false,
  disabled = false,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`shrink-0 h-9 min-w-9 px-2.5 rounded-lg border text-sm disabled:opacity-30 ${
        danger ? "border-red-300 text-red-600 hover:bg-red-50" : "border-line hover:bg-paper-lo"
      }`}
    >
      {children}
    </button>
  );
}

// Editable list of strings: add, remove, reorder.
export function ListInput({
  value,
  onChange,
  multiline = false,
  addLabel = "+ Add item",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  multiline?: boolean;
  addLabel?: string;
}) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1">
            <TextInput
              value={item}
              multiline={multiline}
              onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
            />
          </div>
          <SmallBtn title="Move up" disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))}>↑</SmallBtn>
          <SmallBtn title="Move down" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))}>↓</SmallBtn>
          <SmallBtn title="Remove" danger onClick={() => onChange(value.filter((_, j) => j !== i))}>✕</SmallBtn>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="px-3 py-2 text-sm border border-line rounded-lg hover:bg-paper-lo"
      >
        {addLabel}
      </button>
    </div>
  );
}
