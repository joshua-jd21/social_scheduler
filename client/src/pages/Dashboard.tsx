import { useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowUpRight,
  Clock3,
  Send,
} from "lucide-react";

interface DashboardStats {
  scheduled: number;
  published: number;
  connectedAccounts: number;
  aiGenerated: number;
}

interface Activity {
  id: number;
  title: string;
  platform: string;
  status: "Published" | "Scheduled" | "Generated";
  time: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    scheduled: 0,
    published: 0,
    connectedAccounts: 0,
    aiGenerated: 0,
  });

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setStats({
          scheduled: 12,
          published: 38,
          connectedAccounts: 4,
          aiGenerated: 97,
        });

        setActivities([
          {
            id: 1,
            title: "Instagram post published",
            platform: "Instagram",
            status: "Published",
            time: "5 minutes ago",
          },
          {
            id: 2,
            title: "LinkedIn article scheduled",
            platform: "LinkedIn",
            status: "Scheduled",
            time: "15 minutes ago",
          },
          {
            id: 3,
            title: "AI generated a marketing caption",
            platform: "AI Composer",
            status: "Generated",
            time: "35 minutes ago",
          },
          {
            id: 4,
            title: "Facebook campaign published",
            platform: "Facebook",
            status: "Published",
            time: "1 hour ago",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Scheduled Posts",
      value: stats.scheduled,
      icon: CalendarClock,
      trend: "+4 Today",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Published Posts",
      value: stats.published,
      icon: CheckCircle2,
      trend: "All Time",
      color: "from-emerald-500 to-green-500",
    },
    {
      label: "Connected Accounts",
      value: stats.connectedAccounts,
      icon: Users,
      trend: "Active",
      color: "from-violet-500 to-purple-500",
    },
    {
      label: "AI Generated",
      value: stats.aiGenerated,
      icon: Sparkles,
      trend: "This Month",
      color: "from-orange-500 to-pink-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Good morning! 👋
          </h2>
          <p className="mt-1 text-slate-500">
            Here's what's happening across your social media accounts today.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.color}`}
              />

              <div className="mb-6 flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${card.color} shadow-lg`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {card.trend}
                </div>
              </div>

              <h3 className="text-4xl font-bold tracking-tight text-slate-900">
                {card.value}
              </h3>

              <p className="mt-2 text-sm font-medium text-slate-500">
                {card.label}
              </p>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 group-hover:w-full" />
            </div>
          );
        })}
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest actions across your workspace
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                {activities.length} Events
              </span>
            </div>

            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
                <Clock3 className="mb-4 h-12 w-12 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-900">
                  No activity yet
                </h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Connect your social media accounts and start scheduling posts
                  to see your latest activity here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 px-6 py-5 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Send className="h-5 w-5 text-blue-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-medium text-slate-900">
                          {activity.title}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {activity.time}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {activity.platform}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            activity.status === "Published"
                              ? "bg-emerald-100 text-emerald-700"
                              : activity.status === "Scheduled"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-violet-100 text-violet-700"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6" />
      </section>
    </div>
  );
};

export default Dashboard;