import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { servicesData } from "../../data/servicesData";
import { ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";

export default function ServiceDetail() {
  const { slug } = useParams();

  // URL se matching service nikalna
  const service = servicesData.find((item) => item.slug === slug);

  // Page open hote hi top par scroll kare
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Agar slug galat ho
  if (!service) {
    return (
      <div className="min-h-screen bg-black text-white pt-36 px-6 text-center">
        <h2 className="text-3xl font-bold mb-3">Service Not Found</h2>
        <p className="text-zinc-400 text-sm mb-6">Requested architecture blueprint does not exist.</p>
        <Link 
          to="/services" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft size={14} /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link 
          to="/services" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition mb-10"
        >
          <ArrowLeft size={14} /> Back to All Services
        </Link>

        {/* Hero Header */}
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          {service.tagline}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2 mb-4">
          {service.title}
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-10">
          {service.description}
        </p>

        {/* Technical Overview Box */}
        <div className="p-7 rounded-2xl bg-zinc-900/40 border border-white/10 mb-8">
          <h2 className="text-lg font-bold text-white mb-2">Technical Overview</h2>
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
            {service.overview}
          </p>
        </div>

        {/* Key Features */}
        <div className="p-7 rounded-2xl bg-zinc-900/40 border border-white/10 mb-8">
          <h2 className="text-lg font-bold text-white mb-5">Key Deliverables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.features.map((feat, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-zinc-300">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="p-7 rounded-2xl bg-zinc-900/40 border border-white/10 mb-12">
          <h2 className="text-lg font-bold text-white mb-4">Core Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {service.techStack.map((tech, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom CTA Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to deploy this architecture?</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6">
            Get in touch with our team to discuss customized scope, timelines, and milestones.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
          >
            <span>Consult Our Team</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}