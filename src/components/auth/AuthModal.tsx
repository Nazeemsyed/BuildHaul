import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase, 
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { signInWithGoogle } from '../../lib/firebase';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    authNoticeMessage,
    setAuthNoticeMessage,
    login, 
    signUpUser,
    users
  } = useApp();

  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserRole>('customer');
  
  // OTP flow state
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpError, setOtpError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('482910');

  // Login inputs
  const [loginIdentifier, setLoginIdentifier] = useState('rahul.varma@infraprojects.in');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  // OTP Countdown
  useEffect(() => {
    let interval: any;
    if (isOtpStep && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpStep, otpTimer]);

  if (!isAuthModalOpen) return null;

  const handleStartOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (!fullName.trim()) {
      setOtpError('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setOtpError('Please enter a valid 10-digit Indian phone number');
      return;
    }
    if (!email.includes('@')) {
      setOtpError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setOtpError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setOtpError('Passwords do not match');
      return;
    }

    // Generate random 6-digit mock OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedDemoOtp(code);
    setIsOtpStep(true);
    setOtpTimer(30);
    setOtpDigits(['', '', '', '', '', '']);
  };

  const handleVerifyOtp = () => {
    setOtpError('');
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP');
      return;
    }

    // Check entered code
    if (entered !== generatedDemoOtp && entered !== '123456') {
      setOtpError('Invalid OTP code. Please enter the verification code shown above or click Resend.');
      return;
    }

    // Success -> Create user
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: fullName,
      phone: `+91 ${phone.replace(/\D/g, '').slice(-10)}`,
      email: email,
      role: userType,
      isVerified: true,
      createdAt: new Date().toISOString().split('T')[0],
      companyName: userType === 'owner' ? `${fullName}'s Heavy Fleet` : undefined,
      notificationPreferences: {
        email: true,
        sms: true,
        whatsapp: true,
        bookingAlerts: true
      }
    };

    signUpUser(newUser);
    resetForm();
  };

  const handleResendOtp = () => {
    setIsResending(true);
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedDemoOtp(newCode);
    setTimeout(() => {
      setIsResending(false);
      setOtpTimer(30);
      setOtpError('');
    }, 400);
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const updated = [...otpDigits];
    updated[index] = val;
    setOtpDigits(updated);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginMethod === 'otp') {
      // Direct mock OTP login
      const matched = users.find(u => u.phone.includes(loginIdentifier) || u.email.toLowerCase() === loginIdentifier.toLowerCase());
      if (matched) {
        login(matched);
      } else {
        // Fallback default
        login(users[0]);
      }
      return;
    }

    // Password login
    const target = users.find(u => 
      u.email.toLowerCase() === loginIdentifier.toLowerCase() || 
      u.phone.replace(/\D/g, '').includes(loginIdentifier.replace(/\D/g, ''))
    );

    if (target) {
      login(target);
    } else {
      // For demo smoothness, if unknown, login as customer with provided identifier
      const fallbackUser: User = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: loginIdentifier.split('@')[0] || 'User',
        email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@customer.in`,
        phone: loginIdentifier.includes('@') ? '+91 98480 23114' : `+91 ${loginIdentifier.replace(/\D/g, '')}`,
        role: 'customer',
        createdAt: new Date().toISOString().split('T')[0]
      };
      login(fallbackUser);
    }
  };

  const resetForm = () => {
    setIsOtpStep(false);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setLoginError('');
    setForgotPasswordMessage('');
  };

  const fillQuickDemo = (type: 'contractor' | 'owner' | 'admin') => {
    if (type === 'contractor') {
      setLoginIdentifier('rahul.varma@infraprojects.in');
      setLoginPassword('password123');
    } else if (type === 'owner') {
      setLoginIdentifier('ramesh.fleets@gmail.com');
      setLoginPassword('password123');
    } else {
      setLoginIdentifier('admin@buildhaul.in');
      setLoginPassword('adminSecure2026');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoginError('');
      const gUser = await signInWithGoogle();
      if (gUser) {
        const existing = users.find(u => u.email === gUser.email);
        if (existing) {
          login(existing);
        } else {
          const newUser: User = {
            id: gUser.uid,
            name: gUser.displayName || 'Google User',
            email: gUser.email || '',
            phone: gUser.phoneNumber || '+91 98480 23114',
            role: userType,
            avatar: gUser.photoURL || undefined,
            isVerified: true,
            createdAt: new Date().toISOString().split('T')[0]
          };
          signUpUser(newUser);
        }
      }
    } catch (err: any) {
      setLoginError(err?.message ? `Google authentication note: ${err.message}` : 'Google sign-in completed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-100">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setAuthNoticeMessage(null);
            resetForm();
          }}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Notice if triggered by booking */}
        {authNoticeMessage && !isOtpStep && (
          <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{authNoticeMessage}</span>
          </div>
        )}

        {/* Tab Headers */}
        {!isOtpStep && (
          <div className="flex border-b border-neutral-800 mb-6">
            <button
              onClick={() => {
                setAuthModalMode('login');
                resetForm();
              }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                authModalMode === 'login' ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
              {authModalMode === 'login' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => {
                setAuthModalMode('signup');
                resetForm();
              }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                authModalMode === 'signup' ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Create Account
              {authModalMode === 'signup' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
          </div>
        )}

        {/* Google Firebase Auth Quick Sign-In */}
        {!isOtpStep && (
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2.5 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-neutral-800" />
              <span className="px-3 text-[11px] text-neutral-500 font-medium">or continue with credentials</span>
              <div className="flex-1 border-t border-neutral-800" />
            </div>
          </div>
        )}

        {/* OTP VERIFICATION STEP */}
        {isOtpStep ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Verify Your Phone Number</h3>
              <p className="text-xs text-neutral-400">
                Enter the 6-digit OTP sent to <span className="font-semibold text-neutral-200">+91 {phone.slice(-10)}</span>
              </p>
            </div>

            {/* Mock OTP helper badge so user never gets stuck */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Demo SMS Code: <strong className="font-mono text-sm tracking-widest text-amber-200">{generatedDemoOtp}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setOtpDigits(generatedDemoOtp.split(''))}
                className="text-[11px] underline hover:text-white"
              >
                Auto-fill
              </button>
            </div>

            {/* 6 Digit Input Boxes */}
            <div className="flex justify-between gap-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !digit && idx > 0) {
                      document.getElementById(`otp-input-${idx - 1}`)?.focus();
                    }
                  }}
                  className="w-11 h-13 text-center text-xl font-bold font-mono bg-neutral-950 border border-neutral-700 rounded-xl focus:border-amber-500 focus:outline-none text-white focus:ring-1 focus:ring-amber-500"
                />
              ))}
            </div>

            {otpError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/10"
            >
              Verify OTP
            </button>

            {/* Resend and Change Number actions */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="hover:text-white transition-colors"
              >
                Change phone number
              </button>

              <button
                type="button"
                disabled={otpTimer > 0 || isResending}
                onClick={handleResendOtp}
                className={`flex items-center gap-1 font-medium ${
                  otpTimer > 0 ? 'text-neutral-500 cursor-not-allowed' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <RotateCcw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        ) : authModalMode === 'signup' ? (
          /* SIGN UP FORM */
          <form onSubmit={handleStartOtp} className="space-y-4">
            
            {/* User Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUserType('customer')}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-colors ${
                    userType === 'customer'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Briefcase className={`w-4 h-4 ${userType === 'customer' ? 'text-amber-400' : 'text-neutral-400'}`} />
                  <div>
                    <div className="font-bold">Customer</div>
                    <div className="text-[10px] text-neutral-400">Hire machines</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('owner')}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-colors ${
                    userType === 'owner'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Truck className={`w-4 h-4 ${userType === 'owner' ? 'text-amber-400' : 'text-neutral-400'}`} />
                  <div>
                    <div className="font-bold">Vehicle Owner</div>
                    <div className="text-[10px] text-neutral-400">List my fleet</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. S. Venkata Ramana"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Phone Number with +91 Country Code */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Phone Number (OTP Verification Required)
              </label>
              <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden focus-within:border-amber-500">
                <span className="px-3 py-2.5 bg-neutral-900 border-r border-neutral-800 text-xs font-mono font-semibold text-neutral-300">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="98480 XXXXX"
                  maxLength={10}
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-3 py-2.5 bg-transparent text-sm text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="you@construction.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <Mail className="absolute right-3 top-3 w-4 h-4 text-neutral-500" />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-neutral-500 hover:text-neutral-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {otpError && (
              <p className="text-xs text-rose-400">{otpError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
            >
              <span>Continue with Phone OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Quick Demo Pre-fill Pill Bar */}
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[11px] font-medium text-neutral-400 mb-1.5">
                Quick Test Credentials:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('contractor')}
                  className="px-2 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors"
                >
                  Contractor (Rahul)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('owner')}
                  className="px-2 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-md transition-colors"
                >
                  Fleet Owner (Ramesh)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin')}
                  className="px-2 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-emerald-400 rounded-md transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="name@email.com or 98480XXXXX"
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <Phone className="absolute right-3 top-3 w-4 h-4 text-neutral-500" />
              </div>
            </div>

            {/* Password input */}
            {loginMethod === 'password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-neutral-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMessage('A password reset link and OTP has been dispatched to your verified phone number.')}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me & OTP Toggle */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-0"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
                className="text-neutral-300 hover:text-amber-400"
              >
                {loginMethod === 'password' ? 'Login via OTP instead' : 'Login with Password'}
              </button>
            </div>

            {forgotPasswordMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{forgotPasswordMessage}</span>
              </div>
            )}

            {loginError && (
              <p className="text-xs text-rose-400">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/10"
            >
              {loginMethod === 'otp' ? 'Sign In with OTP' : 'Sign In'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
