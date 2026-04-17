"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch, authHeaders } from "@/lib/api";

type User = {
  id: number;
  email: string;
  role: "admin" | "client";
  client_id: number | null;
  is_active: boolean;
};

type Client = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

type Alert = {
  id: number;
  title: string;
  severity: string;
  status: string;
  client_id: number;
  created_at: string;
};

type DashboardState = {
  user: User | null;
  clients: Client[];
  alerts: Alert[];
};

const emptyState: DashboardState = {
  user: null,
  clients: [],
  alerts: [],
};

export function DashboardScreen() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("mss_access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const headers = authHeaders(token);

    Promise.all([
      apiFetch<{ user: User }>("/auth/me", { headers }),
      apiFetch<{ clients: Client[] }>("/clients", { headers }),
      apiFetch<{ alerts: Alert[] }>("/alerts", { headers }),
    ])
      .then(([me, clients, alerts]) => {
        window.localStorage.setItem("mss_user", JSON.stringify(me.user));
        setState({ user: me.user, clients: clients.clients, alerts: alerts.alerts });
      })
      .catch((error: Error) => {
        if (error.message.toLowerCase().includes("unauthorized")) {
          window.localStorage.removeItem("mss_access_token");
          window.localStorage.removeItem("mss_user");
          router.replace("/login");
          return;
        }

        setMessage(error.message || "Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    window.localStorage.removeItem("mss_access_token");
    window.localStorage.removeItem("mss_user");
    router.push("/login");
  };

  const { user, clients, alerts } = state;
  const alertCount = alerts.length;
  const clientCount = clients.length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(49,196,141,0.12),transparent_20%),linear-gradient(180deg,#eef5ed_0%,#f7f4ec_100%)] text-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
              Live Console
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {loading
                ? "Loading your workspace..."
                : user?.role === "admin"
                  ? "Admin command center"
                  : "Client security dashboard"}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              {user?.role === "admin"
                ? "Review client access, triage alerts, and coordinate the managed security workflow."
                : "Track the alerts and records available to your organization from one secure view."}
            </p>
          </div>
          <button
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            onClick={logout}
            type="button"
          >
            Log out
          </button>
        </header>

        {message ? (
          <div className="mb-6 rounded-3xl border border-rose-300 bg-rose-50 px-5 py-4 text-sm text-rose-900">
            {message}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Role", user?.role === "admin" ? "Administrator" : user?.role === "client" ? "Client" : "-"],
            ["Visible Clients", String(clientCount)],
            ["Active Alerts", String(alertCount)],
          ].map(([label, value]) => (
            <article
              key={label}
              className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            >
              <p className="text-sm text-slate-500">{label}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">{value}</h2>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
              Account
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Signed-in identity</h2>
            <dl className="mt-6 grid gap-4">
              {[
                ["Email", user?.email ?? "-"],
                ["Role", user?.role ?? "-"],
                ["Client ID", user?.client_id ? String(user.client_id) : "Not linked"],
                ["Status", user?.is_active ? "Active" : "Inactive"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3"
                >
                  <dt className="text-sm text-slate-500">{label}</dt>
                  <dd className="text-sm font-medium text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
              Clients
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Accessible client records</h2>
            <div className="mt-6 grid gap-3">
              {clients.length ? (
                clients.map((client) => (
                  <article
                    key={client.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">{client.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{client.email}</p>
                    <span className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      Client #{client.id}
                    </span>
                  </article>
                ))
              ) : (
                <p className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                  No client records are available yet.
                </p>
              )}
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
            Alerts
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Latest security events</h2>

          <div className="mt-6 grid gap-3">
            {alerts.length ? (
              alerts.map((alert) => (
                <article
                  key={alert.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{alert.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Status: {alert.status} • Client #{alert.client_id}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        ["high", "critical"].includes(alert.severity.toLowerCase())
                          ? "bg-rose-100 text-rose-700"
                          : alert.severity.toLowerCase() === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                No alerts have been recorded yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
