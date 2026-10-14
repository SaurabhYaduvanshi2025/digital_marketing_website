import { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Calendar, Loader2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { mediaUrl } from "../../lib/media";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/blogs");
      setBlogs(response.data?.blogs || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load published articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadBlogs, 0);
    return () => window.clearTimeout(timer);
  }, [loadBlogs]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles size={13} />
            <span>INSIGHTS & ARTICLES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Engineering & Tech{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
              Chronicles
            </span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Read up on modern web architecture, cloud deployments, and software engineering practices.
          </p>
        </div>

        {/* Loading State Check (Fixes unused 'loading' error) */}
        {loading ? (
          <div className="flex justify-center items-center py-24 text-zinc-500">
            <Loader2 className="animate-spin text-indigo-500" size={28} />
          </div>
        ) : error ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-zinc-950/40">
            <p role="alert" className="text-zinc-400 text-sm">{error}</p>
            <button type="button" onClick={loadBlogs} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"><RefreshCw size={14} /> Try again</button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-zinc-950/40">
            <p className="text-zinc-500 text-sm">No articles published yet.</p>
          </div>
        ) : (
          /* Blog Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id || blog.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group rounded-3xl bg-zinc-950/70 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
              >
                <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                  {blog.featured_image ? (
                    <img
                      src={mediaUrl(blog.featured_image)}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">
                      No Image
                    </div>
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-indigo-400">
                    {blog.category || "Article"}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-zinc-500 text-[11px] mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {blog.published_at ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(blog.published_at.replace(" ", "T"))) : "Recently published"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-2 line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-6">
                      {blog.excerpt || blog.summary || blog.description}
                    </p>
                  </div>

                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-zinc-300 group-hover:text-indigo-400 transition"
                  >
                    <span>Read Full Article</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
