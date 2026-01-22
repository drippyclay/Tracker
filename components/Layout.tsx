
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'tracker' | 'dashboard';
  setActiveView: (view: 'tracker' | 'dashboard') => void;
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  setActiveView, 
  currentWeek, 
  setCurrentWeek 
}) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-emerald-400">CohortTrack Pro</h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">Cohort #24-A (10 Students)</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveView('tracker')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeView === 'tracker' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Weekly Tracker
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeView === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Master Dashboard
          </button>
        </nav>

        {activeView === 'tracker' && (
          <div className="p-4 bg-slate-800 mx-4 mb-6 rounded-xl border border-slate-700">
            <label className="text-xs uppercase text-slate-500 font-bold mb-2 block">Viewing Week</label>
            <select
              value={currentWeek}
              onChange={(e) => setCurrentWeek(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {[1, 2, 3, 4].map((w) => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">
                {activeView === 'tracker' ? `Week ${currentWeek} Tracking Sheet` : 'Cohort Overview Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500">Last updated: {new Date().toLocaleTimeString()}</span>
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">JD</div>
            </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
