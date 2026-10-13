import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowUpRight, 
  Code2, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Smartphone, 
  CloudLightning, 
  CheckCircle2 
} from "lucide-react";
import { Link } from "react-router-dom";
import { servicesData } from "../../data/servicesData";

// Icons mapping for servicesData
const iconMap = {
  "web-architecture": Code2,
  "cloud-backend": Database,
  "mobile-dev": Smartphone,
  "ai-automation": Cpu,
  "devops-cloud": CloudLightning,
  "security-auditing": ShieldCheck,
};

// Reusable Section Component
export function ServicesSnippet({ showAll = true, showTitle = true }) {
  const [activeService, setActiveService] = useState(null);
  const displayedServices = showAll ? servicesData : servicesData.slice(0, 3);

  return (
    <section className="relative w-full py-24 bg-black text-white overflow-hidden">
      {/* Background Subtle Grid & Light Spot */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {showTitle && (
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
              <Sparkles size={13} />
              <span>CORE ARCHITECTURES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              End-to-End Capabilities Built For{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                Scale
              </span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              We design and implement modular architectures engineered to perform under heavy workloads with elegant aesthetic refinement.
            </p>
          </div>
        )}

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedServices.map((service, index) => {
            const Icon = iconMap[service.slug] || Code2;
            const isHovered = activeService === service.id;
            const isAnyHovered = Boolean(activeService);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
                className={`group relative p-7 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-md transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  service.borderGlow
                } ${
                  isAnyHovered && !isHovered ? "opacity-45 scale-[0.98]" : "opacity-100 scale-100"
                } ${
                  isHovered ? "shadow-[0_0_35px_rgba(99,102,241,0.25)] border-indigo-500/40" : "hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
                }`}
              >
                {/* Dynamic Card Glow */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} 
                />

                <div className="relative z-10">
                  {/* Top Bar: Icon + Number Index */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 group-hover:scale-110 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all duration-300">
                      <Icon size={22} />
                    </div>
                    <span className="font-mono text-xs text-zinc-600 group-hover:text-zinc-400 tracking-wider">
                      {service.id}
                    </span>
                  </div>

                  {/* Service Headers */}
                  <span className="text-[11px] font-semibold tracking-wider text-indigo-400 uppercase">
                    {service.tagline}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1 mb-3 group-hover:text-indigo-200 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Interactive Arrow - Now Clickable Route */}
                <Link
                  to={`/services/${service.slug}`}
                  className="relative z-10 mt-8 pt-4 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors"
                >
                  <span>Explore Details</span>
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                    <ArrowUpRight size={14} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Home page ke liye CTA Button */}
        {!showAll && (
          <div className="mt-14 flex justify-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition transform hover:scale-105 active:scale-95"
            >
              <span>View All Services</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// Full Services Page Export
export default function Services() {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      {/* 1. Header Hero Banner */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6 text-center">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
          Tailored Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Solutions</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto">
          Explore our complete suite of software design, high-frequency backend engineering, and cloud deployment capabilities.
        </p>
      </section>

      {/* 2. All 6 Service Cards Bento Grid */}
      <ServicesSnippet showAll={true} showTitle={false} />

      {/* 3. Bottom Direct Call to Action */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Have a complex project in mind?</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6">
            Let's build a fast, secure, and modern digital platform tailored specifically to your roadmap.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}