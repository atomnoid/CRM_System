import type { JSX } from "react";

interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps): JSX.Element {
  return (
    <header className="mb-6">
      <h2 className="text-2xl font-semibold text-unicorn-primary">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </header>
  );
}
