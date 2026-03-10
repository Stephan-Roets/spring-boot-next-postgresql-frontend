"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import type { Todo } from "@/lib/types";
import { TodoCard } from "@/components/todos/todo-card";
import { TodoForm } from "@/components/todos/todo-form";
import { TodoFilters } from "@/components/todos/todo-filters";
import { Plus, ListTodo } from "lucide-react";
import { toast } from "sonner";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const loadTodos = async () => {
    try {
      const data = await api.getTodos();
      setTodos(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load tasks",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        (todo.description?.toLowerCase().includes(search.toLowerCase()) ??
          false) ||
        (todo.category?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesStatus =
        statusFilter === "ALL" || todo.status === statusFilter;
      const matchesPriority =
        priorityFilter === "ALL" || todo.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [todos, search, statusFilter, priorityFilter]);

  const handleCreate = async (data: Parameters<typeof api.createTodo>[0]) => {
    try {
      await api.createTodo(data);
      toast.success("Task created");
      await loadTodos();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task");
      throw err;
    }
  };

  const handleUpdate = async (data: Parameters<typeof api.createTodo>[0]) => {
    if (!editingTodo) return;
    try {
      await api.updateTodo(editingTodo.id, data);
      toast.success("Task updated");
      setEditingTodo(null);
      await loadTodos();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update task");
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.deleteTodo(id);
      toast.success("Task deleted");
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage and organize your work
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>

      <TodoFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border bg-card"
            />
          ))}
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16">
          <ListTodo className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">
            {todos.length === 0 ? "No tasks yet" : "No matching tasks"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {todos.length === 0
              ? "Create your first task to get started."
              : "Try adjusting your filters."}
          </p>
          {todos.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onEdit={(t) => setEditingTodo(t)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TodoForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}
      {editingTodo && (
        <TodoForm
          todo={editingTodo}
          onSubmit={handleUpdate}
          onClose={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
}
