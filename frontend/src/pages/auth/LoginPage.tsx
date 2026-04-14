import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { BackgroundBeams } from '../../components/ui/background-beams';
import { CardSpotlight } from '../../components/ui/card-spotlight';
import type { LoginCredentials } from '../../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, isLoading, error, clearError } = useAuthContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
      platform: 'patient',
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRoutes: { [key: string]: string } = {
        patient: '/patient',
        doctor: '/doctor',
        admin: '/admin',
      };
      navigate(roleRoutes[user.role] || '/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    clearError();
    const savedEmail = localStorage.getItem('medicare_remember_email');
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, [clearError, setValue]);

  const onSubmit = async (data: LoginCredentials) => {
    setIsSubmitting(true);
    try {
      if (rememberMe) {
        localStorage.setItem('medicare_remember_email', data.email);
      } else {
        localStorage.removeItem('medicare_remember_email');
      }
      await login(data);
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-50">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center relative overflow-hidden">
      <BackgroundBeams />

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 bg-white border-2 border-neutral-200 overflow-hidden"
        >
          {/* Left Side - Info */}
          <div className="p-8 md:p-12 bg-primary-50 border-r-0 md:border-r-2 border-neutral-200 flex flex-col justify-center">
            <div className="w-10 h-1 bg-primary-500 mb-6" />

            <h2 className="text-4xl font-black text-neutral-800 mb-2 tracking-tight">
              PATIENT
            </h2>

            <p className="text-xs font-semibold text-primary-600 mb-8 tracking-widest">
              患者平台 // PLATFORM
            </p>

            <div className="flex flex-col gap-4">
              {[
                { label: 'AI Symptom Analysis', desc: '智能症状分析与诊断建议' },
                { label: 'Medical Records', desc: '完整的电子病历管理' },
                { label: 'Document Parsing', desc: '医疗文档智能解析' },
              ].map((item, idx) => (
                <CardSpotlight
                  key={idx}
                  className="p-4 bg-white border-2 border-neutral-200 transition-all hover:border-primary-500 hover:translate-x-1"
                >
                  <p className="text-sm text-primary-600 font-bold mb-1 tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-xs text-neutral-600">{item.desc}</p>
                </CardSpotlight>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>

            <h3 className="text-3xl font-black text-neutral-800 mb-2">登录</h3>
            <p className="text-sm text-neutral-500 mb-8">Patient Login</p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  邮箱地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    {...register('email', {
                      required: '请输入邮箱地址',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: '邮箱格式不正确',
                      },
                    })}
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors text-neutral-800"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    {...register('password', {
                      required: '请输入密码',
                      minLength: { value: 6, message: '密码至少6位' },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors text-neutral-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-2 border-neutral-300 text-primary-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-sm text-neutral-600">记住我</span>
              </label>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-3 bg-primary-500 text-white font-bold border-2 border-primary-600 hover:bg-primary-600 disabled:bg-neutral-200 disabled:border-neutral-300 disabled:text-neutral-400 transition-colors"
              >
                {isSubmitting || isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  '登录'
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
              <p className="text-sm text-neutral-600">
                还没有账号？{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-primary-600 font-semibold hover:underline"
                >
                  立即注册
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
