"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiBaseUrl, apiFetch } from "@/lib/api";

type AuthStatus = {
  has_admin: boolean;
};

type AuthUser = {
  id: number;
  email: string;
  role: "admin" | "client";
  client_id: number | null;
  is_active: boolean;
  created_at: string;
};

type LoginResponse = {
  access_token: string;
  user: AuthUser;
};

type SetupResponse = {
  message: string;
  user: AuthUser;
};

const initialLogin = { email: "", password: "" };
const initialSetup = { email: "", password: "" };

export function LoginScreen() {
  const router = useRouter();
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [setupForm, setSetupForm] = useState(initialSetup);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<AuthStatus>("/auth/status")
      .then((data) => setHasAdmin(data.has_admin))
      .catch((error: Error) =>
        setMessage({ tone: "error", text: error.message || "Unable to reach the backend." }),
      );
  }, []);

  const saveSession = (payload: LoginResponse) => {
    window.localStorage.setItem("mss_access_token", payload.access_token);
    window.localStorage.setItem("mss_user", JSON.stringify(payload.user));
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const payload = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });

      saveSession(payload);
      router.push("/dashboard");
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Login failed.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const payload = await apiFetch<SetupResponse>("/auth/setup-admin", {
        method: "POST",
        body: JSON.stringify(setupForm),
      });

      setMessage({ tone: "success", text: `${payload.message}. You can sign in now.` });
      setHasAdmin(true);
      setSetupForm(initialSetup);
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Admin setup failed.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(49,196,141,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(38,115,255,0.18),transparent_24%),linear-gradient(135deg,#041018_0%,#091927_50%,#081523_100%)] text-slate-50">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.15fr_0.95fr] lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_30px_90px_rgba(2,8,18,0.45)] backdrop-blur md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Managed Security Services
          </p>
          <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
            Security operations for clients that need calm, clear coverage.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Sign in to monitor alerts, manage client access, and keep every protected account
            within reach of one clean command surface.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Admin Control", "Create clients, assign accounts, and manage response workflows."],
              ["Client Access", "Each client signs in to view only their own alerts and security status."],
              ["API Ready", `Frontend talks to Flask at ${apiBaseUrl}.`],
            ].map(([title, description], index) => (
              <article
                key={title}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm font-semibold text-emerald-300">0{index + 1}</p>
                <h2 className="mt-3 text-xl font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-8 shadow-[0_30px_90px_rgba(2,8,18,0.45)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
              {hasAdmin === false ? "First-run setup" : "Sign in"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {hasAdmin === false ? "Create your first admin account" : "Access the MSS dashboard"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {hasAdmin === false
                ? "This setup screen appears only while no admin account exists."
                : "Use your admin or client credentials to continue."}
            </p>

            {message ? (
              <div
                className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                  message.tone === "error"
                    ? "border-rose-400/25 bg-rose-400/10 text-rose-100"
                    : "border-emerald-400/25 bg-emerald-400/10 text-emerald-50"
                }`}
              >
                {message.text}
              </div>
            ) : null}

            {hasAdmin === false ? (
              <form className="mt-8 grid gap-4" onSubmit={handleSetup}>
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>Admin email</span>
                  <input
                    className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none ring-0 transition focus:border-emerald-300"
                    type="email"
                    required
                    value={setupForm.email}
                    onChange={(event) =>
                      setSetupForm((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="admin@mss.local"
                  />
                </label>
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>Create password</span>
                  <input
                    className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none ring-0 transition focus:border-emerald-300"
                    type="password"
                    required
                    value={setupForm.password}
                    onChange={(event) =>
                      setSetupForm((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="Choose a strong password"
                  />
                </label>
                <button
                  className="mt-2 rounded-2xl bg-linear-to-r from-emerald-300 to-cyan-200 px-4 py-3 font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={submitting}
                  type="submit"
                >
                  {submitting ? "Creating account..." : "Create admin account"}
                </button>
              </form>
            ) : (
              <form className="mt-8 grid gap-4" onSubmit={handleLogin}>
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>Email</span>
                  <input
                    className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none ring-0 transition focus:border-emerald-300"
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="name@company.com"
                  />
                </label>
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>Password</span>
                  <input
                    className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none ring-0 transition focus:border-emerald-300"
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="Enter your password"
                  />
                </label>
                <button
                  className="mt-2 rounded-2xl bg-linear-to-r from-emerald-300 to-cyan-200 px-4 py-3 font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={submitting || hasAdmin === null}
                  type="submit"
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
            )}

            <p className="mt-6 text-sm text-slate-400">
              Backend API base URL: <span className="font-mono text-slate-200">{apiBaseUrl}</span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
