import Link from "next/link";

const routes = [
  { label: "Generate content", href: "/giftmaker/api/gifts/generate" },
  { label: "Create gift", href: "/giftmaker/api/gifts" },
  { label: "Example gift page", href: "/giftmaker/gift/demo" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Gift Page Backend</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">A safe, JSON-driven gift experience for the web.</h1>
          <p className="max-w-2xl text-lg text-slate-300">
            This MVP ships a server-generated gift flow with a public page route, AI content generation, and a publish endpoint ready for the Android app.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm transition hover:border-cyan-400/60"
            >
              <div className="font-semibold">{route.label}</div>
              <div className="mt-2 text-slate-400">{route.href}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
