// src/navigation/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Enterprise</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Delivering high-performance digital products and scalable enterprise architectures.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
            <li><Link to="/blogs" className="hover:text-white transition">Blog Posts</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Our Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services/cloud-solutions" className="hover:text-white transition">Cloud Solutions</Link></li>
            <li><Link to="/services/web-development" className="hover:text-white transition">Web Development</Link></li>
            <li><Link to="/services/ui-ux-design" className="hover:text-white transition">UI/UX Design</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Info</h4>
          <p className="text-sm text-slate-400">info@enterprise.com</p>
          <p className="text-sm text-slate-400 mt-1">+91 98765 43210</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-900 text-xs text-center text-slate-500">
        &copy; {new Date().getFullYear()} Enterprise Inc. All rights reserved.
      </div>
    </footer>
  );
}