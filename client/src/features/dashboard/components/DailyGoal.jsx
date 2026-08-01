import React, { useState } from 'react';
import { Calendar, Clock, Check } from 'lucide-react';

export default function DailyGoal({ dailyGoals }) {
  const [tasks, setTasks] = useState(dailyGoals.tasks);

  const toggleTask = (taskId) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-sm text-left transition-colors theme-transition flex flex-col justify-between h-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4.5 w-4.5 text-blue-500" />
          <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
            Today's Plan
          </h3>
        </div>
        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
          {dailyGoals.date}
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-3.5 flex-1">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            onClick={() => toggleTask(task.id)}
            className="flex items-start gap-3 cursor-pointer group"
          >
            {/* Custom Checkbox */}
            <div className={`
              w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors mt-0.5
              ${task.completed 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] group-hover:border-blue-400'}
            `}>
              {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </div>

            {/* Task Text */}
            <span className={`
              text-xs font-semibold select-none transition-colors
              ${task.completed 
                ? 'text-emerald-500 dark:text-emerald-400 line-through' 
                : 'text-gray-700 dark:text-gray-300'}
            `}>
              {task.text}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 space-y-3">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-gray-500">
            <span>DAILY PROGRESS</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Estimated Time */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold">
          <Clock className="h-4 w-4" />
          <span>Estimated Time: <span className="text-[#111111] dark:text-white">{dailyGoals.estimatedTime}</span></span>
        </div>
      </div>
    </div>
  );
}
