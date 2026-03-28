"use client";

import BrandPanel from "@/features/auth/components/login/BrandPanel";
import LoginFormView from "@/features/auth/components/login/LoginForm";
import { motion } from "motion/react";

const Login = () => {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Dynamic Background Decoration */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-125 h-125 bg-primary-container/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-150 h-150 bg-tertiary-container/10 rounded-full blur-[150px]"
          />
        </div>

        {/* Auth Container */}
        <motion.main
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-surface-container rounded-2xl shadow-2xl relative z-10"
        >
          <BrandPanel />
          <LoginFormView />
        </motion.main>
      </div>
    </div>
  );
};

export default Login;
