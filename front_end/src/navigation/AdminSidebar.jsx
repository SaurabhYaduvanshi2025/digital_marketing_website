import { NavLink } from 'react-router-dom';
import { FileText, LayoutDashboard, UsersRound, X } from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Leads', to: '/admin/leads', icon: UsersRound },
  { label: 'Articles', to: '/admin/blogs', icon: FileText },
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      {open && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden" />}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-[276px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-[84px] items-center justify-between border-b border-slate-100 px-7">
          <NavLink to="/admin" onClick={onClose} className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-200">N</span>
            <span>
              <span className="block text-sm font-bold tracking-tight text-slate-900">Nexa Studio</span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Content workspace</span>
            </span>
          </NavLink>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden" aria-label="Close menu"><X size={18} /></button>
        </div>

        <div className="px-5 pt-8">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
          <nav className="space-y-1.5" aria-label="Admin navigation">
            {navigation.map(({ label, to, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) => cn(
                  'group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition-colors',
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {({ isActive }) => <>
                  <Icon size={18} strokeWidth={isActive ? 2.3 : 1.9} />
                  <span>{label}</span>
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                </>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-5">
          <div className="overflow-hidden rounded-2xl bg-slate-950 p-4 text-white">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">All systems operational</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">Your content and enquiries are in one place.</p>
          </div>
          <p className="px-1 pt-5 text-[10px] text-slate-400">Nexa Studio CMS · Admin</p>
        </div>
      </aside>
    </>
  );
}
