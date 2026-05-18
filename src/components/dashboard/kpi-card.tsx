import { cn } from "@/lib/utils";

interface KpiCardProps {
  icon: any;

  title: string;
  value: any;
  subtitle?: any;

  chart?: any

  badge?: string;
  badgeColor?: string;

  accent?: string;
  glow?: string;
}

export function KpiCard({
  icon,
  title,
  value,
  subtitle,
  chart,
  badge,
  badgeColor,
  accent,
  glow,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "cursor-pointer h-full",
        "relative overflow-hidden rounded-3xl",
        // "border border-black/20",
        "bg-slate-700",
        "px-8 py-6",
        "transition-all duration-300",
        "hover:-translate-y-1",
        // "hover:border-slate-700",
        "hover:shadow-2xl",
        glow,
      )}
    >
      {/* Glow background */}
      <div
        className={cn(
          "absolute inset-0 opacity-[0.03]",
          "bg-linear-to-br from-white via-transparent to-transparent",
        )}
      />

      {/* <p className="mb-2 text-lg text-center text-white">{title}</p> */}

      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div
          className={cn()
          // icon && "border border-white/5 bg-white/6",
          // "flex h-11 w-11 items-center justify-center",
          // "rounded-full",
          // "backdrop-blur-xl",
          }
        >
          {icon}
        </div>

        {/* Badge */}
        {badge && (
          <div
            className={cn(
              "uppercase",
              "rounded-full px-3 py-1",
              "text-xs font-bold",
              "tracking-wide",
              badgeColor,
            )}
          >
            {badge === "ok" ? "Ok" : badge === "alert" ? "Alerta" : "Crítico"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-6">
        <div className="flex justify-between">
          <div>
            <h2 className={cn("text-4xl font-semibold tracking-tight", accent)}>
              {value}
            </h2>
            <p className="mt-2 text-lg text-white">{title}</p>
          </div>
          <div>
            {chart}
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-linear-to-r from-white/10 via-white/5 to-transparent" />

        {/* Subtitle */}
        {subtitle && <div className="text-sm text-slate-300">{subtitle}</div>}
      </div>

      {/* Bottom glow */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-0.5 w-full",
          "bg-linear-to-r opacity-70",

          accent?.includes("green") &&
            "from-emerald-500/0 via-green-400 to-emerald-500/0",

          accent?.includes("amber") &&
            "from-amber-500/0 via-amber-400 to-yellow-400/0",

          accent?.includes("red") && "from-red-500/0 via-red-400 to-rose-400/0",

          // accent?.includes("orange") &&
          //   "from-orange-500/0 via-orange-400 to-yellow-400/0",

          // accent?.includes("blue") &&
          //   "from-blue-500/0 via-blue-400 to-cyan-400/0",

          // accent?.includes("violet") &&
          //   "from-violet-500/0 via-fuchsia-400 to-violet-500/0",

          // accent?.includes("cyan") &&
          //   "from-cyan-500/0 via-cyan-400 to-blue-400/0",
        )}
      />
    </div>
  );
}
