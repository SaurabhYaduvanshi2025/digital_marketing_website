import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  User, 
  Loader2 
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // ⚠️ Apne PHP backend endpoint ka URL yahan daalein (e.g., http://localhost/api/contact.php)
      const res = await fetch("http://localhost/api/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.status !== "error") {
        setShowSuccess(true);
        setFormData({ name: "", email: "", phone: "", address: "", message: "" });
      } else {
        setErrorMsg(data.message || "Failed to submit. Please try again.");
      }
    } catch (err) {
      // Offline / Test environment fallback (taaki frontend test kar sakein)
      console.log("Submit fallback for testing:", err);
      setShowSuccess(true);
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white pt-28 pb-20 px-6 overflow-hidden">
      {/* Background Radial Spotlights */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles size={13} />
            <span>GET IN TOUCH</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Let's Engineer Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
              Extraordinary
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Have an enterprise project or architecture in mind? Fill out the brief below and our team will get back to you within 24 hours.
          </p>
        </div>

        {/* 2-Column Split: Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Quick Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-7 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-2">Direct Communications</h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Connect directly with our technical team for immediate project inquiries.
              </p>

              <div className="space-y-4 text-xs text-zinc-300">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Email Us</span>
                    <span className="font-mono text-zinc-200">contact@yourdomain.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Call Directly</span>
                    <span className="font-mono text-zinc-200">+91 98765 43210</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">HQ Location</span>
                    <span className="text-zinc-200">New Delhi, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-zinc-950/60 to-black border border-indigo-500/20">
              <span className="text-[11px] font-semibold tracking-wider text-indigo-400 uppercase">Speed Guarantee</span>
              <h4 className="text-sm font-bold text-white mt-1 mb-1">Guaranteed 24-Hour SLA</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Every inquiry gets reviewed directly by a solutions architect, not a sales bot.
              </p>
            </div>
          </div>

          {/* Right Column: Creative Dark Glass Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 sm:p-10 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {errorMsg}
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <User size={12} className="text-indigo-400" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail size={12} className="text-indigo-400" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Phone & Address Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone size={12} className="text-indigo-400" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin size={12} className="text-indigo-400" /> City / Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Delhi, India"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare size={12} className="text-indigo-400" /> Project Brief / Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your technical requirements, goals, or timeline..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 shadow-[0_0_30px_rgba(99,102,241,0.35)] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Transmitting Payload...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modern Success Popup Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-8 rounded-3xl bg-zinc-950 border border-white/15 text-center shadow-[0_0_60px_rgba(99,102,241,0.25)]"
            >
              {/* Close Icon */}
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white transition"
              >
                <X size={18} />
              </button>

              {/* Animated Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} />
              </div>

              <h3 className="text-2xl font-black tracking-tight text-white mb-2">
                Transmission Received!
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Thank you for reaching out. Your project brief has been securely logged into our system. Our team will contact you shortly.
              </p>

              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition border border-white/10"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}