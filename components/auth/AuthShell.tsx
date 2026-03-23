type Props = {
  children: React.ReactNode;
};

export default function AuthShell({ children }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12">
      {children}
    </main>
  );
}
