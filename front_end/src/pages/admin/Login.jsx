
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { clearAuthError, loginAdmin } from '../../store/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const destination = location.state?.from?.pathname?.startsWith('/admin') ? location.state.from.pathname : '/admin';

  useEffect(() => {
    if (isAuthenticated) navigate(destination, { replace: true });
  }, [destination, isAuthenticated, navigate]);

  const submitLogin = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());
    try {
      await dispatch(loginAdmin({ email: email.trim(), password })).unwrap();
      navigate(destination, { replace: true });
    } catch {
      // The Redux auth state provides the backend's login error to the form.
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] px-4 py-12">
      <div className="pointer-events-none absolute -left-32 -top-28 h-[420px] w-[420px] rounded-full bg-indigo-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-24 h-[500px] w-[500px] rounded-full bg-violet-200/50 blur-3xl" />
      <div className="relative z-10 grid w-full max-w-[980px] overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_30px_100px_rgba(35,36,80,0.14)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden min-h-[600px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#211b54] via-[#4033a1] to-[#6d5bed] p-10 text-white lg:flex">
          <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full border-[48px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-32 -left-12 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="relative flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/20 bg-white/10 text-sm font-black">N</span><span><span className="block text-sm font-bold">Nexa Studio</span><span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-200">Content workspace</span></span></div>
          <div className="relative py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-100"><ShieldCheck size={13} /> Secure admin access</span>
            <h1 className="mt-6 max-w-md text-4xl font-bold leading-[1.12] tracking-tight">Everything you need to keep your site moving.</h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-indigo-100/75">Manage your articles, respond to enquiries, and keep your digital workspace organized.</p>
            <div className="mt-9 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-white/90">Your workspace</span><span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-200"><i className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Ready when you are</span></div><div className="mt-4 grid grid-cols-3 gap-2"><div className="h-12 rounded-lg bg-white/10" /><div className="h-12 rounded-lg bg-white/10" /><div className="h-12 rounded-lg bg-white/10" /></div></div>
          </div>
          <p className="relative text-[10px] text-indigo-100/50">A thoughtful home for your content and conversations.</p>
        </section>

        <section className="flex min-h-[600px] flex-col justify-center p-7 sm:p-12 lg:p-14">
          <Link to="/" className="mb-10 inline-flex w-fit items-center gap-2 text-[11px] font-semibold text-slate-400 transition hover:text-indigo-600"><ArrowLeft size={14} /> Back to website</Link>
          <div className="mb-8 lg:hidden"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-200">N</span></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">Welcome back</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Sign in to your workspace</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">Enter your administrator details to continue.</p>

          <form onSubmit={submitLogin} className="mt-8 space-y-5">
            {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs leading-relaxed text-rose-700">{error}</div>}
            <label className="block"><span className="mb-2 block text-[11px] font-bold text-slate-600">Email address</span><span className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50"><Mail size={16} className="shrink-0 text-slate-400" /><input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="w-full bg-transparent py-3.5 text-xs text-slate-800 outline-none placeholder:text-slate-300" /></span></label>
            <label className="block"><span className="mb-2 block text-[11px] font-bold text-slate-600">Password</span><span className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50"><LockKeyhole size={16} className="shrink-0 text-slate-400" /><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="w-full bg-transparent py-3.5 text-xs text-slate-800 outline-none placeholder:text-slate-300" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in securely'}{!loading && <ArrowRight size={15} />}</button>
          </form>
          <p className="mt-7 flex items-center justify-center gap-1.5 text-[10px] text-slate-400"><LockKeyhole size={12} /> Your session is protected with secure authentication.</p>
        </section>
      </div>
    </main>
  );
}
