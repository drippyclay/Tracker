
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend
} from 'recharts';
import { Student, WeeklyData, Status } from '../types';
import { TASKS } from '../constants';

interface DashboardProps {
  students: Student[];
  data: { [week: number]: WeeklyData };
}

const Dashboard: React.FC<DashboardProps> = ({ students, data }) => {
  // Aggregate stats across all weeks
  const getStudentStats = (studentId: string) => {
    let totalTasks = 0;
    let completedTasks = 0;

    Object.values(data).forEach(weekData => {
      const records = weekData[studentId];
      if (records) {
        Object.values(records).forEach(status => {
          totalTasks++;
          if (status === 'Completed') completedTasks++;
        });
      }
    });

    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const chartData = students.map(s => ({
    name: s.name.split(' ')[0],
    percentage: parseFloat(getStudentStats(s.id).toFixed(1)),
    id: s.id
  }));

  const taskCompletionStats = TASKS.map(task => {
    let completed = 0;
    let total = 0;
    Object.values(data).forEach(weekData => {
      Object.values(weekData).forEach(records => {
        total++;
        if ((records as any)[task.id] === 'Completed') completed++;
      });
    });
    return { name: task.label, count: completed };
  });

  const overallAvg = chartData.reduce((acc, curr) => acc + curr.percentage, 0) / students.length;

  return (
    <div className="space-y-8">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Average Progress</p>
          <p className="text-3xl font-bold text-slate-900">{overallAvg.toFixed(1)}%</p>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${overallAvg}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Top Student</p>
          <p className="text-3xl font-bold text-slate-900">
            {chartData.sort((a,b) => b.percentage - a.percentage)[0].name}
          </p>
          <p className="text-emerald-600 text-xs font-bold mt-1">Leading the cohort</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Active Students</p>
          <p className="text-3xl font-bold text-slate-900">10 / 10</p>
          <p className="text-blue-600 text-xs font-bold mt-1">Full engagement</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Total Items Tracked</p>
          <p className="text-3xl font-bold text-slate-900">240</p>
          <p className="text-slate-400 text-xs font-bold mt-1">6 tasks × 10 students × 4 weeks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Progress Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-slate-800 font-bold mb-6">Student Achievement (%)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} unit="%" />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.percentage > 80 ? '#10b981' : entry.percentage > 50 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-slate-800 font-bold mb-6">Task Completion Volume</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart layout="vertical" data={taskCompletionStats}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={80} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
