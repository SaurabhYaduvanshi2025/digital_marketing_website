import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Share2, Loader2 } from "lucide-react";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Initial mock / API hookup simulation
    const timer = setTimeout(() => {
      // Jab backend API connect hogi: fetch(`/api/blogs/${slug}`).then(res => res.json()).then(data => setBlog(data))
      setBlog(null);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-40 flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black text-white pt-36 text-center px-6">
        <h2 className="text-3xl font-bold mb-3">Article Not Found</h2>
        <p className="text-zinc-500 text-xs mb-6">Requested post could not be retrieved.</p>
        <Link to="/blog" className="text-indigo-400 text-xs font-semibold inline-flex items-center gap-2">
          <ArrowLeft size={14} /> Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={14} /> Back to Insights
        </Link>

        {/* Tag & Meta */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 mb-4">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold">
            {blog.category || "Engineering"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {blog.date || "Recently published"}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {blog.readTime || "5 min read"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Hero Banner Image */}
        {blog.image && (
          <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden mb-10 border border-white/10">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Main Content Area */}
        <div className="max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed space-y-6">
          {blog.contentHtml ? (
            <div dangerouslySetInnerHTML={{ __html: blog.contentHtml }} />
          ) : (
            <p className="whitespace-pre-line">{blog.content}</p>
          )}
        </div>

        {/* Author & Share */}
        <div className="mt-14 pt-8 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-xs">
              {blog.author ? blog.author.charAt(0) : "A"}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{blog.author || "Editorial Team"}</p>
              <p className="text-[11px] text-zinc-500">Author & Contributor</p>
            </div>
          </div>

          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 hover:text-white transition"
          >
            <Share2 size={13} />
            <span>Copy Link</span>
          </button>
        </div>

      </div>
    </article>
  );
}