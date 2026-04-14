// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import {
//   DndContext,
//   DragEndEvent,
//   DragOverEvent,
//   DragStartEvent,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   closestCorners,
//   DragOverlay,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   useSortable,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import Navbar from "../components/Navbar";
// import { getProject } from "../api/projects";
// import { updateTask, deleteTask, createTask } from "../api/tasks";
// import { Task, Project } from "../types";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Navbar from "../components/Navbar";
import { getProject } from "../api/projects";
import { updateTask, deleteTask, createTask } from "../api/tasks";
import type { Task, Project } from "../types";

const statusColumns: { key: Task["status"]; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const priorityConfig: Record<
  Task["priority"],
  { label: string; class: string }
> = {
  high: {
    label: "High",
    class:
      "bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  },
  medium: {
    label: "Medium",
    class:
      "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  },
  low: {
    label: "Low",
    class:
      "bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
};

const statusConfig: Record<Task["status"], { label: string; class: string }> = {
  todo: {
    label: "Todo",
    class: "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300",
  },
  in_progress: {
    label: "In Progress",
    class:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  done: {
    label: "Done",
    class:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
};

const emptyTask: Partial<Task> = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assignee_id: "",
  due_date: "",
};

interface Props {
  dark: boolean;
  setDark: (v: boolean) => void;
}

function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isDragging = false,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (task: Task, status: Task["status"]) => void;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-3 mb-2 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-2 mb-2">
        <div
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing flex-shrink-0 text-gray-400 hover:text-emerald-500 transition-colors"
          title="Drag to move"
        >
          <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor">
            <circle cx="3" cy="3" r="2" />
            <circle cx="9" cy="3" r="2" />
            <circle cx="3" cy="10" r="2" />
            <circle cx="9" cy="10" r="2" />
            <circle cx="3" cy="17" r="2" />
            <circle cx="9" cy="17" r="2" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-800 dark:text-slate-100 leading-snug flex-1">
          {task.title}
        </p>
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 dark:text-slate-500 mb-2 ml-5 line-clamp-2">
          {task.description}
        </p>
      )}

      {task.due_date &&
        new Date(task.due_date) < new Date() &&
        task.status !== "done" && (
          <div className="ml-5 mb-2">
            <span className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 px-2 py-0.5 rounded-full font-medium">
              🔴 Overdue
            </span>
          </div>
        )}

      <div className="flex items-center justify-between mb-2 ml-5">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityConfig[task.priority].class}`}
        >
          {priorityConfig[task.priority].label}
        </span>
        <div className="flex items-center gap-1">
          {task.due_date && (
            <span className="text-xs text-gray-400 dark:text-slate-500">
              {new Date(task.due_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
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
      </div>

      <select
        value={task.status}
        onChange={(e) => onStatusChange(task, e.target.value as Task["status"])}
        className={`text-xs border-0 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium cursor-pointer ${statusConfig[task.status].class}`}
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}

export default function ProjectDetail({ dark, setDark }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task>>(emptyTask);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskErrors, setTaskErrors] = useState<{
    title?: string;
    due_date?: string;
  }>({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "n" && !showModal) {
        e.preventDefault();
        openCreate();
      }
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showModal]);

  const fetchProject = async () => {
    try {
      const data = await getProject(id!);
      setProject(data);
      setTasks((data as any).tasks || []);
    } catch {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const validateTask = () => {
    const newErrors: { title?: string; due_date?: string } = {};
    if (!editingTask.title?.trim()) newErrors.title = "Title is required";
    else if (editingTask.title.trim().length < 3)
      newErrors.title = "Title must be at least 3 characters";
    if (editingTask.due_date) {
      const due = new Date(editingTask.due_date);
      if (isNaN(due.getTime())) newErrors.due_date = "Invalid date";
    }
    setTaskErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openCreate = () => {
    setEditingTask(emptyTask);
    setIsEditing(false);
    setTaskErrors({});
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditing(true);
    setTaskErrors({});
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateTask()) return;
    setSaving(true);
    try {
      if (isEditing && editingTask.id) {
        const updated = await updateTask(editingTask.id, editingTask);
        setTasks((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t)),
        );
        toast.success("Task updated!");
      } else {
        const created = await createTask(id!, editingTask);
        setTasks((prev) => [...prev, created]);
        toast.success("Task created!");
      }
      setShowModal(false);
    } catch {
      toast.error("Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task["status"]) => {
    const prevStatus = task.status;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)),
    );
    try {
      await updateTask(task.id, { status: newStatus });
      toast.success("Status updated!");
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: prevStatus } : t)),
      );
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await deleteTask(taskId);
      toast.success("Task deleted!");
    } catch {
      toast.error("Failed to delete task");
      fetchProject();
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;
    const overColumn = statusColumns.find((col) => col.key === overId);
    if (overColumn && activeTask.status !== overColumn.key) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: overColumn.key } : t,
        ),
      );
    }
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: overTask.status } : t,
        ),
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const activeId = active.id as string;
    const task = tasks.find((t) => t.id === activeId);
    if (!task) return;
    try {
      await updateTask(activeId, { status: task.status });
      toast.success(`Moved to ${task.status.replace("_", " ")}!`);
    } catch {
      toast.error("Failed to update task");
      fetchProject();
    }
  };

  const filtered = tasks.filter((t) => {
    const statusMatch = statusFilter === "all" || t.status === statusFilter;
    const assigneeMatch =
      assigneeFilter === "all" ||
      t.assignee_id === assigneeFilter ||
      (assigneeFilter === "unassigned" && !t.assignee_id);
    return statusMatch && assigneeMatch;
  });

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
        <Navbar dark={dark} setDark={setDark} />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-2 animate-pulse" />
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-1/2 mb-4" />
                {[1, 2].map((j) => (
                  <div
                    key={j}
                    className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 mb-2"
                  >
                    <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 dark:bg-slate-600 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar dark={dark} setDark={setDark} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">
              {project?.name}
            </h1>
            {project?.description && (
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/projects/${id}/stats`)}
              className="text-sm text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              Stats
            </button>
            <button
              onClick={openCreate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all hover:shadow-md active:scale-95"
            >
              + Add Task
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {["all", "todo", "in_progress", "done"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                statusFilter === s
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                  : "bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-gray-300"
              }`}
            >
              {s === "all"
                ? "All"
                : s === "in_progress"
                  ? "In Progress"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="ml-1.5 opacity-60">
                {s === "all"
                  ? tasks.length
                  : tasks.filter((t) => t.status === s).length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-full border bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            <option value="all">All assignees</option>
            <option value="unassigned">Unassigned</option>
            <option value="1">Chhaya Shah</option>
          </select>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statusColumns.map((col) => {
              const colTasks = filtered.filter((t) => t.status === col.key);
              return (
                <div
                  key={col.key}
                  id={col.key}
                  className="bg-gray-100 dark:bg-slate-800/50 rounded-xl p-3 min-h-[200px]"
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                      {col.label}
                    </span>
                    <span className="text-xs bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full px-2 py-0.5 text-gray-400">
                      {colTasks.length}
                    </span>
                  </div>

                  <SortableContext
                    items={colTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {colTasks.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg">
                        <p className="text-xs text-gray-400 dark:text-slate-500">
                          Drop tasks here
                        </p>
                      </div>
                    )}
                    {colTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                        isDragging={activeTask?.id === task.id}
                      />
                    ))}
                  </SortableContext>

                  <button
                    onClick={openCreate}
                    className="w-full text-xs text-gray-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 py-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all mt-1 border border-dashed border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                  >
                    + Add task
                  </button>
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="bg-white dark:bg-slate-800 rounded-lg border-2 border-emerald-400 p-3 shadow-xl rotate-2 cursor-grabbing">
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100">
                  {activeTask.title}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium mt-2 inline-block ${priorityConfig[activeTask.priority].class}`}
                >
                  {priorityConfig[activeTask.priority].label}
                </span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 w-full max-w-md shadow-xl">
            <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
              {isEditing ? "Edit Task" : "New Task"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4" noValidate>
              <div>
                <label className="text-sm text-gray-600 dark:text-slate-400 block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingTask.title || ""}
                  onChange={(e) => {
                    setEditingTask((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }));
                    if (taskErrors.title)
                      setTaskErrors((p) => ({ ...p, title: undefined }));
                  }}
                  placeholder="e.g. Design homepage"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white transition-colors ${
                    taskErrors.title
                      ? "border-red-400 dark:border-red-600"
                      : "border-gray-200 dark:border-slate-600"
                  }`}
                  autoFocus
                />
                {taskErrors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {taskErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-slate-400 block mb-1">
                  Description <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={editingTask.description || ""}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={2}
                  placeholder="Add more details..."
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-slate-400 block mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTask.priority || "medium"}
                    onChange={(e) =>
                      setEditingTask((prev) => ({
                        ...prev,
                        priority: e.target.value as Task["priority"],
                      }))
                    }
                    className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-slate-400 block mb-1">
                    Status
                  </label>
                  <select
                    value={editingTask.status || "todo"}
                    onChange={(e) =>
                      setEditingTask((prev) => ({
                        ...prev,
                        status: e.target.value as Task["status"],
                      }))
                    }
                    className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-slate-400 block mb-1">
                  Assignee <span className="text-gray-400">(optional)</span>
                </label>
                <select
                  value={editingTask.assignee_id || ""}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      assignee_id: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Unassigned</option>
                  <option value="1">Chhaya Shah</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-slate-400 block mb-1">
                  Due date <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="date"
                  value={editingTask.due_date || ""}
                  onChange={(e) => {
                    setEditingTask((prev) => ({
                      ...prev,
                      due_date: e.target.value,
                    }));
                    if (taskErrors.due_date)
                      setTaskErrors((p) => ({ ...p, due_date: undefined }));
                  }}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white transition-colors ${
                    taskErrors.due_date
                      ? "border-red-400 dark:border-red-600"
                      : "border-gray-200 dark:border-slate-600"
                  }`}
                />
                {taskErrors.due_date && (
                  <p className="text-xs text-red-500 mt-1">
                    {taskErrors.due_date}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-sm text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 font-medium disabled:opacity-50 transition-all active:scale-95"
                >
                  {saving
                    ? "Saving..."
                    : isEditing
                      ? "Update Task"
                      : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
