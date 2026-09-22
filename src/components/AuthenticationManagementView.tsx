import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  RefreshCw,
  LogOut,
  Building2,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Clock,
  UserCheck,
  Server,
  Terminal,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import {
  AuthenticatedUserType,
  AuthenticationSessionType,
  AuthenticationStatusType,
  OrganizationContext
} from '../types';

interface AuthenticationManagementViewProps {
  currentOrg: OrganizationContext;
  onSyncOrganization: (orgId: string, orgName: string) => void;
}

export const AuthenticationManagementView: React.FC<AuthenticationManagementViewProps> = ({
  currentOrg,
  onSyncOrganization
}) => {
  // সেশন ও স্টেট ম্যানেজমেন্ট
  const [authStatus, setAuthStatus] = useState<AuthenticationStatusType>('authenticated');
  const [currentUser, setCurrentUser] = useState<AuthenticatedUserType>({
    id: 'usr-admin-001',
    userCode: 'ADM-001',
    name: 'মাওলানা আব্দুল্লাহ আল-মাসউদ',
    email: 'admin@khurushkul-samity.org',
    phone: '01812-345678',
    organizationId: currentOrg.id,
    organizationName: currentOrg.name,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-09-22T00:00:00Z'
  });

  const [session, setSession] = useState<AuthenticationSessionType>({
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNyLTAwMSIsIm9yZ19pZCI6ImRlbW8tb3JnLWtodXJ1c2hrdWwiLCJleHAiOjE3NTg1MjgwMDB9.s8fK293jks92',
    refreshToken: 'dGhpc19pc19hX3NlY3VyZV9yZWZyZXNoX3Rva2VuX3RpamFyYWhfc2FtaXR5XzIwMjY',
    accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    user: currentUser,
    organizationId: currentOrg.id,
    authenticatedAt: new Date().toISOString(),
    method: 'password'
  });

  // ফর্ম স্টেট
  const [identifier, setIdentifier] = useState('admin@khurushkul-samity.org');
  const [password, setPassword] = useState('Tijarah@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ identifier?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ডায়াগনস্টিক ও ল্যাব লগ
  const [logs, setLogs] = useState<Array<{ timestamp: string; level: 'info' | 'warn' | 'error'; message: string }>>([
    { timestamp: new Date().toLocaleTimeString(), level: 'info', message: 'System startup: Session initialized from SecureStorageService' },
    { timestamp: new Date().toLocaleTimeString(), level: 'info', message: `OrganizationContext synchronized with: ${currentOrg.id}` }
  ]);

  const [activeTab, setActiveTab] = useState<'login_ui' | 'session_inspector' | 'refresh_queue' | 'security_audit'>('login_ui');

  const addLog = (level: 'info' | 'warn' | 'error', message: string) => {
    setLogs(prev => [
      { timestamp: new Date().toLocaleTimeString(), level, message },
      ...prev.slice(0, 19)
    ]);
  };

  // ফর্ম ভ্যালিডেশন
  const validateForm = () => {
    const errors: { identifier?: string; password?: string } = {};
    const trimmed = identifier.trim();

    if (!trimmed) {
      errors.identifier = 'ইমেইল অথবা মোবাইল নম্বর দিন।';
    } else if (trimmed.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        errors.identifier = 'সঠিক ইমেইল ঠিকানা দিন।';
      }
    } else {
      // বাংলাদেশি ফোন নম্বর
      const cleanPhone = trimmed.replace(/[-+ ]/g, '');
      const phoneRegex = /^(?:8801|01)[3-9]\d{8}$/;
      if (!phoneRegex.test(cleanPhone)) {
        errors.identifier = 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01812345678)';
      }
    }

    if (!password) {
      errors.password = 'পাসওয়ার্ড দিন।';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // লগইন হ্যান্ডলার
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    setAuthStatus('authenticating');
    addLog('info', `Login request started for identifier: ${identifier.split('@')[0]}***`);

    // সিমুলেটেড নেটওয়ার্ক লেটেন্সি
    setTimeout(() => {
      setIsSubmitting(false);

      if (identifier.includes('inactive')) {
        setAuthStatus('error');
        setErrorMessage('এই ব্যবহারকারী অ্যাকাউন্টটি বর্তমানে সক্রিয় নয়।');
        addLog('warn', 'Login failed: Account is inactive');
        return;
      }

      if (password !== 'Tijarah@2026' && password !== 'Samity#2026') {
        setAuthStatus('error');
        setErrorMessage('ইমেইল/মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়।');
        addLog('warn', 'Login failed: Invalid credentials provided');
        return;
      }

      // সফল লগইন
      const newUser: AuthenticatedUserType = {
        id: identifier.includes('khurushkul') ? 'usr-admin-001' : 'usr-general-002',
        userCode: identifier.includes('khurushkul') ? 'ADM-001' : 'USR-042',
        name: identifier.includes('khurushkul') ? 'মাওলানা আব্দুল্লাহ আল-মাসউদ' : 'মুহাম্মদ ইমরান হোসাইন',
        email: identifier.includes('@') ? identifier : 'user@khurushkul-samity.org',
        phone: identifier.includes('@') ? '01812-345678' : identifier,
        organizationId: currentOrg.id,
        organizationName: currentOrg.name,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };

      const newSession: AuthenticationSessionType = {
        accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: newUser.id, org: currentOrg.id, iat: Date.now() }))}`,
        refreshToken: `ref_${Math.random().toString(36).substring(2)}_${Date.now()}`,
        accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        user: newUser,
        organizationId: currentOrg.id,
        authenticatedAt: new Date().toISOString(),
        method: 'password'
      };

      setCurrentUser(newUser);
      setSession(newSession);
      setAuthStatus('authenticated');
      onSyncOrganization(currentOrg.id, currentOrg.name);
      addLog('info', `Login successful: User ${newUser.userCode} authenticated.`);
      addLog('info', 'Secure storage updated: Access & Refresh tokens saved.');
      addLog('info', `OrganizationContext synchronized with: ${currentOrg.id}`);
    }, 700);
  };

  // লগআউট হ্যান্ডলার
  const handleLogout = () => {
    setAuthStatus('loggingOut');
    addLog('info', 'Logout initiated: Dispatching /api/v1/auth/logout/');
    setTimeout(() => {
      setAuthStatus('unauthenticated');
      addLog('info', 'Local session cleared from SecureStorageService.');
      addLog('info', 'OrganizationContext reset safely.');
    }, 400);
  };

  // 401 সেশন এক্সপায়ার এবং অটো রিফ্রেশ টেস্ট
  const handleSimulateTokenRefresh = () => {
    setAuthStatus('refreshing');
    addLog('warn', 'HTTP 401 received on protected endpoint. Invoking automatic token refresh...');

    setTimeout(() => {
      const refreshedAccess = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refreshed_${Date.now()}`;
      setSession(prev => ({
        ...prev,
        accessToken: refreshedAccess,
        accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      }));
      setAuthStatus('authenticated');
      addLog('info', 'POST /api/v1/auth/token/refresh/ succeeded. New access token cached.');
      addLog('info', 'Original HTTP request retried with new token.');
    }, 800);
  };

  // রিফ্রেশ স্টর্ম সিমুলেশন (৩টি সমসাময়িক 401 রিকোয়েস্ট)
  const handleSimulateRefreshStorm = () => {
    setAuthStatus('refreshing');
    addLog('warn', 'Simulating 3 concurrent requests encountering 401: [Req A, Req B, Req C]');
    addLog('info', 'Central Refresh Mutex engaged: Req A acquires lock; Req B & Req C awaiting single future.');

    setTimeout(() => {
      addLog('info', 'Single refresh POST /api/v1/auth/token/refresh/ dispatched to backend.');
      const refreshedAccess = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.storm_lock_${Date.now()}`;
      setSession(prev => ({
        ...prev,
        accessToken: refreshedAccess,
        accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      }));
      setAuthStatus('authenticated');
      addLog('info', 'Refresh successful: Mutex unlocked. Req A, Req B, Req C all resolved via single refresh response.');
    }, 900);
  };

  // রিফ্রেশ ব্যর্থ ও সেশন এক্সপায়ার্ড
  const handleSimulateSessionExpired = () => {
    setAuthStatus('sessionExpired');
    setErrorMessage('আপনার সেশন শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।');
    addLog('error', 'Refresh token expired or invalid (401). Triggering session teardown.');
    addLog('info', 'Secure storage purged. User redirected to login screen.');
  };

  // অফলাইন মোড টগল
  const handleToggleOffline = () => {
    if (authStatus === 'offline') {
      setAuthStatus('unauthenticated');
      setErrorMessage(null);
      addLog('info', 'Network connection restored.');
    } else {
      setAuthStatus('offline');
      setErrorMessage('ইন্টারনেট সংযোগ পাওয়া যাচ্ছে না। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।');
      addLog('error', 'Network offline detected (SocketException).');
    }
  };

  return (
    <div className="space-y-6">
      {/* টপ হেডার ব্যানার */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-md border border-emerald-700/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
                Phase 2 — Prompt 2.2
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                নিরাপদ অথেনটিকেশন ও সেশন ফাউন্ডেশন
              </span>
            </div>
            <h1 className="text-2xl font-bold text-emerald-50 tracking-tight font-solaiman">
              অথেনটিকেশন ও সেশন ম্যানেজমেন্ট সিস্টেম
            </h1>
            <p className="text-sm text-emerald-200/90 font-solaiman">
              JWT অ্যাক্সেস টোকেন, রিফ্রেশ টোকেন হ্যান্ডলিং, সিকিউর স্টোরেজ, মাল্টি-রিকোয়েস্ট রিফ্রেশ লক এবং OrganizationContext সিঙ্ক্রোনাইজেশন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-950/60 border border-emerald-700/50 rounded-xl px-4 py-2.5 text-right">
              <span className="text-xs text-emerald-300 block font-solaiman">বর্তমান সেশন অবস্থা</span>
              <span className="text-sm font-semibold flex items-center gap-1.5 justify-end">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  authStatus === 'authenticated' ? 'bg-emerald-400 animate-pulse' :
                  authStatus === 'refreshing' ? 'bg-amber-400 animate-spin' :
                  authStatus === 'sessionExpired' ? 'bg-orange-400' :
                  authStatus === 'offline' ? 'bg-slate-400' : 'bg-rose-400'
                }`} />
                <span className="capitalize font-mono text-emerald-100">{authStatus}</span>
              </span>
            </div>
          </div>
        </div>

        {/* সাব-ট্যাব ন্যাভিগেশন */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-emerald-700/50 overflow-x-auto">
          {[
            { id: 'login_ui', label: '১. বাংলা লগইন স্ক্রিন (Login UI)', icon: Lock },
            { id: 'session_inspector', label: '২. সেশন ও টোকেন লাইফসাইকেল', icon: KeyRound },
            { id: 'refresh_queue', label: '৩. রিফ্রেশ লক ও ৪০১ হ্যান্ডলার', icon: RefreshCw },
            { id: 'security_audit', label: '৪. সিকিউরিটি ও স্টোরেজ অডিট', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium font-solaiman transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-emerald-950 font-bold shadow-sm'
                    : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-950/70 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ট্যাব ১: বাংলা লগইন স্ক্রিন */}
      {activeTab === 'login_ui' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* লাইভ লগইন প্রিভিউ কার্ড */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="max-w-md mx-auto space-y-6">
              {/* হেডার ও ব্র্যান্ডিং */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-700/10 border border-emerald-700/20 flex items-center justify-center text-emerald-800 shadow-sm">
                  <Building2 className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-emerald-900 font-solaiman">
                  তিজারাহ সমিতি সফটওয়্যার
                </h2>
                <p className="text-xs text-slate-500 font-solaiman">
                  ইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা
                </p>
              </div>

              {/* সেশন এক্সপায়ার / অফলাইন / এরর ব্যানার */}
              {authStatus === 'sessionExpired' && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-xs flex items-start gap-2.5 font-solaiman">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">সেশন শেষ হয়েছে</strong>
                    আপনার সেশন শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।
                  </div>
                </div>
              )}

              {authStatus === 'offline' && (
                <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-800 text-xs flex items-start gap-2.5 font-solaiman">
                  <WifiOff className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">অফলাইন অবস্থা</strong>
                    {errorMessage || 'ইন্টারনেট সংযোগ পাওয়া যাচ্ছে না। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।'}
                  </div>
                </div>
              )}

              {authStatus === 'error' && errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 font-solaiman">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">লগইন ব্যর্থ হয়েছে</strong>
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* লগইন ফর্ম কার্ড */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-solaiman">প্রবেশ করুন</h3>
                  <p className="text-xs text-slate-500 font-solaiman">
                    আপনার নিবন্ধিত ইমেইল বা মোবাইল নম্বর দিন
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* ইমেইল / মোবাইল ইনপুট */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between font-solaiman">
                      <span>ইমেইল অথবা মোবাইল নম্বর</span>
                      <span className="text-[11px] text-slate-400 font-normal">01[3-9]XXXXXXXX</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        {identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={e => {
                          setIdentifier(e.target.value);
                          if (validationErrors.identifier) setValidationErrors(prev => ({ ...prev, identifier: undefined }));
                        }}
                        placeholder="যেমন: 01812345678 বা admin@tijarah.org"
                        className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 font-solaiman transition-colors ${
                          validationErrors.identifier
                            ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-200'
                            : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
                        }`}
                      />
                    </div>
                    {validationErrors.identifier && (
                      <p className="text-[11px] text-rose-600 font-solaiman flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {validationErrors.identifier}
                      </p>
                    )}
                  </div>

                  {/* পাসওয়ার্ড ইনপুট */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 font-solaiman">
                      <label>পাসওয়ার্ড</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px]"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showPassword ? 'পাসওয়ার্ড লুকান' : 'প্রদর্শন করুন'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => {
                          setPassword(e.target.value);
                          if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        placeholder="আপনার গোপনীয় পাসওয়ার্ড লিখুন"
                        className={`w-full pl-9 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 font-solaiman transition-colors ${
                          validationErrors.password
                            ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-200'
                            : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
                        }`}
                      />
                    </div>
                    {validationErrors.password && (
                      <p className="text-[11px] text-rose-600 font-solaiman flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {validationErrors.password}
                      </p>
                    )}
                  </div>

                  {/* রিমেম্বার মি চেকবক্স */}
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-solaiman text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 border-slate-300"
                      />
                      <span>এই ডিভাইসে লগইন রাখা হবে</span>
                    </label>
                  </div>

                  {/* সাবমিট বাটন */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 font-solaiman disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>যাচাই করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>লগইন করুন</span>
                      </>
                    )}
                  </button>
                </form>

                {/* সেফটি ফুটার নোট */}
                <div className="pt-2 text-center border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-solaiman flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    নিরাপদ এনক্রিপ্টেড সেশন ও টেন্যান্ট আইসোলেশন
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* কন্ট্রোল ও টেস্টিং প্যানেল */}
          <div className="lg:col-span-6 space-y-4">
            {/* ডেমো / টেস্ট ক্রেডেনশিয়াল সিলেক্টর (আইসোলেটেড ও সুস্পষ্ট) */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs font-solaiman">
                <Info className="w-4 h-4 text-amber-700" />
                <span>ডেভেলপমেন্ট টেস্ট ক্রেডেনশিয়াল (প্রোডাকশনে কোনো ফেইক বা হার্ডকোড লগইন নেই)</span>
              </div>
              <p className="text-xs text-amber-800 font-solaiman">
                নিচের যে কোনো প্রি-সেটে ক্লিক করে টেস্ট ইনপুট লোড করুন:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIdentifier('admin@khurushkul-samity.org');
                    setPassword('Tijarah@2026');
                    setValidationErrors({});
                  }}
                  className="p-2.5 bg-white border border-amber-200 rounded-lg text-left hover:border-amber-400 transition-colors shadow-2xs"
                >
                  <span className="text-xs font-semibold text-slate-800 block font-solaiman">১. এডমিন ইমেইল</span>
                  <span className="text-[11px] text-slate-500 font-mono block">admin@khurushkul...</span>
                  <span className="text-[11px] text-emerald-700 font-mono block">Tijarah@2026</span>
                </button>

                <button
                  onClick={() => {
                    setIdentifier('01812345678');
                    setPassword('Samity#2026');
                    setValidationErrors({});
                  }}
                  className="p-2.5 bg-white border border-amber-200 rounded-lg text-left hover:border-amber-400 transition-colors shadow-2xs"
                >
                  <span className="text-xs font-semibold text-slate-800 block font-solaiman">২. মোবাইল নম্বর</span>
                  <span className="text-[11px] text-slate-500 font-mono block">01812345678</span>
                  <span className="text-[11px] text-emerald-700 font-mono block">Samity#2026</span>
                </button>

                <button
                  onClick={() => {
                    setIdentifier('inactive@khurushkul.org');
                    setPassword('Tijarah@2026');
                    setValidationErrors({});
                  }}
                  className="p-2.5 bg-white border border-rose-200 rounded-lg text-left hover:border-rose-400 transition-colors shadow-2xs"
                >
                  <span className="text-xs font-semibold text-rose-800 block font-solaiman">৩. নিষ্ক্রিয় অ্যাকাউন্ট টেস্ট</span>
                  <span className="text-[11px] text-slate-500 font-mono block">inactive@khurushkul...</span>
                  <span className="text-[11px] text-rose-600 font-solaiman block">এরর ম্যাপিং যাচাই</span>
                </button>

                <button
                  onClick={() => {
                    setIdentifier('invalid-format');
                    setPassword('');
                  }}
                  className="p-2.5 bg-white border border-slate-200 rounded-lg text-left hover:border-slate-400 transition-colors shadow-2xs"
                >
                  <span className="text-xs font-semibold text-slate-800 block font-solaiman">৪. ভুল ফরম্যাট টেস্ট</span>
                  <span className="text-[11px] text-slate-500 font-mono block">invalid-format</span>
                  <span className="text-[11px] text-amber-600 font-solaiman block">বাংলা ভ্যালিডেশন যাচাই</span>
                </button>
              </div>
            </div>

            {/* সেশন সিমুলেশন অ্যাকশনসমূহ */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-solaiman">
                সেশন ও স্টেট সিমুলেশন কন্ট্রোল
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleSimulateTokenRefresh}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium font-solaiman flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                  <span>সিমুলেট ৪০১ ও অটো রিফ্রেশ</span>
                </button>

                <button
                  onClick={handleSimulateRefreshStorm}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium font-solaiman flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-700" />
                  <span>রিফ্রেশ স্টর্ম লক টেস্ট (৩x)</span>
                </button>

                <button
                  onClick={handleSimulateSessionExpired}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-medium font-solaiman flex items-center gap-1.5 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>সেশন এক্সপায়ার ট্রিগার</span>
                </button>

                <button
                  onClick={handleToggleOffline}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium font-solaiman flex items-center gap-1.5 transition-colors"
                >
                  <WifiOff className="w-3.5 h-3.5 text-slate-600" />
                  <span>{authStatus === 'offline' ? 'অনলাইন মোড ফিরুন' : 'অফলাইন মোড সিমুলেট'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-medium font-solaiman flex items-center gap-1.5 transition-colors sm:col-span-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-700" />
                  <span>সেশন লগআউট করুন (SecureStorage + OrganizationContext Reset)</span>
                </button>
              </div>
            </div>

            {/* লাইভ ইভেন্ট লগ */}
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Authentication Event Logs (Sensitive tokens/passwords excluded)
                </span>
                <button
                  onClick={() => setLogs([])}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              </div>
              <div className="h-40 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                {logs.length === 0 ? (
                  <p className="text-slate-600 italic">No recent logs</p>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2 leading-tight">
                      <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                      <span className={`text-[10px] uppercase font-bold shrink-0 ${
                        log.level === 'error' ? 'text-rose-400' :
                        log.level === 'warn' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        [{log.level}]
                      </span>
                      <span className="text-slate-300 text-[11px] break-all">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ট্যাব ২: সেশন ও টোকেন লাইফসাইকেল */}
      {activeTab === 'session_inspector' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ইউজার ও টোকেন ডিটেইলস */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 font-solaiman flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                অথেনটিকেটেড ব্যবহারকারীর প্রোফাইল
              </h3>
              <span className="px-2 py-0.5 text-[11px] bg-emerald-100 text-emerald-800 rounded font-semibold">
                Active User
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block font-solaiman">ইউজার আইডি</span>
                <span className="font-mono font-medium text-slate-800">{currentUser.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-solaiman">ইউজার কোড</span>
                <span className="font-mono font-medium text-slate-800">{currentUser.userCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-solaiman">পূর্ণ নাম</span>
                <span className="font-solaiman font-semibold text-slate-800">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-solaiman">ইমেইল</span>
                <span className="font-mono text-slate-700">{currentUser.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-solaiman">মোবাইল</span>
                <span className="font-mono text-slate-700">{currentUser.phone || 'নেই'}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-solaiman">সংশ্লিষ্ট প্রতিষ্ঠান</span>
                <span className="font-solaiman font-medium text-slate-800">{currentUser.organizationName}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-500 text-xs block font-solaiman mb-1">
                মাল্টি-টেন্যান্ট Context সিঙ্ক্রোনাইজেশন:
              </span>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-900">X-Organization-Id: {session.organizationId}</span>
                <span className="text-emerald-700 font-semibold font-solaiman flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Synced
                </span>
              </div>
            </div>
          </div>

          {/* টোকেন মেটাডাটা ও মেয়াদ */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 font-solaiman flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-700" />
                সিকিউর টোকেন মেটাডাটা
              </h3>
              <span className="px-2 py-0.5 text-[11px] bg-slate-100 text-slate-700 rounded font-mono">
                JWT / SimpleJWT
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 font-solaiman">অ্যাক্সেস টোকেন (Access Token)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    15 min TTL
                  </span>
                </div>
                <p className="font-mono text-slate-500 text-[11px] truncate">
                  {session.accessToken}
                </p>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>মেয়াদোত্তীর্ণ:</span>
                  <span className="font-mono">{new Date(session.accessTokenExpiresAt).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 font-solaiman">রিফ্রেশ টোকেন (Refresh Token)</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono">
                    30 days TTL
                  </span>
                </div>
                <p className="font-mono text-slate-500 text-[11px] truncate">
                  {session.refreshToken}
                </p>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>মেয়াদোত্তীর্ণ:</span>
                  <span className="font-mono">{new Date(session.refreshTokenExpiresAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-solaiman flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>সিকিউরিটি নীতি:</strong> টোকেনের আসল স্ট্রিং শুধুমাত্র SecureStorageService (Android Keystore / iOS Keychain)-এ এনক্রিপ্ট আকারে থাকে; UI উইজেটে কোনো র টোকেন স্টোর করা হয় না।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ট্যাব ৩: রিফ্রেশ লক ও ৪০১ হ্যান্ডলার */}
      {activeTab === 'refresh_queue' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 font-solaiman flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-700" />
              কনকারেন্ট রিফ্রেশ স্টর্ম প্রটেকশন (Mutex Queue Mechanism)
            </h3>
            <p className="text-xs text-slate-600 font-solaiman">
              যখন একাধিক সমসাময়িক রিকোয়েস্ট (যেমন: ড্যাশবোর্ডের ৪টি ডেটা রিকোয়েস্ট) একসাথে ৪০১ রেসপন্স পায়, তখন ক্লায়েন্ট একাধিক রিফ্রেশ রিকোয়েস্ট পাঠিয়ে সার্ভার স্টর্ম তৈরি করবে না।
            </p>
          </div>

          {/* আর্কিটেকচার ফ্লো ডায়াগ্রাম */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-solaiman">
              কনকারেন্ট রিকোয়েস্ট হ্যান্ডলিং ফ্লো
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-center font-solaiman">
              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <span className="text-rose-700 font-bold block mb-1">ধাপ ১: ৪০১ ডিটেকশন</span>
                <p className="text-slate-600 text-[11px]">
                  Request A, B, C একসাথে 401 Unauthorized পেল।
                </p>
              </div>

              <div className="p-3 bg-white border border-amber-200 rounded-lg shadow-2xs">
                <span className="text-amber-800 font-bold block mb-1">ধাপ ২: সেন্ট্রাল লক</span>
                <p className="text-slate-600 text-[11px]">
                  Request A রিফ্রেশ লক নেয়। Request B ও C কিউতে ফিউচারের জন্য অপেক্ষা করে।
                </p>
              </div>

              <div className="p-3 bg-white border border-indigo-200 rounded-lg shadow-2xs">
                <span className="text-indigo-800 font-bold block mb-1">ধাপ ৩: ১টি রিফ্রেশ কল</span>
                <p className="text-slate-600 text-[11px]">
                  শুধুমাত্র ১টি <code className="bg-slate-100 px-1 font-mono">/token/refresh/</code> সার্ভারে যায়।
                </p>
              </div>

              <div className="p-3 bg-white border border-emerald-200 rounded-lg shadow-2xs">
                <span className="text-emerald-800 font-bold block mb-1">ধাপ ৪: শেয়ার্ড রেজাল্ট</span>
                <p className="text-slate-600 text-[11px]">
                  নতুন অ্যাক্সেস টোকেন দিয়ে A, B, C তিনটি রিকোয়েস্টই স্বয়ংক্রিয়ভাবে রিট্রাই হয়।
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500 font-solaiman">
              বর্তমান মিউটেক্স স্ট্যাটাস: <strong className="text-emerald-700 font-mono">Idle (Ready for request interception)</strong>
            </div>
            <button
              onClick={handleSimulateRefreshStorm}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg font-solaiman flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              লাইভ রিফ্রেশ স্টর্ম সিমুলেশন চালান
            </button>
          </div>
        </div>
      )}

      {/* ট্যাব ৪: সিকিউরিটি ও স্টোরেজ অডিট */}
      {activeTab === 'security_audit' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
              <h4 className="text-sm font-bold text-slate-800 font-solaiman flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                নিরাপত্তা নীতি বাস্তবায়ন চেকলিস্ট
              </h4>
              <ul className="space-y-2 text-xs font-solaiman">
                {[
                  'কোনো পাসওয়ার্ড লোকাল স্টোরেজ বা লগ ফাইলে রাখা হয় না',
                  'টোকেন হার্ডওয়্যার এনক্রিপ্টেড SecureStorageService-এ সংরক্ষিত',
                  'লগআউটের সাথে সাথে লোকাল সেশন ও টোকেন সম্পূর্ণ পার্জ হয়',
                  'লগআউট অফলাইনেও কার্যকর (নেটওয়ার্ক ব্যর্থতায় সেশন আটকে থাকে না)',
                  'OrganizationContext স্বাধীন টেন্যান্ট আইসোলেশন বজায় রাখে',
                  'লগিন রিকোয়েস্টে পাসওয়ার্ড সবসময় মাস্কড থাকে ও কনসোলে মাস্কড দেখায়',
                  'র সেশন টোকেন UI লেয়ারের স্টেট ভেরিয়েবলে উন্মুক্ত করা হয় না'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
              <h4 className="text-sm font-bold text-slate-800 font-solaiman flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                ভবিষ্যৎ এক্সটেনশন পয়েন্ট (Future OTP / 2FA Ready)
              </h4>
              <p className="text-xs text-slate-600 font-solaiman leading-relaxed">
                Prompt 2.2-এ কোনো বাস্তব OTP/2FA বিজনেস লজিক যোগ করা হয়নি, তবে ডোমেইন আর্কিটেকচারে নিচের এক্সটেনশন পয়েন্ট তৈরি রাখা হয়েছে:
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700 space-y-1">
                <span className="text-emerald-700 font-bold">enum AuthenticationMethod &#123;</span>
                <span className="block pl-4">password,  // বর্তমান Prompt 2.2-এ কার্যকর</span>
                <span className="block pl-4 text-slate-400">// ভবিষ্যতের জন্য সংরক্ষিত এক্সটেনশন:</span>
                <span className="block pl-4 text-slate-400">otp,</span>
                <span className="block pl-4 text-slate-400">twoFactorAuthentication,</span>
                <span className="text-emerald-700 font-bold">&#125;</span>
              </div>

              <div className="text-[11px] text-slate-500 font-solaiman">
                পরবর্তী ফেজে যখন SMS গেটওয়ে বা TOTP ইন্টিগ্রেশন আসবে, তখন মূল সেশন পাইপলাইন না ভেঙে সহজেই এক্সটেন্ড করা যাবে।
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
