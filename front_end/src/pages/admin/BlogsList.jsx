import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, FileText, LoaderCircle, Plus, RefreshCw, Search, Send, Trash2 } from 'lucide-react';
import api from '../../api/axios';

const displayDate = (value) => value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value.replace(' ', 'T'))) : 'Not published';

export default function BlogsList() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/blogs');
      setBlogs(response.data?.blogs || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load articles. Please retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadBlogs, 0);
    return () => window.clearTimeout(timer);
  }, [loadBlogs]);

  const filteredBlogs = useMemo(() => blogs.filter((blog) => {
    const matchesSearch = `${blog.title} ${blog.slug} ${blog.excerpt || ''}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (filter === 'all' || blog.status === filter);
  }), [blogs, filter, search]);

  const publishBlog = async (blog) => {
    setBusyId(blog.id);
    setError('');
    try {
      await api.patch('/admin/blog/publish', null, { params: { id: blog.id } });
      setNotice(`“${blog.title}” is now published.`);
      await loadBlogs();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not publish this article.');
    } finally {
      setBusyId(null);
    }
  };

  const deleteBlog = async (blog) => {
    if (!window.confirm(`Delete “${blog.title}”? This cannot be undone.`)) return;
    setBusyId(blog.id);
    setError('');
    try {
      await api.delete('/admin/blog', { params: { id: blog.id } });
      setNotice('Article deleted.');
      await loadBlogs();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete this article.');
    } finally {
      setBusyId(null);
    }
  };

  const counts = { all: blogs.length, published: blogs.filter((blog) => blog.status === 'published').length, draft: blogs.filter((blog) => blog.status === 'draft').length };

  return (
    <div className="space-y-5">
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div><div className="flex items-center gap-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><FileText size={19} /></span><div><h3 className="text-sm font-bold text-slate-900">Your content library</h3><p className="mt-1 text-[11px] text-slate-400">Manage what your visitors can read.</p></div></div></div>
        <Link to="/admin/blogs/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"><Plus size={15} /> New article</Link>
      </section>

      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{error}</span><button onClick={loadBlogs} className="inline-flex items-center gap-2 font-bold"><RefreshCw size={13} /> Retry</button></div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">{notice}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">{[['all', 'All'], ['published', 'Published'], ['draft', 'Drafts']].map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-[11px] font-bold transition ${filter === value ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{label}<span className="ml-1.5 text-[10px] opacity-60">{counts[value]}</span></button>)}</div>
          <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 sm:w-64"><Search size={15} className="shrink-0 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles…" className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400" /></label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead><tr className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400"><th className="px-6 py-3 font-bold">Article</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 font-bold">Last updated</th><th className="px-4 py-3 font-bold">Published</th><th className="px-6 py-3 text-right font-bold">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? Array.from({ length: 5 }).map((_, index) => <tr key={index}><td colSpan="5" className="px-6 py-4"><span className="block h-9 animate-pulse rounded-lg bg-slate-100" /></td></tr>) : filteredBlogs.map((blog) => <tr key={blog.id} className="transition hover:bg-slate-50/70">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600"><FileText size={17} /></span><span className="min-w-0"><span className="block max-w-sm truncate text-xs font-bold text-slate-800">{blog.title}</span><span className="mt-1 block max-w-sm truncate text-[10px] text-slate-400">/{blog.slug}</span></span></div></td>
                <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ring-1 ring-inset ${blog.status === 'published' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>{blog.status}</span></td>
                <td className="px-4 py-4 text-[11px] text-slate-500">{displayDate(blog.updated_at || blog.created_at)}</td>
                <td className="px-4 py-4 text-[11px] text-slate-500">{displayDate(blog.published_at)}</td>
                <td className="px-6 py-4"><div className="flex items-center justify-end gap-1">{blog.status === 'draft' && <button onClick={() => publishBlog(blog)} disabled={busyId === blog.id} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50">{busyId === blog.id ? <LoaderCircle size={14} className="animate-spin" /> : <Send size={13} />} Publish</button>}<Link to={`/admin/blogs/${blog.id}/edit`} aria-label={`Edit ${blog.title}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"><ArrowUpRight size={16} /></Link><button onClick={() => deleteBlog(blog)} disabled={busyId === blog.id} aria-label={`Delete ${blog.title}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"><Trash2 size={15} /></button></div></td>
              </tr>)}
              {!loading && filteredBlogs.length === 0 && <tr><td colSpan="5" className="px-6 py-16 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400"><CalendarDays size={20} /></span><p className="mt-3 text-sm font-bold text-slate-700">{search || filter !== 'all' ? 'No matching articles' : 'Your story starts here'}</p><p className="mt-1 text-xs text-slate-400">{search || filter !== 'all' ? 'Change your search or filter to see more.' : 'Create an article to make your first post.'}</p>{!search && filter === 'all' && <Link to="/admin/blogs/new" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">Write your first article <ArrowUpRight size={14} /></Link>}</td></tr>}
            </tbody>
          </table>
        </div>
        {!loading && filteredBlogs.length > 0 && <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 text-[11px] text-slate-400"><span>{filteredBlogs.length} article{filteredBlogs.length === 1 ? '' : 's'}</span><span>Changes are saved to your CMS</span></div>}
      </section>
    </div>
  );
}
