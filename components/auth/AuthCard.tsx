type AuthCardProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <section className="w-full max-w-md rounded-2xl border border-blue-900/40 bg-slate-900/75 p-6 shadow-sm shadow-blue-950/30">
      <h1 className="text-2xl font-semibold text-blue-50">{title}</h1>
      <p className="mt-1 text-sm text-blue-200/70">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
