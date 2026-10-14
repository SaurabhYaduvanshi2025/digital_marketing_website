import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, MessageSquareText, Phone, RefreshCw, Search, Trash2, UsersRound, X } from 'lucide-react';
import api from '../../api/axios';

const statuses = ['new', 'contacted', 'converted', 'closed'];
const statusStyles = {
  new: 'bg-sky-50 text-sky-700 ring-sky-200',
  contacted: 'bg-amber-50 text-amber-700 ring-amber-200',
  converted: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  closed: 'bg-slate-100 text-slate-600 ring-slate-200',
};
const formatDate = (value) => value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value.replace(' ', 'T'))) : '—';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_records: 0, per_page: 10 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/leads', { params: { page } });
      setLeads(response.data?.data || []);
      setPagination(response.data?.pagination || { current_page: page, total_pages: 1, total_records: 0, per_page: 10 });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load leads. Please retry.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timer = window.setTimeout(loadLeads, 0);
    return () => window.clearTimeout(timer);
  }, [loadLeads]);

  const updateStatus = async (lead, status) => {
    setBusyId(lead.id);
    setNotice('');
    try {
      await api.patch('/admin/lead/status', { status }, { params: { id: lead.id } });
      setLeads((items) => items.map((item) => item.id === lead.id ? { ...item, status } : item));
      setSelectedLead((item) => item?.id === lead.id ? { ...item, status } : item);
      setNotice(`Lead status changed to ${status}.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update this lead.');
    } finally {
      setBusyId(null);
    }
  };

  const deleteLead = async (lead) => {
    if (!window.confirm(`Delete the enquiry from ${lead.name}? This cannot be undone.`)) return;
    setBusyId(lead.id);
    try {
      await api.delete('/admin/lead', { params: { id: lead.id } });
      setSelectedLead(null);
      setNotice('Enquiry deleted.');
      await loadLeads();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete this lead.');
    } finally {
      setBusyId(null);
    }
  };

  const filteredLeads = leads.filter((lead) => `${lead.name} ${lead.email} ${lead.phone}`.toLowerCase().includes(search.toLowerCase()));
  const firstRecord = pagination.total_records ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
  const lastRecord = Math.min(pagination.current_page * pagination.per_page, pagination.total_records);

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[['Total enquiries', pagination.total_records, 'All messages received'], ['On this page', leads.length, 'Showing up to 10 records'], ['Needs attention', leads.filter((lead) => lead.status === 'new').length, 'New messages to follow up']].map(([label, value, caption], index) => <article key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-slate-500">{label}</p><span className={`h-2 w-2 rounded-full ${index === 2 ? 'bg-amber-400' : 'bg-indigo-500'}`} /></div><p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{loading ? '—' : value}</p><p className="mt-1 text-[11px] text-slate-400">{caption}</p></article>)}
      </section>

      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{error}</span><button onClick={loadLeads} className="inline-flex items-center gap-2 font-bold"><RefreshCw size={13} /> Retry</button></div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">{notice}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          <div><h3 className="text-sm font-bold text-slate-900">All enquiries</h3><p className="mt-1 text-[11px] text-slate-400">Update a lead’s status or open a message for details.</p></div>
          <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 sm:w-64"><Search size={15} className="shrink-0 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this page…" className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400" /></label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead><tr className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400"><th className="px-6 py-3 font-bold">Contact</th><th className="px-4 py-3 font-bold">Received</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 font-bold">Message</th><th className="px-6 py-3 text-right font-bold">Action</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? Array.from({ length: 5 }).map((_, index) => <tr key={index}><td colSpan="5" className="px-6 py-4"><span className="block h-8 animate-pulse rounded-lg bg-slate-100" /></td></tr>) : filteredLeads.map((lead) => <tr key={lead.id} className="transition hover:bg-slate-50/70">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">{(lead.name || '?').slice(0, 1).toUpperCase()}</span><span><span className="block text-xs font-bold text-slate-800">{lead.name}</span><span className="mt-1 block text-[10px] text-slate-400">{lead.email}</span></span></div></td>
                <td className="px-4 py-4 text-[11px] text-slate-500">{formatDate(lead.lead_date)}</td>
                <td className="px-4 py-4"><select aria-label={`Status for ${lead.name}`} value={lead.status} disabled={busyId === lead.id} onChange={(event) => updateStatus(lead, event.target.value)} className={`rounded-full border-0 px-2.5 py-1.5 text-[10px] font-bold capitalize outline-none ring-1 ring-inset disabled:opacity-50 ${statusStyles[lead.status] || statusStyles.new}`}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                <td className="px-4 py-4"><button onClick={() => setSelectedLead(lead)} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"><MessageSquareText size={14} /> Read message</button></td>
                <td className="px-6 py-4 text-right"><button onClick={() => deleteLead(lead)} disabled={busyId === lead.id} aria-label={`Delete enquiry from ${lead.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"><Trash2 size={15} /></button></td>
              </tr>)}
              {!loading && filteredLeads.length === 0 && <tr><td colSpan="5" className="px-6 py-16 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400"><UsersRound size={20} /></span><p className="mt-3 text-sm font-bold text-slate-700">{search ? 'No matching enquiries' : 'Your inbox is clear'}</p><p className="mt-1 text-xs text-slate-400">{search ? 'Try another name, email, or phone number.' : 'New enquiries will appear here when someone contacts you.'}</p></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-[11px] sm:flex-row sm:items-center sm:justify-between sm:px-6"><p className="text-slate-400">Showing <span className="font-bold text-slate-600">{firstRecord}–{lastRecord}</span> of <span className="font-bold text-slate-600">{pagination.total_records}</span></p><div className="flex items-center gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={14} /> Previous</button><span className="px-2 text-slate-500">Page {pagination.current_page} of {Math.max(pagination.total_pages, 1)}</span><button disabled={page >= pagination.total_pages || loading} onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={14} /></button></div></div>
      </section>

      {selectedLead && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedLead(null); }}><section role="dialog" aria-modal="true" aria-labelledby="lead-dialog-title" className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-500">Enquiry #{selectedLead.id}</span><h2 id="lead-dialog-title" className="mt-2 text-xl font-bold text-slate-900">{selectedLead.name}</h2></div><button onClick={() => setSelectedLead(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100" aria-label="Close message"><X size={18} /></button></div><div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4"><a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-indigo-600"><Mail size={15} /> {selectedLead.email}</a><a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-indigo-600"><Phone size={15} /> {selectedLead.phone || 'Phone not provided'}</a><p className="text-xs text-slate-500">{selectedLead.address || 'No address provided'}</p></div><div className="mt-5"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Message</p><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{selectedLead.message || 'No message was included.'}</p></div></section></div>}
    </div>
  );
}
