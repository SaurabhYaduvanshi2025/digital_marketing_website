import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Eye, ImagePlus, LoaderCircle, Save, Sparkles, Trash2, Upload } from 'lucide-react';
import api from '../../api/axios';
import { mediaUrl } from '../../lib/media';

const emptyBlog = { title: '', slug: '', excerpt: '', content: '', status: 'draft' };
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(emptyBlog);
  const [slugEdited, setSlugEdited] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [existingCover, setExistingCover] = useState('');
  const [gallery, setGallery] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(Boolean(id));
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [galleryError, setGalleryError] = useState('');
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.notice || '');

  useEffect(() => {
    if (!id) return;
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setGalleryLoading(true);
      api.get('/admin/blog', { params: { id } })
        .then(({ data }) => {
          if (!active) return;
          const blog = data?.blog;
          if (!blog) throw new Error('Article details were not included in the response.');
          setForm({ title: blog.title || '', slug: blog.slug || '', excerpt: blog.excerpt || '', content: blog.content || '', status: blog.status || 'draft' });
          setExistingCover(blog.featured_image || '');
          setSlugEdited(true);
        })
        .catch((requestError) => { if (active) setError(requestError.response?.data?.message || requestError.message || 'Could not load this article.'); })
        .finally(() => { if (active) setLoading(false); });
      api.get('/admin/blog/images', { params: { blog_id: id } })
        .then(({ data }) => { if (active) setGallery(data?.images || []); })
        .catch((requestError) => {
          if (active) setGalleryError(requestError.response?.data?.message || 'Could not load this article gallery.');
        })
        .finally(() => { if (active) setGalleryLoading(false); });
    }, 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, [id]);

  const coverPreview = useMemo(() => coverFile ? URL.createObjectURL(coverFile) : '', [coverFile]);
  useEffect(() => () => { if (coverPreview) URL.revokeObjectURL(coverPreview); }, [coverPreview]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === 'title' && !slugEdited) setForm((current) => ({ ...current, title: value, slug: slugify(value) }));
  };

  const saveArticle = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    let newlyCreatedId = null;
    try {
      let articleId = id;
      if (id) {
        await api.patch('/admin/blog', form, { params: { id } });
      } else {
        const response = await api.post('/admin/blogs', form);
        articleId = response.data?.blog_id;
        if (!articleId) throw new Error('The article was saved, but the API did not return its ID.');
        newlyCreatedId = articleId;
      }

      if (coverFile) {
        const imageData = new FormData();
        imageData.append('purpose', 'cover');
        imageData.append('blog_id', articleId);
        imageData.append('file', coverFile);
        await api.post('/admin/blog/images', imageData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setNotice(id ? 'Your changes have been saved.' : 'Your article has been created.');
      setCoverFile(null);
      if (!id) navigate(`/admin/blogs/${articleId}/edit`, { replace: true, state: { notice: 'Your article has been created.' } });
      else if (coverFile) {
        const response = await api.get('/admin/blog', { params: { id } });
        setExistingCover(response.data?.blog?.featured_image || existingCover);
      }
    } catch (requestError) {
      const message = requestError.response?.data?.message || requestError.message || 'Could not save the article.';
      if (newlyCreatedId) {
        setNotice('Article created. You can retry the cover image upload from this edit screen.');
        setError(`The article was saved, but the cover image could not be uploaded: ${message}`);
        navigate(`/admin/blogs/${newlyCreatedId}/edit`, { replace: true });
      } else {
        setError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const uploadGallery = async () => {
    if (!id || galleryFiles.length === 0) return;
    if (gallery.length + galleryFiles.length > 3) {
      setGalleryError(`This article can have up to 3 gallery images. There ${gallery.length === 1 ? 'is' : 'are'} ${3 - gallery.length} slot${3 - gallery.length === 1 ? '' : 's'} left.`);
      return;
    }

    setGalleryBusy(true);
    setGalleryError('');
    try {
      for (const file of galleryFiles) {
        const imageData = new FormData();
        imageData.append('purpose', 'gallery');
        imageData.append('blog_id', id);
        imageData.append('file', file);
        await api.post('/admin/blog/images', imageData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      const { data } = await api.get('/admin/blog/images', { params: { blog_id: id } });
      setGallery(data?.images || []);
      setGalleryFiles([]);
      setNotice('Gallery images uploaded.');
    } catch (requestError) {
      setGalleryError(requestError.response?.data?.message || 'Could not upload the gallery images.');
      try {
        const { data } = await api.get('/admin/blog/images', { params: { blog_id: id } });
        setGallery(data?.images || []);
      } catch {
        // Keep the original upload error visible if refreshing the list also fails.
      }
    } finally {
      setGalleryBusy(false);
    }
  };

  const saveGalleryDetails = async (image) => {
    setGalleryBusy(true);
    setGalleryError('');
    try {
      await api.patch('/admin/blog/images', {
        alt_text: image.alt_text || '',
        caption: image.caption || '',
        sort_order: Number(image.sort_order || 0),
      }, { params: { id: image.id } });
      setNotice('Gallery image details saved.');
    } catch (requestError) {
      setGalleryError(requestError.response?.data?.message || 'Could not save image details.');
    } finally {
      setGalleryBusy(false);
    }
  };

  const deleteGalleryImage = async (image) => {
    if (!window.confirm('Delete this gallery image?')) return;
    setGalleryBusy(true);
    setGalleryError('');
    try {
      await api.delete('/admin/blog/images', { params: { id: image.id } });
      setGallery((images) => images.filter((item) => item.id !== image.id));
      setNotice('Gallery image deleted.');
    } catch (requestError) {
      setGalleryError(requestError.response?.data?.message || 'Could not delete this image.');
    } finally {
      setGalleryBusy(false);
    }
  };

  const updateGalleryField = (imageId, field, value) => {
    setGallery((images) => images.map((image) => image.id === imageId ? { ...image, [field]: value } : image));
  };

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500"><LoaderCircle className="mx-auto mb-3 animate-spin text-indigo-600" />Loading article…</div>;

  return (
    <form onSubmit={saveArticle} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/blogs" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-indigo-600"><ArrowLeft size={15} /> Back to articles</Link>
        <div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 text-[11px] font-medium text-slate-400 sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Changes save when you click Save</span><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}{saving ? 'Saving…' : 'Save article'}</button></div>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</div>}
      {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700"><Check size={15} />{notice}</div>}

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start justify-between"><div><h3 className="text-sm font-bold text-slate-900">Article details</h3><p className="mt-1 text-[11px] text-slate-400">Start with a clear title and a short introduction.</p></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Sparkles size={17} /></span></div>
            <div className="space-y-5">
              <label className="block"><span className="mb-2 block text-[11px] font-bold text-slate-600">Title <span className="text-rose-500">*</span></span><input required maxLength={200} value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="A thoughtful title for your article" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>
              <label className="block"><span className="mb-2 block text-[11px] font-bold text-slate-600">URL slug <span className="text-rose-500">*</span></span><div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50"><span className="bg-slate-50 px-3 py-3 text-xs text-slate-400">/blogs/</span><input required maxLength={220} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(event) => { setSlugEdited(true); updateField('slug', slugify(event.target.value)); }} placeholder="your-article-slug" className="min-w-0 flex-1 px-3 py-3 text-xs text-slate-700 outline-none" /></div><span className="mt-1.5 block text-[10px] text-slate-400">Use lowercase letters, numbers, and hyphens.</span></label>
              <label className="block"><span className="mb-2 block text-[11px] font-bold text-slate-600">Short introduction</span><textarea maxLength={500} rows={3} value={form.excerpt} onChange={(event) => updateField('excerpt', event.target.value)} placeholder="Summarize what readers will learn…" className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-xs leading-relaxed text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /><span className="mt-1 block text-right text-[10px] text-slate-400">{form.excerpt.length}/500</span></label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5"><h3 className="text-sm font-bold text-slate-900">Article content</h3><p className="mt-1 text-[11px] text-slate-400">Write the full story. Basic HTML markup is supported by the blog page.</p></div>
            <textarea required rows={20} value={form.content} onChange={(event) => updateField('content', event.target.value)} placeholder="Write your article here… You can include paragraphs and HTML headings such as <h2>Section title</h2>." className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-4 font-mono text-xs leading-6 text-slate-700 outline-none transition placeholder:font-sans placeholder:text-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50" />
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4"><h3 className="text-sm font-bold text-slate-900">Publish settings</h3><p className="mt-1 text-[11px] text-slate-400">Choose who can read this article.</p></div>
            <label className="block"><span className="mb-2 block text-[11px] font-bold text-slate-600">Status</span><select value={form.status} onChange={(event) => updateField('status', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-semibold capitalize text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"><option value="draft">Draft — only admins can see it</option><option value="published">Published — visible to readers</option></select></label>
            <div className="mt-4 rounded-xl bg-slate-50 p-3.5"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current status</p><p className="mt-1.5 text-xs font-semibold capitalize text-slate-700">{form.status}</p></div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4"><h3 className="text-sm font-bold text-slate-900">Cover image</h3><p className="mt-1 text-[11px] text-slate-400">JPG, PNG, WEBP, or GIF · up to 2 MB</p></div>
            <label className="group relative flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40">
              {(coverPreview || existingCover) ? <img src={coverPreview || mediaUrl(existingCover)} alt="Article cover preview" className="absolute inset-0 h-full w-full object-cover" /> : <><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm"><ImagePlus size={18} /></span><span className="mt-3 text-[11px] font-bold text-slate-600">Choose a cover image</span><span className="mt-1 text-[10px] text-slate-400">Click to browse your files</span></>}
              {(coverPreview || existingCover) && <span className="absolute inset-x-0 bottom-0 bg-slate-950/65 px-3 py-2 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">Replace cover image</span>}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file && file.size > 2 * 1024 * 1024) { setError('The image must be 2 MB or smaller.'); return; } setError(''); setCoverFile(file || null); }} />
            </label>
            {coverFile && <p className="mt-2 truncate text-[10px] font-medium text-slate-500">Selected: {coverFile.name}</p>}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="text-sm font-bold text-slate-900">Additional photos</h3><p className="mt-1 text-[11px] text-slate-400">Up to 3 gallery images, separate from the cover.</p></div><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">{gallery.length}/3</span></div>
            {galleryError && <p role="alert" className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-[10px] text-rose-700">{galleryError}</p>}
            {!id ? <p className="rounded-xl bg-slate-50 p-3 text-[10px] leading-relaxed text-slate-500">Save the article first. Then open its edit page to add gallery photos.</p> : <>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40">
                <Upload size={17} className="text-indigo-600" />
                <span className="mt-2 text-[10px] font-bold text-slate-600">Select up to {Math.max(0, 3 - gallery.length)} more image{3 - gallery.length === 1 ? '' : 's'}</span>
                <span className="mt-1 text-[9px] text-slate-400">JPG, PNG, WEBP, or GIF · 2 MB maximum each</span>
                <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" disabled={galleryLoading || gallery.length >= 3 || galleryBusy} className="sr-only" onChange={(event) => {
                  const selectedFiles = Array.from(event.target.files || []);
                  const availableSlots = 3 - gallery.length;
                  if (selectedFiles.some((file) => file.size > 2 * 1024 * 1024)) {
                    setGalleryError('Each gallery image must be 2 MB or smaller.');
                  } else if (selectedFiles.length > availableSlots) {
                    setGalleryError(`Only ${availableSlots} gallery slot${availableSlots === 1 ? '' : 's'} left.`);
                  } else {
                    setGalleryError('');
                    setGalleryFiles(selectedFiles);
                  }
                  event.target.value = '';
                }} />
              </label>
              {galleryFiles.length > 0 && <div className="mt-3 space-y-2"><p className="text-[10px] font-semibold text-slate-600">Selected: {galleryFiles.map((file) => file.name).join(', ')}</p><button type="button" onClick={uploadGallery} disabled={galleryBusy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-[10px] font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60">{galleryBusy ? <LoaderCircle size={13} className="animate-spin" /> : <Upload size={13} />}Upload photos</button></div>}
              {galleryLoading ? <p className="mt-4 text-center text-[10px] text-slate-400">Loading gallery…</p> : gallery.length > 0 && <div className="mt-4 space-y-4">{gallery.map((image) => <div key={image.id} className="overflow-hidden rounded-xl border border-slate-200">
                <img src={mediaUrl(image.image_path)} alt={image.alt_text || 'Blog gallery image'} className="h-32 w-full bg-slate-100 object-cover" />
                <div className="space-y-2 p-3">
                  <label className="block"><span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">Alt text</span><input maxLength={255} value={image.alt_text || ''} onChange={(event) => updateGalleryField(image.id, 'alt_text', event.target.value)} placeholder="Describe this image" className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] outline-none focus:border-indigo-400" /></label>
                  <label className="block"><span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">Caption</span><input maxLength={255} value={image.caption || ''} onChange={(event) => updateGalleryField(image.id, 'caption', event.target.value)} placeholder="Optional caption" className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] outline-none focus:border-indigo-400" /></label>
                  <div className="flex gap-2"><button type="button" onClick={() => saveGalleryDetails(image)} disabled={galleryBusy} className="flex-1 rounded-lg bg-slate-100 px-2 py-2 text-[10px] font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50">Save details</button><button type="button" onClick={() => deleteGalleryImage(image)} disabled={galleryBusy} aria-label="Delete gallery image" className="rounded-lg px-2.5 py-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50"><Trash2 size={14} /></button></div>
                </div>
              </div>)}</div>}
            </>}
          </section>

          <section className="rounded-2xl bg-indigo-50 p-5"><div className="flex items-center gap-2 text-indigo-700"><Eye size={16} /><h3 className="text-xs font-bold">Before you publish</h3></div><ul className="mt-3 space-y-2 text-[10px] leading-relaxed text-indigo-800/70"><li>• Add a useful title and introduction.</li><li>• Check that your URL slug is easy to read.</li><li>• Save as a draft if you want to finish later.</li></ul></section>
        </aside>
      </div>
    </form>
  );
}
