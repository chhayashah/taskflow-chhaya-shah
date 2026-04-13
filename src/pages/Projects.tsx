import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { getProjects, createProject, deleteProject } from "../api/projects";
import { Project } from "../types";

interface Props {
  dark: boolean;
  setDark: (v: boolean) => void;
}

export default function Projects({ dark, setDark }: Props) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Project name is required");
    setCreating(true);
    try {
      const project = await createProject(name, description);
      setProjects((prev) => [project, ...prev]);
      setShowModal(false);
      setName("");
      setDescription("");
      toast.success("Project created!");
    } catch {
      toast.error("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project and all its tasks?")) return;
    setDeletingId(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    try {
      await deleteProject(projectId);
      toast.success("Project deleted!");
    } catch {
      toast.error("Failed to delete project");
      fetchProjects();
    } finally {
      setDeletingId(null);
    }
  };

  const colors = [
    "bg-emerald-500",
    "bg-blue-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-purple-500",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar dark={dark} setDark={setDark} />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">
              Projects
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              Manage your projects and tasks
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all hover:shadow-md active:scale-95"
          >
            + New Project
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 animate-pulse"
              >
                <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-600 dark:text-slate-300 font-medium mb-1">
              No projects yet
            </p>
            <p className="text-gray-400 dark:text-slate-500 text-sm mb-4">
              Create your first project to get started
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all hover:shadow-md"
            >
              + Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="group bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors[idx % colors.length]}`}
                    />
                    <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h2>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, project.id)}
                    disabled={deletingId === project.id}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-all p-1 rounded"
                    title="Delete project"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>

                {project.description && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {project.task_count !== undefined && project.task_count > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${Math.round(((project.done_count || 0) / project.task_count) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">
                      {project.done_count}/{project.task_count} done
                    </span>
                  </div>
                )}

                {project.task_count === 0 && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">
                    No tasks yet
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
                  <p className="text-xs text-gray-400 dark:text-slate-500">
                    {new Date(project.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    View →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 w-full max-w-md shadow-xl">
            <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
              New Project
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-slate-400 block mb-1">
                  Project name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Website Redesign"
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-slate-400 block mb-1">
                  Description <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setName("");
                    setDescription("");
                  }}
                  className="text-sm text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 font-medium disabled:opacity-50 transition-all active:scale-95"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
