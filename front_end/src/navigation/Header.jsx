import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
// import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
const navItems = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Blogs", path: "/blogs" },
  { name: "Contact", path: "/contact" },
];

function Header() {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto relative flex items-center justify-between gap-6 px-4 py-2.5 rounded-full bg-neutral-950/70 backdrop-blur-xl border border-white/15 shadow-[0_0_25px_rgba(0,0,0,0.6)] max-w-4xl w-full">
        
        {/* Brand Logo with Glow */}
        {/* <Link to="/" className="flex items-center gap-2 pl-2 text-white font-bold text-sm tracking-wide group">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 group-hover:scale-110 transition-transform">
            <Sparkles size={14} />
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-sm pointer-events-none" />
          </div>
          <span className="font-semibold text-zinc-100">Enterprise</span>
        </Link>
 */}
        {/* Center Nav Links with Magic UI Animated Pill Hover */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative px-4 py-1.5 text-xs font-medium tracking-wide transition-colors rounded-full",
                  isActive ? "text-white font-semibold" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {/* Magic UI Hover Sliding Pill */}
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="magic-hover-pill"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/10"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.35 }}
                  />
                )}

                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full shadow-[0_0_6px_#818cf8]" />
                )}

                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Shimmer-style CTA Button */}
        <Link
          to="/contact"
          className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition transform hover:scale-[1.03] active:scale-[0.98]"
        >
          <span>Get in Touch</span>
          {/* <ArrowRight size={13} /> */}
        </Link>
      </nav>
    </header>
  );
}

// Yahan export ho gaya:
export default Header;