import type { ReactNode } from "react";
import logo from "@/assets/logo.svg";

interface Props {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="py-2 mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <img className="w-60" src={logo} />
        <h1 className="text-3xl text-slate-600 font-semibold tracking-tight mt-2">
          {title}
        </h1>
        {description && <p className="text-slate-400 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
