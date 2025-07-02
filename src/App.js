import React, { useState } from 'react';
import { Plus, Check, X, Edit3 } from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date()
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.filter(task => !task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <Edit3 className="inline-block w-8 h-8 mr-3 text-indigo-600" />
            タスク管理アプリ
          </h1>
          <p className="text-gray-600">日々のタスクを効率的に管理しましょう</p>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-gray-800">{tasks.length}</div>
            <div className="text-sm text-gray-600">総タスク数</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-gray-600">完了</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            <div className="text-sm text-gray-600">未完了</div>
          </div>
        </div>

        {/* タスク追加フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <button
              onClick={addTask}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              追加
            </button>
          </div>
        </div>

        {/* フィルター */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'すべて' },
            { key: 'pending', label: '未完了' },
            { key: 'completed', label: '完了済み' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                filter === filterOption.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* タスクリスト */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Edit3 className="w-16 h-16 mx-auto opacity-30" />
              </div>
              <p className="text-gray-500">
                {filter === 'all' && 'タスクがありません。新しいタスクを追加してください。'}
                {filter === 'pending' && '未完了のタスクはありません。'}
                {filter === 'completed' && '完了済みのタスクはありません。'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow-md p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-lg ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4" />}
                </button>
                
                <div className="flex-1">
                  <div className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.text}
                  </div>
                  <div className="text-sm text-gray-400">
                    {task.createdAt.toLocaleDateString('ja-JP')} {task.createdAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* フッター */}
        <div className="text-center mt-8 text-gray-500">
          <p>© 2025 タスク管理アプリ - シンプルで効率的なタスク管理</p>
        </div>
      </div>
    </div>
  );
}