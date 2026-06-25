import { useState } from 'react';
import type { RoutineTask } from '../types';

interface Props {
  task: RoutineTask;
  isFirst: boolean;
  isLast: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export default function TaskItem({
  task,
  isFirst,
  isLast,
  onToggle,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  function commitEdit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) {
      onEdit(task.id, trimmed);
    } else {
      setEditText(task.text);
    }
    setEditing(false);
  }

  return (
    <div className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 group ${
      task.done
        ? 'bg-gray-50 border-gray-100 dark:bg-gray-800/40 dark:border-gray-700/40'
        : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm'
    }`}>
      {/* チェックボックス */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          task.done
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
        }`}
        aria-label={task.done ? '未完了にする' : '完了にする'}
      >
        {task.done && (
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* テキスト */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === 'Enter') commitEdit();
              if (e.key === 'Escape') { setEditText(task.text); setEditing(false); }
            }}
            className="w-full text-sm bg-transparent border-b border-blue-400 outline-none dark:text-gray-100"
          />
        ) : (
          <span
            onDoubleClick={() => { setEditing(true); setEditText(task.text); }}
            className={`text-sm block truncate cursor-default select-none transition-all duration-200 ${
              task.done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'
            }`}
            title="ダブルクリックで編集"
          >
            {task.text}
          </span>
        )}
      </div>

      {/* 操作ボタン（ホバー時表示） */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onMoveUp(task.id)}
          disabled={isFirst}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-20 disabled:cursor-not-allowed text-gray-500 dark:text-gray-400"
          aria-label="上に移動"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <path d="M7 10.5V3.5M3.5 7L7 3.5L10.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => onMoveDown(task.id)}
          disabled={isLast}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-20 disabled:cursor-not-allowed text-gray-500 dark:text-gray-400"
          aria-label="下に移動"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <path d="M7 3.5V10.5M10.5 7L7 10.5L3.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => { setEditing(true); setEditText(task.text); }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          aria-label="編集"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <path d="M9.5 2.5L11.5 4.5L4.5 11.5H2.5V9.5L9.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
          aria-label="削除"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 4.5H11.5M5 4.5V2.5H9V4.5M5.5 7V10.5M8.5 7V10.5M3 4.5L3.5 11.5H10.5L11 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
