import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, ChevronDown, LogOut, Menu, Search } from 'lucide-react';
import AdminSidebar from '../navigation/AdminSidebar';
import { logoutAdmin } from '../store/slices/authSlice';

const pageTitles = {
  '/admin': ['Overview', 'Here’s what’s happening with your workspace today.'],
  '/admin/leads': ['Leads', 'Review enquiries and keep every conversation moving.'],
  '/admin/blogs': ['Articles', 'Create, edit, and publish your stories.'],
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.auth.admin);
  const page = location.pathname.includes('/blogs/') ? ['Edit article', 'Shape your next story and prepare it for readers.'] : pageTitles[location.pathname] || pageTitles['/admin'];

  const handleLogout = async () => {
    const result = await dispatch(logoutAdmin());
    if (logoutAdmin.fulfilled.match(result)) {
      navigate('/admin/login', { replace: true });
    } else {
      setProfileOpen(false);
      setLogoutError('Could not sign out. Check the connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 lg:flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden" aria-label="Open menu"><Menu size={19} /></button>
            <div className="hidden h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600 sm:grid"><Search size={17} /></div>
            <div className="hidden sm:block">
              <p className="text-[11px] font-semibold text-slate-400">ADMIN / {page[0].toUpperCase()}</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Nexa Studio Workspace</p>
            </div>
            <h1 className="text-sm font-bold sm:hidden">{page[0]}</h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden text-xs font-medium text-slate-400 md:block">{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</span>
            <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50" aria-label="Notifications"><Bell size={17} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white" /></button>
            <div className="relative">
              <button onClick={() => setProfileOpen((isOpen) => !isOpen)} className="flex items-center gap-2.5 rounded-xl p-1.5 text-left hover:bg-slate-50">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">{(admin?.name || 'A').slice(0, 1).toUpperCase()}</span>
                <span className="hidden max-w-32 sm:block"><span className="block truncate text-xs font-bold text-slate-800">{admin?.name || 'Administrator'}</span><span className="mt-0.5 block truncate text-[10px] text-slate-400">{admin?.email || 'Admin account'}</span></span>
                <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
              </button>
              {profileOpen && <div className="absolute right-0 top-12 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"><button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600"><LogOut size={15} /> Sign out</button></div>}
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] p-5 sm:p-8">
          {logoutError && <div role="alert" className="mb-5 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{logoutError}</span><button onClick={() => setLogoutError('')} className="font-bold">Dismiss</button></div>}
          <div className="mb-7 hidden sm:block">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{page[0]}</h2>
            <p className="mt-1 text-sm text-slate-500">{page[1]}</p>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
