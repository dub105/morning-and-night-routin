import { useState } from 'react';
import type { RoutineTask, TimeOfDay } from '../types';
import TaskItem from './TaskItem';

interface Props {
  type: TimeOfDay;
  tasks: RoutineTask[];
  onToggle: (id: string) => void;
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onReset: () => void;
}

const CONFIG = {
  morning: {
    label: '朝のルーティン',
    icon: '🌅',
    gradient: 'from-amber-400 to-orange-500',
    lightBg: 'bg-amber-50 dark:bg-amber-900/10',
    border: 'border-amber-200 dark:border-amber-800/40',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    addBtn: 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500',
    resetBtn: 'text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300',
  },
  night: {
    label: '夜のルーティン',
    icon: '🌙',
    gradient: 'from-indigo-500 to-purple-600',
    lightBg: 'bg-indigo-50 dark:bg-indigo-900/10',
    border: 'border-indigo-200 dark:border-indigo-800/40',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    addBtn: 'bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500',
    resetBtn: 'text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300',
  },
};

export default function RoutinePanel({
  type,
  tasks,
  onToggle,
  onAdd,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  onReset,
}: Props) {
  const [newText, setNewText] = useState('');
  const cfg = CONFIG[type];
  const sorted = [...tasks].sort((a, b) => a.order - b.order);
  const doneCount = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const allDone = total > 0 && doneCount === total;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  function handleAdd() {
    const trimmed = newText.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewText('');
  }

  return (
    <div className={`flex flex-col rounded-2xl border ${cfg.border} ${cfg.lightBg} overflow-hidden`}>
      {/* ヘッダー */}
      <div className={`bg-gradient-to-r ${cfg.gradient} p-5 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{cfg.icon}</span>
            <h2 className="text-xl font-semibold tracking-tight">{cfg.label}</h2>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full bg-white/20`}>
            {doneCount} / {total}
          </span>
        </div>

        {/* プログレスバー */}
        <div className="mt-3">
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {allDone && total > 0 && (
            <p className="mt-2 text-sm text-white/90 font-medium text-center">
              ✨ 全て完了！お疲れ様！
            </p>
          )}
        </div>
      </div>

      {/* タスクリスト */}
      <div className="flex-1 p-4 space-y-2">
        {sorted.length === 0 && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-6">
            タスクがありません。下から追加してください。
          </p>
        )}
        {sorted.map((task, i) => (
          <TaskItem
            key={task.id}
            task={task}
            isFirst={i === 0}
            isLast={i === sorted.length - 1}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          />
        ))}
      </div>

      {/* タスク追加フォーム */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="タスクを追加..."
            className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 dark:focus:ring-blue-700"
          />
          <button
            onClick={handleAdd}
            disabled={!newText.trim()}
            className={`px-4 py-2 rounded-xl text-white text-sm font-medium ${cfg.addBtn} disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150`}
          >
            追加
          </button>
        </div>

        {/* リセットボタン */}
        <div className="flex justify-end mt-2">
          <button
            onClick={onReset}
            className={`text-xs ${cfg.resetBtn} transition-colors duration-150`}
          >
            チェックをリセット
          </button>
        </div>
      </div>
    </div>
  );
}
