import React from "react";

/* Keep your CONFIG at the top (edit values if needed) */
const CONFIG = {
  email: "cesarkdiab@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/cesar-diab",
    github: "https://github.com/thebestsalad",
  },
  color: {
    primary: "from-blue-500 to-slate-600",
    ring: "focus-visible:ring-blue-500",
  },
};

function GlobalStyles() {
  return (
    <style>{`
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .no-scrollbar::-webkit-scrollbar { display: none; }

      @keyframes wiggle { 0%,100%{ transform: rotate(-4deg) } 50%{ transform: rotate(4deg) } }
      @keyframes float { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-12px) } }
      @keyframes bar { 0% { transform: translateX(-120%); } 100% { transform: translateX(220%); } }
    `}</style>
  );
}

function MaintenancePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-10 -left-10 size-64 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 size-72 rounded-full bg-slate-500/20 blur-3xl animate-[float_10s_ease-in-out_infinite]" />
      </div>

      {/* Construction tape */}
      <div className="select-none sticky top-0 z-20">
        <div className="w-full rotate-[-2deg] bg-[repeating-linear-gradient(45deg,#f59e0b_0_20px,#111827_20px_40px)] text-white text-center py-2 shadow">
          <span className="font-semibold tracking-wide">
            UNDER CONSTRUCTION • PLEASE PARDON THE DUST 🏗️
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-yellow-400/20 ring-1 ring-yellow-400/40 animate-[wiggle_2s_ease-in-out_infinite]">
          <span className="text-4xl">🚧</span>
        </div>
        <h1 className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Site Update In Progress
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          I’m shipping new features & polishing the portfolio. Check back soon — meanwhile you can still reach me.
        </p>

        {/* Fun progress bar */}
        <div className="mx-auto mt-8 h-3 w-full max-w-md overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full w-1/3 animate-[bar_2.2s_linear_infinite] bg-gradient-to-r from-blue-500 to-slate-600" />
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${CONFIG.email}`}
            className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r ${CONFIG.color.primary} shadow ${CONFIG.color.ring}`}
          >
            Email Cesar
          </a>
          <a
            href={CONFIG.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium border border-slate-300/70 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
          >
            LinkedIn
          </a>
          <a
            href={CONFIG.socials.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium border border-slate-300/70 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
          >
            GitHub
          </a>
        </div>

        <p className="mt-10 text-xs text-slate-500 dark:text-slate-400">
          Tip: If you need the full resume or project details right now, just email me and I’ll send them over.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  // Respect system theme; no manual toggle button
  React.useEffect(() => {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  return (
    <>
      <GlobalStyles />
      <MaintenancePage />
    </>
  );
}

