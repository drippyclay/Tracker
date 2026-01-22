
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './components/Layout';
import StatusDropdown from './components/StatusDropdown';
import Dashboard from './components/Dashboard';
import { INITIAL_STUDENTS, EMPTY_TASK_RECORDS, TASKS } from './constants';
import { AppState, Status, TaskRecords } from './types';
import { getCohortInsights } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'tracker' | 'dashboard'>('tracker');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Initialize data for 4 weeks for all students
  const [state, setState] = useState<AppState>(() => {
    const initialData: AppState['data'] = {};
    for (let w = 1; w <= 4; w++) {
      initialData[w] = {};
      INITIAL_STUDENTS.forEach(s => {
        initialData[w][s.id] = { ...EMPTY_TASK_RECORDS };
      });
    }
    return {
      students: INITIAL_STUDENTS,
      currentWeek: 1,
      data: initialData
    };
  });

  const handleStatusChange = (studentId: string, taskId: keyof TaskRecords, newStatus: Status) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [currentWeek]: {
          ...prev.data[currentWeek],
          [studentId]: {
            ...prev.data[currentWeek][studentId],
            [taskId]: newStatus
          }
        }
      }
    }));
  };

  const getStudentCompletionForWeek = (studentId: string, week: number) => {
    const records = state.data[week][studentId];
    const completed = Object.values(records).filter(s => s === 'Completed').length;
    return (completed / 6) * 100;
  };

  const generateInsights = async () => {
    setLoadingInsights(true);
    
    // Simple stats aggregation for prompt
    let totalCompleted = 0;
    let totalItems = 0;
    const risk: string[] = [];
    const high: string[] = [];
    let hw1Completed = 0;
    let groupAttend = 0;

    state.students.forEach(s => {
      let stCount = 0;
      Object.values(state.data).forEach(w => {
        Object.values(w[s.id]).forEach(stat => {
          totalItems++;
          if (stat === 'Completed') {
            totalCompleted++;
            stCount++;
          }
        });
        if (w[s.id].hw1 === 'Completed') hw1Completed++;
        if (w[s.id].group1 === 'Completed' || w[s.id].group2 === 'Completed') groupAttend++;
      });
      
      const rate = (stCount / (6 * 4)) * 100;
      if (rate < 30) risk.push(s.name);
      if (rate > 80) high.push(s.name);
    });

    const stats = {
        completionRate: ((totalCompleted / totalItems) * 100).toFixed(1),
        riskStudents: risk.length ? risk : ['None'],
        topPerformers: high.length ? high : ['None'],
        tasks: {
            hw1: ((hw1Completed / (10 * 4)) * 100).toFixed(0),
            attendance: ((groupAttend / (20 * 4)) * 100).toFixed(0)
        }
    };

    const insights = await getCohortInsights(stats);
    setAiInsights(insights);
    setLoadingInsights(false);
  };

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView} 
      currentWeek={currentWeek} 
      setCurrentWeek={setCurrentWeek}
    >
      {activeView === 'tracker' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10 w-48">Student Name</th>
                    {TASKS.map(task => (
                      <th key={task.id} className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">{task.label}</th>
                    ))}
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {state.students.map(student => {
                    const completion = getStudentCompletionForWeek(student.id, currentWeek);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white group-hover:bg-slate-50 z-10">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">{student.name}</span>
                            <span className="text-xs text-slate-500">{student.email}</span>
                          </div>
                        </td>
                        {TASKS.map(task => (
                          <td key={task.id} className="px-4 py-4 whitespace-nowrap">
                            <StatusDropdown 
                              value={state.data[currentWeek][student.id][task.id as keyof TaskRecords]}
                              onChange={(val) => handleStatusChange(student.id, task.id as keyof TaskRecords, val)}
                            />
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                             <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${completion === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${completion}%` }}></div>
                             </div>
                             <span className="text-xs font-bold text-slate-700 w-8">{Math.round(completion)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-600 p-2 rounded-lg text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-emerald-900 font-bold">AI Performance Coach</h3>
              </div>
              <button 
                onClick={generateInsights}
                disabled={loadingInsights}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {loadingInsights ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Analyzing...
                  </>
                ) : 'Get Cohort Insights'}
              </button>
            </div>
            
            {aiInsights ? (
              <div className="prose prose-emerald max-w-none text-emerald-800 text-sm leading-relaxed whitespace-pre-wrap">
                {aiInsights}
              </div>
            ) : (
              <p className="text-emerald-700 text-sm opacity-80">Click the button above to have Gemini analyze your cohort data for potential risks and high-performers.</p>
            )}
          </div>
        </div>
      ) : (
        <Dashboard students={state.students} data={state.data} />
      )}
    </Layout>
  );
};

export default App;
