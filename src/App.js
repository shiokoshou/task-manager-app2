import React, { useState, useEffect, useMemo } from 'react';
// アイコンの種類を修正
import { Plus, Edit3, Save, XCircle, Trash2, Calendar, Circle, CheckCircle2 } from 'lucide-react';
// アニメーション用のライブラリをインポート
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskManager() {
  // --- State Hooks ---
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Dateオブジェクトに復元
        return parsedTasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : null
        }));
      }
    } catch (error) {
      console.error('Failed to parse tasks from localStorage', error);
    }
    return [];
  });

  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState(''); // 新しいタスクの期日
  const [filter, setFilter] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDueDate, setEditingDueDate] = useState(''); // 編集中のタスクの期日

  // --- useEffect Hooks ---
  // tasksが変更されたらローカルストレージに保存
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage', error);
    }
  }, [tasks]);

  // --- Helper Functions ---
  // 期日を過ぎているかチェックする関数
  const isOverdue = (dueDate, completed) => {
    if (!dueDate || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時刻をリセットして日付のみで比較
    const taskDueDate = new Date(dueDate);
    taskDueDate.setHours(0, 0, 0, 0);
    return taskDueDate < today;
  };

  // --- Task Functions ---
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        {
          id: Date.now(),
          text: newTask.trim(),
          completed: false,
          createdAt: new Date(),
          dueDate: newDueDate ? new Date(newDueDate) : null // 期日を追加
        },
        ...tasks
      ]);
      setNewTask('');
      setNewDueDate(''); // 期日入力欄をリセット
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (editingTaskId === id) {
      cancelEditing();
    }
  };

  // --- Edit Functions ---
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
    // input[type=date] は 'YYYY-MM-DD' 形式を要求するため変換
    setEditingDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingText('');
    setEditingDueDate('');
  };

  const saveTask = (id) => {
    if (editingText.trim()) {
      setTasks(tasks.map(task =>
        task.id === id ? {
          ...task,
          text: editingText.trim(),
          dueDate: editingDueDate ? new Date(editingDueDate) : null
        } : task
      ));
      cancelEditing();
    } else {
      cancelEditing();
    }
  };

  // --- Filtering & Sorting ---
  const sortedAndFilteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
      })
      .sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        return b.createdAt - a.createdAt;
      });
  }, [tasks, filter]);

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 font-sans">
      <div className="max-w-2xl mx-auto pb-8">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Edit3 className="inline-block w-8 h-8 md:w-10 md:h-10 mr-3 text-indigo-600" />
            タスク管理アプリ
          </h1>
          <p className="text-gray-600">日々のタスクを効率的に管理しましょう</p>
        </header>

        {/* 統計情報 */}
        <section className="grid grid-cols-3 gap-4 mb-6">
           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-gray-800">{tasks.length}</div>
              <div className="text-sm text-gray-600">総タスク数</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-600">完了</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
              <div className="text-sm text-gray-600">未完了</div>
            </div>
          </motion.div>
        </section>
        
        {/* タスク追加フォーム */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              aria-label="期日"
            />
            <button
              onClick={addTask}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
              disabled={!newTask.trim()}
            >
              <Plus className="w-5 h-5" />
              <span>追加</span>
            </button>
          </div>
        </section>

        {/* フィルター */}
        <nav className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: `すべて (${tasks.length})` },
            { key: 'pending', label: `未完了 (${pendingCount})` },
            { key: 'completed', label: `完了済み (${completedCount})` }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                filter === filterOption.key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </nav>

        {/* タスクリスト */}
        <main className="space-y-4">
          <AnimatePresence>
            {sortedAndFilteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-md p-8 text-center"
              >
                <div className="text-gray-400 mb-4">
                  <Edit3 className="w-16 h-16 mx-auto opacity-30" />
                </div>
                <p className="text-gray-500 font-medium">
                  {filter === 'all' && 'タスクがありません。新しいタスクを追加してください。'}
                  {filter === 'pending' && '未完了のタスクはありません。🎉'}
                  {filter === 'completed' && '完了済みのタスクはありません。'}
                </p>
              </motion.div>
            ) : (
              sortedAndFilteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  className={`rounded-lg shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg ${task.completed ? 'bg-gray-50 opacity-70' : 'bg-white'}`}
                >
                  {editingTaskId === task.id ? (
                    // --- 編集モード ---
                    <div className="p-4 flex flex-col gap-3">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveTask(task.id)}
                        className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        autoFocus
                      />
                      <div className="flex gap-2 items-center">
                        <label htmlFor={`dueDate-${task.id}`} className="text-sm text-gray-600">期日:</label>
                        <input
                          id={`dueDate-${task.id}`}
                          type="date"
                          value={editingDueDate}
                          onChange={(e) => setEditingDueDate(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => saveTask(task.id)} className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-100 transition-colors duration-200" aria-label="Save changes">
                          <Save className="w-5 h-5" />
                        </button>
                        <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200" aria-label="Cancel editing">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // --- 通常表示モード ---
                    <div className="p-4 flex items-center gap-2 sm:gap-4">
                      <div className="flex-1 cursor-pointer" onDoubleClick={() => startEditing(task)}>
                        <p className={`text-lg transition-colors ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.text}
                        </p>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                          <span>
                            作成: {task.createdAt.toLocaleDateString('ja-JP')}
                          </span>
                          {task.dueDate && (
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs ${isOverdue(task.dueDate, task.completed) ? 'bg-red-500' : 'bg-blue-400'}`}>
                                <Calendar className="w-3 h-3" />
                                期日: {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                            onClick={() => toggleTask(task.id)}
                            className="p-2 rounded-lg transition-colors duration-200"
                            aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
                        >
                            {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                                <Circle className="w-5 h-5 text-gray-400 hover:text-green-500" />
                            )}
                        </button>
                        <button onClick={() => startEditing(task)} className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200" aria-label="Edit task">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200" aria-label="Delete task">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </main>
        
      </div>
    </div>
  );
}
