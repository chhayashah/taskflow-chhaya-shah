import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { getProjectStats, getProject } from "../api/projects";

interface Stats {
  total: number;
  by_status: { todo: number; in_progress: number; done: number };
  by_priority: { high: number; medium: number; low: number };
  completion_rate: number;
  overdue: number;
}

interface Props {
  dark: boolean;
  setDark: (v: boolean) => void;
}

export default function ProjectStats({ dark, setDark }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [id]);

  const fetchStats = async () => {
    try {
      const [statsData, projectData] = await Promise.all([
        getProjectStats(id!),
        getProject(id!),
      ]);
      setStats(statsData);
      setProjectName(projectData.name);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar dark={dark} setDark={setDark} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 animate-pulse"
              >
                <div className="h-8 bg-gray-100 dark:bg-slate-700 rounded mb-2" />
                <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  if (!stats)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar dark={dark} setDark={setDark} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-gray-500 dark:text-slate-400">
            No stats available
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar dark={dark} setDark={setDark} />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">
              {projectName} — Stats
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              Project analytics overview
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
            <p className="text-2xl font-medium text-gray-900 dark:text-white">
              {stats.total}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Total Tasks
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
            <p className="text-2xl font-medium text-emerald-600 dark:text-emerald-400">
              {stats.completion_rate}%
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Completion Rate
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
            <p className="text-2xl font-medium text-amber-600 dark:text-amber-400">
              {stats.by_status.in_progress}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              In Progress
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
            <p className="text-2xl font-medium text-red-600 dark:text-red-400">
              {stats.overdue}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Overdue
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Tasks by Status
            </h2>
            <div className="space-y-3">
              {[
                {
                  label: "Todo",
                  value: stats.by_status.todo,
                  color: "bg-gray-400",
                },
                {
                  label: "In Progress",
                  value: stats.by_status.in_progress,
                  color: "bg-amber-400",
                },
                {
                  label: "Done",
                  value: stats.by_status.done,
                  color: "bg-emerald-500",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {item.label}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-slate-300">
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{
                        width:
                          stats.total > 0
                            ? `${Math.round((item.value / stats.total) * 100)}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Tasks by Priority
            </h2>
            <div className="space-y-3">
              {[
                {
                  label: "High",
                  value: stats.by_priority.high,
                  color: "bg-red-500",
                },
                {
                  label: "Medium",
                  value: stats.by_priority.medium,
                  color: "bg-amber-400",
                },
                {
                  label: "Low",
                  value: stats.by_priority.low,
                  color: "bg-green-500",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {item.label}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-slate-300">
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{
                        width:
                          stats.total > 0
                            ? `${Math.round((item.value / stats.total) * 100)}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Overall Progress
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${stats.completion_rate}%` }}
              />
            </div>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 min-w-[40px]">
              {stats.completion_rate}%
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
            {stats.by_status.done} of {stats.total} tasks completed
          </p>
        </div>
      </div>
    </div>
  );
}
