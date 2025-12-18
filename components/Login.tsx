
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  
  const handleDemoLogin = (role: UserRole) => {
    const user: User = {
      id: role === UserRole.ADMIN ? 'admin-1' : 'c1',
      name: role === UserRole.ADMIN ? 'Business Owner' : 'Sarah Jenkins',
      email: role === UserRole.ADMIN ? 'admin@omni.ai' : 'sarah@example.com',
      role,
      avatar: `https://picsum.photos/seed/${role}/100/100`
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 bg-indigo-600 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-2xl mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">OmniSchedule AI</h1>
          <p className="text-indigo-100 opacity-80 mt-2">The future of client management</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 text-center">Login with Demo Account</h2>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => handleDemoLogin(UserRole.ADMIN)}
                className="w-full flex items-center justify-between p-4 border-2 border-slate-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 font-bold">A</div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">Admin Dashboard</p>
                    <p className="text-xs text-slate-500">Manage clients & view insights</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                onClick={() => handleDemoLogin(UserRole.CLIENT)}
                className="w-full flex items-center justify-between p-4 border-2 border-slate-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mr-3 font-bold">C</div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">Client Portal</p>
                    <p className="text-xs text-slate-500">Book and view appointments</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-white text-slate-400">Secure Environment</span></div>
          </div>
          
          <p className="text-center text-xs text-slate-400">
            OmniSchedule uses Gemini AI to automate and summarize your business interactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
