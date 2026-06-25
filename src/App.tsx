import { useState, useEffect, useCallback } from 'react';
import type { RoutineData, TimeOfDay } from './types';
import { loadData, saveData, newTask } from './storage';
import RoutinePanel from './components/RoutinePanel';
import './index.css';

const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'];

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const w = WEEKDAY_JP[d.getDay()];
  return `${y}年${m}月${day}日（${w}）`;
}

export default function App() {
  const [data, setData] = useState<RoutineData>(() => loadData());
  const [today] = useState(() => formatDate(new Date()));

  useEffect(() => {
    saveData(data);
  }, [data]);

  const toggle = useCallback((type: TimeOfDay, id: string) => {
    setData(prev => ({
      ...prev,
      [type]: prev[type].map(t => t.id === id ? { ...t, done: !t.done } : t),
    }));
  }, []);

  const addTask = useCallback((type: TimeOfDay, text: string) => {
    setData(prev => {
      const maxOrder = prev[type].reduce((m, t) => Math.max(m, t.order), -1);
      return {
        ...prev,
        [type]: [...prev[type], newTask(text, maxOrder + 1)],
      };
    });
  }, []);

  const deleteTask = useCallback((type: TimeOfDay, id: string) => {
    setData(prev => ({
      ...prev,
      [type]: prev[type].filter(t => t.id !== id),
    }));
  }, []);

  const editTask = useCallback((type: TimeOfDay, id: string, text: string) => {
    setData(prev => ({
      ...prev,
      [type]: prev[type].map(t => t.id === id ? { ...t, text } : t),
    }));
  }, []);

  const moveTask = useCallback((type: TimeOfDay, id: string, direction: 'up' | 'down') => {
    setData(prev => {
      const sorted = [...prev[type]].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex(t => t.id === id);
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;

      const newSorted = [...sorted];
      const tmpOrder = newSorted[idx].order;
      newSorted[idx] = { ...newSorted[idx], order: newSorted[swapIdx].order };
      newSorted[swapIdx] = { ...newSorted[swapIdx], order: tmpOrder };

      return { ...prev, [type]: newSorted };
    });
  }, []);

  const resetChecks = useCallback((type: TimeOfDay) => {
    setData(prev => ({
      ...prev,
      [type]: prev[type].map(t => ({ ...t, done: false })),
    }));
  }, []);

  function bind(type: TimeOfDay) {
    return {
      tasks: data[type],
      onToggle: (id: string) => toggle(type, id),
      onAdd: (text: string) => addTask(type, text),
      onDelete: (id: string) => deleteTask(type, id),
      onEdit: (id: string, text: string) => editTask(type, id, text),
      onMoveUp: (id: string) => moveTask(type, id, 'up'),
      onMoveDown: (id: string) => moveTask(type, id, 'down'),
      onReset: () => resetChecks(type),
    };
  }

  const totalDone = data.morning.filter(t => t.done).length + data.night.filter(t => t.done).length;
  const total = data.morning.length + data.night.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            ルーティン管理
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">{today}</p>
          {total > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>本日の達成：</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{totalDone} / {total}</span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RoutinePanel type="morning" {...bind('morning')} />
          <RoutinePanel type="night" {...bind('night')} />
        </div>

        <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
          データはこのブラウザに保存されます。タスクのテキストはダブルクリックで編集できます。
        </footer>
      </div>
    </div>
  );
}
