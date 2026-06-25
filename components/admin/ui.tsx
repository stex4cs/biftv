import Link from "next/link";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {subtitle ? (
          <div className="mb-1 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
            {subtitle}
          </div>
        ) : null}
        <h1 className="font-oswald text-3xl font-extrabold uppercase tracking-wider">
          {title}
        </h1>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-gradient-to-br from-[#161616] to-[#0d0d0d] ${className}`}
    >
      {children}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="p-6">
      <div className="mb-2 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
        {label}
      </div>
      <div className="font-oswald text-4xl font-extrabold">{value}</div>
      {hint ? <div className="mt-1 text-xs text-white/40">{hint}</div> : null}
    </Card>
  );
}

export function PrimaryButton({
  children,
  href,
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const classes =
    "inline-flex items-center gap-2 rounded-lg bg-bif-red px-4 py-2 font-oswald text-sm font-bold uppercase tracking-wider text-white transition hover:bg-bif-red/90 disabled:opacity-50";
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  href,
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const classes =
    "inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 font-oswald text-sm font-bold uppercase tracking-wider text-white/80 transition hover:bg-white/5 hover:text-white";
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    upcoming: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    live: "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse",
    ended: "bg-white/10 text-white/60 border-white/15",
    vod: "bg-bif-gold/15 text-bif-gold border-bif-gold/30",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        map[status] ?? "bg-white/10 text-white/60 border-white/15"
      }`}
    >
      {status}
    </span>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-white/50">
      {children}
    </span>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-bif-gold focus:outline-none " +
        (props.className ?? "")
      }
    />
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={
        "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-bif-gold focus:outline-none " +
        (props.className ?? "")
      }
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      className={
        "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white focus:border-bif-gold focus:outline-none " +
        (props.className ?? "")
      }
    />
  );
}
