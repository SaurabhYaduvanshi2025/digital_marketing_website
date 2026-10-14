import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Share2, Loader2 } from "lucide-react";
import parse from "html-react-parser";
import api from "../../api/axios";
import { mediaUrl } from "../../lib/media";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");
      api.get("/blog", { params: { slug } })
        .then(({ data }) => {
          const publishedBlog = data?.blog || null;
          if (!active) return;
          setBlog(publishedBlog);
          setGallery([]);
          if (publishedBlog?.id) {
            api.get("/blog/images", { params: { blog_id: publishedBlog.id } })
              .then((galleryResponse) => {
                if (active) setGallery(galleryResponse.data?.images || []);
              })
              .catch(() => {
                // A blog without gallery photos still displays its content and cover.
              });
          }
        })
        .catch((requestError) => {
          if (active) {
            setError(requestError.response?.data?.message || "Could not load this article.");
            setBlog(null);
          }
        })
        .finally(() => { if (active) setLoading(false); });
    }, 0);

    return () => { active = false; window.clearTimeout(timer); };
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
        <p className="text-zinc-500 text-xs mb-6">{error || "Requested post could not be retrieved."}</p>
        <Link to="/blogs" className="text-indigo-400 text-xs font-semibold inline-flex items-center gap-2">
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
          to="/blogs"
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
            <Calendar size={12} /> {blog.published_at ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(blog.published_at.replace(" ", "T"))) : "Recently published"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Hero Banner Image */}
        {blog.featured_image && (
          <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden mb-10 border border-white/10">
            <img src={mediaUrl(blog.featured_image)} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Main Content Area */}
        <div className="max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed space-y-6">
          {parse(blog.content || "")}
        </div>

        {gallery.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 text-xl font-bold text-white">More photos</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {gallery.map((image) => (
                <figure key={image.id} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                  <img src={mediaUrl(image.image_path)} alt={image.alt_text || blog.title} className="h-64 w-full object-cover" />
                  {image.caption && <figcaption className="px-4 py-3 text-xs text-zinc-400">{image.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

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
