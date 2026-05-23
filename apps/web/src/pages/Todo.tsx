import React, { useEffect, useState } from 'react';
import { Todo, CreateTodo } from 'shared';
import { apiFetch } from '../api.ts';
import { useAuth } from '../AuthContext.tsx';
import { ThemeSelector } from '../ThemeSelector.tsx';
import { LanguageSelector } from '../LanguageSelector.tsx';
import { useTranslation } from 'react-i18next';

export const TodoPage = () => {
  const { t } = useTranslation();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const { user, logout } = useAuth();

  const fetchTodos = async () => {
    const res = await apiFetch('/todos');
    if (res.ok) {
      const data = await res.json();
      setTodos(data);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const payload: CreateTodo = { title: newTodoTitle };
    const res = await apiFetch('/todos', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setNewTodoTitle('');
      fetchTodos();
    }
  };

  const toggleTodo = async (todo: Todo) => {
    await apiFetch(`/todos/${todo.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: !todo.completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await apiFetch(`/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  return (
    <div className="min-h-screen bg-base-300 text-base-content">
      <div className="navbar bg-base-100 shadow-md px-4 lg:px-40 border-b border-base-content/10">
        <div className="flex-1">
          <span className="text-xl font-black text-primary tracking-tighter uppercase">Turbo Todo</span>
        </div>
        <div className="flex-none gap-4">
          <LanguageSelector />
          <ThemeSelector />
          <div className="divider divider-horizontal mx-0 opacity-20"></div>
          <span className="hidden sm:inline-block text-sm font-medium opacity-70">{t('todo.greeting')}, {user?.name}</span>
          <button 
            onClick={logout}
            className="btn btn-error btn-outline btn-sm"
          >
            {t('todo.logout')}
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl py-12 px-4">
        <div className="card bg-base-100 shadow-2xl border border-base-content/5">
          <div className="card-body gap-6">
            <h1 className="card-title text-4xl font-black mb-2 tracking-tight text-base-content">{t('todo.title')}</h1>
            
            <form onSubmit={addTodo} className="flex gap-2 mb-8">
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder={t('todo.placeholder')}
                className="input input-bordered input-primary flex-1 focus:ring-2"
              />
              <button
                type="submit"
                className="btn btn-primary px-6"
              >
                {t('todo.add')}
              </button>
            </form>

            <div className="divider">{t('todo.tasks')}</div>

            <ul className="space-y-2">
              {todos.length === 0 && (
                <div className="text-center py-10 opacity-40 italic">
                  {t('todo.no_tasks')}
                </div>
              )}
              {todos.map((todo) => (
                <li key={todo.id} className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-all border border-transparent hover:border-base-300 group">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo)}
                      className="checkbox checkbox-primary checkbox-md"
                    />
                    <span className={`text-lg transition-all ${todo.completed ? 'line-through opacity-40' : 'font-medium'}`}>
                      {todo.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10 transition-colors"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </li>
              ))}
            </ul>

            {todos.length > 0 && (
              <div className="mt-8 pt-4 border-t border-base-300 text-xs opacity-50 flex justify-between">
                <span>{todos.filter(t => !t.completed).length} {t('todo.remaining')}</span>
                <span>{todos.length} {t('todo.total')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
