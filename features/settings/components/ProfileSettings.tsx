import React from "react";
import { Camera, Verified, Lock, Smartphone, Info } from "lucide-react";
import { motion } from "motion/react";

const ProfileSettings: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Profile Identity Section */}
      <section className="bg-surface-container rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-surface-container-highest flex items-center justify-center text-4xl font-bold text-primary border-4 border-background shadow-2xl overflow-hidden">
              <img
                alt="Profile Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8HqJFMdPlsQMRp1-T2GHc1XVHquwmtM7ulSueYgodztkzLqf7XGfMkgGXcAR4DyDNQa4xOC3qT4awRhWJavW7XChvBs48cXMj_irQ2Vxwttj3TZl0TwIbVHTzorDdRGFUhui0y9lz85oQf61uP8hVOqyqjzhEaC-osXezHejep--9OToLb4aJv8j4rOSHphyNoWOnAaVSxl6j0eEW0kUnkL5NmSPBZhP2x9zTPampTQItEdSknQPTOhtT4Db8TnEzDVp-g8g8SOYY"
                referrerPolicy="no-referrer"
              />
            </div>
            <button className="absolute cursor-pointer bottom-0 right-0 w-10 h-10 bg-surface-bright rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-5 h-5 text-on-surface" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-on-surface mb-1">
              Alex Sterling
            </h3>
            <p className="text-on-surface-variant mb-4">
              Update your photo and personal details here.
            </p>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 cursor-pointer rounded-xl bg-primary-container text-on-primary-container text-sm font-semibold hover:opacity-90 transition-opacity">
                Change Photo
              </button>
              <button className="px-5 py-2.5 cursor-pointer rounded-xl bg-surface-container-high text-on-surface text-sm font-semibold hover:bg-surface-bright transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Information Form Section */}
      <section className="bg-surface-container rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Full Name
            </label>
            <input
              className="bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none"
              type="text"
              defaultValue="Alex Sterling"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Email Address
            </label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                type="email"
                defaultValue="alex.sterling@fintech.io"
              />
              <Verified className="absolute right-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5 fill-primary" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Company Name
            </label>
            <input
              className="bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none"
              type="text"
              defaultValue="Sterling Ventures LLC"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Phone Number
            </label>
            <input
              className="bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none"
              type="tel"
              defaultValue="+1 (555) 234-8901"
            />
          </div>
        </div>
      </section>

      {/* Security Preview Card */}
      <section className="bg-surface-container rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-lg font-bold text-on-surface">
              Security Baseline
            </h4>
            <p className="text-sm text-on-surface-variant">
              Manage your authentication and password preferences
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] font-bold text-primary uppercase">
              Secure Connection
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <Lock className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  Account Password
                </p>
                <p className="text-xs text-on-surface-variant">
                  Last changed 3 months ago
                </p>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:underline underline-offset-4 uppercase tracking-wider">
              Update
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-on-surface-variant">
                  Using authenticator app
                </p>
              </div>
            </div>
            <div className="flex items-center h-6 w-11 bg-primary rounded-full p-1 cursor-pointer">
              <div className="bg-white w-4 h-4 rounded-full translate-x-5 transition-transform shadow-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Action Footer */}
      <div className="flex items-center justify-between pt-6">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Info className="w-4 h-4" />
          <span className="text-xs">
            All data is encrypted following SOC2 protocols.
          </span>
        </div>
        <div className="flex gap-4">
          <button className="px-8 cursor-pointer py-3 rounded-xl bg-surface-container-high text-on-surface font-bold hover:bg-surface-bright transition-all">
            Discard
          </button>
          <button className="px-10 cursor-pointer py-3 rounded-xl primary-gradient text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
