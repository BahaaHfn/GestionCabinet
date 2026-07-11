import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Stethoscope, Lock, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, registerUser, user, error, loading } = useAuthStore();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [cin, setCin] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState('MALE');
  const [bloodType, setBloodType] = useState('O+');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      const success = await registerUser({
        email,
        password,
        firstName,
        lastName,
        phone,
        cin,
        accountType: 'PATIENT',
        birthDate,
        sex,
        bloodType
      });
      if (success) {
        setIsRegister(false);
        setPassword('');
        alert('Registration successful! Please login.');
      }
    } else {
      const success = await login({ email, password });
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side: Premium illustration & Info banner */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-sky-950 items-center justify-center overflow-hidden">
        <img 
          src="/medical_office_hero.png" 
          alt="Medical Cabinet" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="relative z-10 text-center max-w-lg px-8 space-y-6">
          <div className="inline-flex p-4 bg-sky-500/20 text-sky-400 rounded-2xl border border-sky-400/30 backdrop-blur-md shadow-lg shadow-sky-500/10">
            <Stethoscope size={48} />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">SmartCare</h1>
            <p className="text-sky-200 text-lg font-medium">
              Simplify medical scheduling, patient records, and doctor consultations with an elegant, modern platform.
            </p>
          </div>
          <div className="flex justify-center gap-4 text-sky-300/80 text-sm font-semibold">
            <span>✓ Doctor Scheduling</span>
            <span>•</span>
            <span>✓ Clinical Timelines</span>
            <span>•</span>
            <span>✓ Prescriptions</span>
          </div>
        </div>
        <div className="absolute top-12 left-12 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-12 right-12 w-72 h-72 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Right side: Authenticate & Register portal */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-8 space-y-6">
          {/* Mobile Header only */}
          <div className="flex flex-col items-center space-y-2 text-center lg:hidden">
            <div className="p-3 bg-sky-500 text-white rounded-xl shadow-lg shadow-sky-100">
              <Stethoscope size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Cabinet Médical Portal</h2>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden lg:block">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">
              {isRegister ? 'Create your patient account' : 'Sign in to access your dashboard'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-100 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister ? (
              /* Registration Fields */
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">CIN / National ID</label>
                  <input
                    type="text"
                    required
                    value={cin}
                    onChange={(e) => setCin(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Gender</label>
                    <select
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none bg-white focus:border-sky-500"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Blood Type</label>
                    <select
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none bg-white focus:border-sky-500"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            ) : (
              /* Login Fields */
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@cabinet.com"
                      className="w-full text-sm border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-sky-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-sm border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-sky-500 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-sky-100 transition-all text-sm mt-4 disabled:bg-sky-400"
            >
              {loading 
                ? 'Loading...' 
                : isRegister 
                  ? 'Register Patient Account' 
                  : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
              }}
              className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
            >
              {isRegister 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Register as Patient"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
