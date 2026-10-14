import { useCallback, useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, FileText, Image, RefreshCw, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const number = (value) => new Intl.NumberFormat('en').format(Number(value || 0));
const date = (value) => value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value.replace(' ', 'T'))) : '—';

const statusStyles = {
  new: 'bg-sky-50 text-sky-700 ring-sky-200',
  contacted: 'bg-amber-50 text-amber-700 ring-amber-200',
  converted: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  closed: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [leadStats, setLeadStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [blogResponse, leadResponse, recentResponse] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/dashboard/lead-stats'),
        api.get('/admin/dashboard/recent-leads'),
      ]);
      setStats(blogResponse.data?.data || {});
      setLeadStats(leadResponse.data?.data || {});
      setRecentLeads(recentResponse.data?.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load dashboard data. Check that the backend is running and you are signed in.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadDashboard, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  const cards = [
    { label: 'Total enquiries', value: leadStats?.total_leads, icon: UsersRound, color: 'indigo', note: `${number(leadStats?.new_leads)} new to review` },
    { label: 'Total articles', value: stats?.total_blogs, icon: FileText, color: 'violet', note: `${number(stats?.published_blogs)} published` },
    { label: 'Draft articles', value: stats?.draft_blogs, icon: ArrowDownRight, color: 'amber', note: 'Ready when you are' },
    { label: 'Library images', value: stats?.total_gallery_images, icon: Image, color: 'emerald', note: 'Across your articles' },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#25205a] via-[#4436a8] to-[#6f5cf4] p-6 text-white shadow-xl shadow-indigo-200/60 sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-24 h-72 w-72 rounded-full border-[42px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-32 right-40 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Your workspace at a glance</span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">Good work starts with a clear view.</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-indigo-100/80">Track incoming enquiries, keep your articles fresh, and stay close to what matters today.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/admin/blogs/new" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">Write an article <ArrowUpRight size={15} /></Link>
            <Link to="/admin/leads" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15">View enquiries <ArrowRight size={14} /></Link>
          </div>
        </div>
        <div className="absolute bottom-0 right-6 hidden h-[88%] w-[31%] items-end justify-center sm:flex">
          <div className="relative mb-[-24px] h-[220px] w-[260px] rounded-t-[30px] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-3"><i className="h-2 w-2 rounded-full bg-rose-300" /><i className="h-2 w-2 rounded-full bg-amber-200" /><i className="h-2 w-2 rounded-full bg-emerald-300" /><span className="ml-auto h-2 w-16 rounded-full bg-white/20" /></div>
            <div className="mt-4 grid grid-cols-3 gap-2"><div className="h-12 rounded-lg bg-white/15" /><div className="h-12 rounded-lg bg-white/10" /><div className="h-12 rounded-lg bg-white/10" /></div>
            <div className="mt-4 flex h-24 items-end gap-2 rounded-xl bg-white/10 p-3">{[35, 58, 44, 75, 52, 90, 66, 82, 55].map((height, index) => <span key={index} style={{ height: `${height}%` }} className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-200/30 to-white/80" />)}</div>
          </div>
        </div>
      </section>

      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{error}</span><button onClick={loadDashboard} className="inline-flex items-center gap-2 font-bold"><RefreshCw size={13} /> Retry</button></div>}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color, note }) => (
          <article key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{loading ? <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-slate-100" /> : number(value)}</p></div><span className={`grid h-10 w-10 place-items-center rounded-xl ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : color === 'violet' ? 'bg-violet-50 text-violet-600' : color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}><Icon size={18} /></span></div>
            <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-400">{note}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h3 className="text-sm font-bold text-slate-900">Recent enquiries</h3><p className="mt-1 text-[11px] text-slate-400">The latest messages from your contact form</p></div><Link to="/admin/leads" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800">All leads <ArrowRight size={13} /></Link></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead><tr className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400"><th className="px-5 py-3 font-bold sm:px-6">Contact</th><th className="px-4 py-3 font-bold">Received</th><th className="px-4 py-3 font-bold">Status</th><th className="px-5 py-3 text-right font-bold sm:px-6">Phone</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? Array.from({ length: 4 }).map((_, index) => <tr key={index}><td colSpan="4" className="px-6 py-4"><span className="block h-5 animate-pulse rounded bg-slate-100" /></td></tr>) : recentLeads.length ? recentLeads.slice(0, 6).map((lead) => <tr key={lead.id} className="transition hover:bg-slate-50/70"><td className="px-5 py-3.5 sm:px-6"><p className="text-xs font-bold text-slate-800">{lead.name}</p><p className="mt-1 text-[10px] text-slate-400">{lead.email}</p></td><td className="px-4 py-3.5 text-[11px] text-slate-500">{date(lead.lead_date)}</td><td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ring-1 ring-inset ${statusStyles[lead.status] || statusStyles.new}`}>{lead.status}</span></td><td className="px-5 py-3.5 text-right text-[11px] font-medium text-slate-500 sm:px-6">{lead.phone || '—'}</td></tr>) : <tr><td colSpan="4" className="px-6 py-10 text-center text-xs text-slate-400">No enquiries yet. New form submissions will appear here.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
          <div><h3 className="text-sm font-bold text-slate-900">Enquiry pipeline</h3><p className="mt-1 text-[11px] text-slate-400">A snapshot of lead progress</p></div>
          <div className="mt-6 space-y-5">
            {[['New', leadStats?.new_leads, 'bg-sky-500'], ['Contacted', leadStats?.contacted_leads, 'bg-amber-400'], ['Converted', leadStats?.converted_leads, 'bg-emerald-500'], ['Closed', leadStats?.closed_leads, 'bg-slate-400']].map(([label, count, bar]) => {
              const total = Number(leadStats?.total_leads || 0);
              const percent = total ? Math.round(Number(count || 0) / total * 100) : 0;
              return <div key={label}><div className="mb-2 flex items-center justify-between text-[11px]"><span className="font-semibold text-slate-600">{label}</span><span className="font-bold text-slate-800">{number(count)} <span className="font-medium text-slate-400">· {percent}%</span></span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${bar} transition-all duration-700`} style={{ width: `${percent}%` }} /></div></div>;
            })}
          </div>
          <Link to="/admin/leads" className="mt-7 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"><span>Open lead manager</span><ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </div>
  );
}
