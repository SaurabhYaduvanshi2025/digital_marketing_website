import { Link } from "react-router-dom";
import { Sparkles, Code2, AtSign, BriefcaseBusiness, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-base mb-4">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <span>Enterprise</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crafting scalable, high-performance web experiences with modern architecture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition">Blogs</Link></li>
            </ul>
          </div>

          {/* Support / Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Support</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><a href="#privacy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Connect</h4>
            <div className="flex gap-3">
              <a aria-label="GitHub" href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition">
                <Code2 size={16} />
              </a>
              <a aria-label="Twitter" href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition">
                <AtSign size={16} />
              </a>
              <a aria-label="LinkedIn" href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition">
                <BriefcaseBusiness size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} Enterprise. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={12} className="text-red-500 fill-red-500" /> for the web
          </p>
        </div>
      </div>
    </footer>
  );
}
