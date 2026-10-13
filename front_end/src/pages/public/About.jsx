import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Target, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "99.9%", label: "System Uptime" },
  { value: "10x", label: "Faster Deployment" },
  { value: "150+", label: "Projects Delivered" },
  { value: "24/7", label: "Support" },
];

const highlights = [
  {
    icon: Zap,
    title: "Ultra Fast Performance",
    desc: "Optimized at the edge with high-speed execution and minimum latency.",
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    desc: "Clean and reusable codebase structured to scale effortlessly.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Grade Security",
    desc: "Robust data protection with modern compliance standards.",
  },
];

// Yeh wahi half part hai jo Home page par bhi dikhega
export function AboutSnippet({ showButton = true }) {
  return (
    <section className="relative w-full py-20 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Badge & Title */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles size={13} />
            <span>WHO WE ARE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Engineering experiences with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
              precision & craft
            </span>.
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-zinc-400">
            We deliver modern web applications with clean design and rock-solid architecture.
          </p>
        </div>

        {/* Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                  <Icon size={18} />
                </div>
                <h3 className="text-base font-semibold text-zinc-100 mb-2">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</span>
              <span className="text-xs text-zinc-400 mt-1">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Read More button (sirf Home page ke liye) */}
        {showButton && (
          <div className="mt-10 flex justify-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
            >
              <span>Learn More About Us</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// Poora About page
export default function About() {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      {/* 1. Core Info & Stats */}
      <AboutSnippet showButton={false} />

      {/* 2. Extra Mission Details (Sirf About page par) */}
      <section className="py-16 border-t border-white/10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
              <Target size={13} />
              <span>OUR VISION</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Building next-gen digital infrastructure.
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
              Har single web application ko scale aur speed ke liye design kiya jata hai taaki users ko smooth experience mile.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-indigo-400" />
                <span>Pixel-perfect responsive design.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-indigo-400" />
                <span>High-performance modern animations.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-white/10 text-center">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Modern CMS Experience</span>
          </div>
        </div>
      </section>
    </div>
  );
}