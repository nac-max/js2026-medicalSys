import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Shield, Zap } from 'lucide-react';
import { BackgroundBeams } from '../../components/ui/background-beams';
import { CardSpotlight } from '../../components/ui/card-spotlight';
import { TextGenerateEffect } from '../../components/ui/text-generate-effect';

const platforms = [
  {
    id: 'patient',
    label: 'PATIENT',
    sublabel: '患者平台',
    desc: 'Submit symptoms, track diagnoses, and communicate with your medical team',
    login: '/login',
    register: '/register',
    tag: '01',
    accent: '#0066FF',
    accentClass: 'border-primary-500 text-primary-600 hover:bg-primary-50',
  },
  {
    id: 'doctor',
    label: 'PHYSICIAN',
    sublabel: '医生平台',
    desc: 'Review AI-assisted case analysis, manage patient records, and collaborate on diagnoses',
    login: '/doctor-login',
    register: '/doctor-register',
    tag: '02',
    accent: '#00A86B',
    accentClass: 'border-success-500 text-success-600 hover:bg-success-50',
  },
  {
    id: 'admin',
    label: 'ADMIN',
    sublabel: '管理后台',
    desc: 'Configure AI models, manage knowledge bases, and oversee system operations',
    login: '/admin-login',
    register: null,
    tag: '03',
    accent: '#CC5500',
    accentClass: 'border-[#CC5500] text-[#CC5500] hover:bg-[#FFF8F0]',
  },
];

const PlatformSelect: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col relative overflow-hidden">
      <BackgroundBeams />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 border-b-2 border-neutral-200 bg-white px-6 md:px-12 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-primary-500" />
          <span className="font-bold text-lg text-neutral-800 tracking-wide">
            MEDICARE_AI
          </span>
        </div>
        <div className="text-xs text-neutral-400 tracking-widest">
          SYS v3.0 // 2026
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-12 md:py-16 gap-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-2 border-2 border-primary-500 bg-primary-50">
            <motion.div
              className="w-2 h-2 rounded-full bg-primary-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-semibold text-primary-600 tracking-widest">
              SELECT ACCESS LEVEL
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-neutral-800 leading-none tracking-tight mb-4">
            AI-POWERED
            <br />
            MEDICAL SYSTEM
          </h1>

          <p className="text-base text-neutral-500 max-w-lg leading-relaxed">
            智能医疗诊断系统 — 选择你的身份入口继续访问
          </p>
        </motion.div>

        {/* Platform Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 border-2 border-neutral-200"
        >
          {platforms.map((platform, index) => (
            <CardSpotlight
              key={platform.id}
              className={`relative p-6 md:p-8 bg-white transition-all duration-200 ${
                index < platforms.length - 1 ? 'border-b-2 md:border-b-0 md:border-r-2 border-neutral-200' : ''
              }`}
            >
              <div className="text-xs font-bold text-neutral-400 tracking-widest mb-4">
                {platform.tag}
              </div>

              <div className="w-10 h-1 mb-4" style={{ background: platform.accent }} />

              <h3 className="text-2xl font-bold text-neutral-800 tracking-wide mb-1">
                {platform.label}
              </h3>

              <p className="text-sm font-semibold mb-3" style={{ color: platform.accent }}>
                {platform.sublabel}
              </p>

              <p className="text-sm text-neutral-600 leading-relaxed mb-6 min-h-[60px]">
                {platform.desc}
              </p>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ x: 2, y: 2 }}
                  whileTap={{ x: 4, y: 4 }}
                  onClick={() => navigate(platform.login)}
                  className={`flex items-center justify-between px-4 py-3 border-2 font-semibold text-sm tracking-wide transition-colors ${platform.accentClass}`}
                  style={{ borderColor: platform.accent, color: platform.accent }}
                >
                  <span>LOGIN →</span>
                  <span className="text-xs opacity-70">登录</span>
                </motion.button>

                {platform.register && (
                  <motion.button
                    whileHover={{ x: 2, y: 2 }}
                    whileTap={{ x: 4, y: 4 }}
                    onClick={() => navigate(platform.register)}
                    className={`flex items-center justify-between px-4 py-3 border-2 font-semibold text-sm tracking-wide transition-colors ${platform.accentClass}`}
                    style={{ borderColor: platform.accent, color: platform.accent }}
                  >
                    <span>REGISTER →</span>
                    <span className="text-xs opacity-70">注册</span>
                  </motion.button>
                )}
              </div>
            </CardSpotlight>
          ))}
        </motion.div>

        {/* Security Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-6 pt-4 border-t border-neutral-200 flex-wrap"
        >
          {[
            { icon: Shield, text: 'HIPAA COMPLIANT' },
            { icon: Zap, text: 'AES-256 ENCRYPTED' },
            { icon: Activity, text: 'ISO 27001 CERTIFIED' },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-400 tracking-widest"
            >
              <item.icon className="w-3 h-3 text-success-500" />
              {item.text}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PlatformSelect;
