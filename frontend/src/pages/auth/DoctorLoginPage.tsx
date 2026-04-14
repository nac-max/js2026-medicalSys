import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack,
  MedicalServices,
  HealthAndSafety,
  Favorite,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../contexts/AuthContext';
import { BackgroundBeams } from '../../components/ui/background-beams';
import type { LoginCredentials } from '../../types';

const DoctorLoginPage: React.FC = () => {
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
      platform: 'doctor',
    },
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === 'doctor') {
      navigate('/doctor', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    clearError();
    const savedEmail = localStorage.getItem('medicare_doctor_remember_email');
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: LoginCredentials) => {
    setIsSubmitting(true);
    try {
      if (rememberMe) {
        localStorage.setItem('medicare_doctor_remember_email', data.email);
      } else {
        localStorage.removeItem('medicare_doctor_remember_email');
      }
      await login(data);
      if (user?.role !== 'doctor') {
        throw new Error('此账号不是医生账号');
      }
    } catch (error: any) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: '#00A86B' }} />
      </Box>
    );
  }

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
          <div className="w-2 h-8 bg-success-500" />
          <span className="font-bold text-lg text-neutral-800 tracking-wide">
            MEDICARE_AI
          </span>
        </div>
        <div className="text-xs text-neutral-400 tracking-widest">
          PHYSICIAN LOGIN
        </div>
      </motion.header>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10, py: 8, flex: 1, display: 'flex', alignItems: 'center' }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ width: '100%' }}
        >
          <Box
            sx={{
              background: 'white',
              border: '2px solid #e5e5e5',
              borderRadius: 0,
              p: 4,
              boxShadow: '8px 8px 0 rgba(0,0,0,0.05)',
            }}
          >
            <Button
              component="button"
              onClick={() => navigate('/platform-select')}
              startIcon={<ArrowBack />}
              sx={{
                mb: 3,
                color: '#737373',
                textTransform: 'none',
                border: '2px solid #e5e5e5',
                px: 2,
                py: 1,
                '&:hover': {
                  color: '#00A86B',
                  borderColor: '#00A86B',
                  background: '#F0FDF4',
                },
              }}
            >
              返回平台选择
            </Button>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MedicalServices sx={{ fontSize: 40, color: '#00A86B' }} />
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: '#171717',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    医生登录
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
                    PHYSICIAN LOGIN
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HealthAndSafety sx={{ fontSize: 16, color: '#00A86B' }} />
                  <Typography variant="caption" sx={{ color: '#737373', fontWeight: 600 }}>
                    专业认证
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Favorite sx={{ fontSize: 16, color: '#00A86B' }} />
                  <Typography variant="caption" sx={{ color: '#737373', fontWeight: 600 }}>
                    安全可靠
                  </Typography>
                </Box>
              </Box>
            </Box>

            {error && (
              <Alert
                severity="error"
                onClose={clearError}
                sx={{
                  mb: 3,
                  border: '2px solid #DC2626',
                  borderRadius: 0,
                  background: '#FEF2F2',
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  {...register('email', {
                    required: '请输入邮箱',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: '邮箱格式不正确',
                    },
                  })}
                  fullWidth
                  label="邮箱"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#00A86B' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#171717',
                      borderRadius: 0,
                      '& fieldset': { borderColor: '#e5e5e5', borderWidth: 2 },
                      '&:hover fieldset': { borderColor: '#00A86B' },
                      '&.Mui-focused fieldset': { borderColor: '#00A86B', borderWidth: 2 },
                    },
                    '& .MuiInputLabel-root': { color: '#737373', fontWeight: 600 },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#00A86B', fontWeight: 600 },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  {...register('password', {
                    required: '请输入密码',
                    minLength: { value: 6, message: '密码至少6位' },
                  })}
                  fullWidth
                  label="密码"
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#00A86B' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff sx={{ color: '#00A86B' }} /> : <Visibility sx={{ color: '#00A86B' }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#171717',
                      borderRadius: 0,
                      '& fieldset': { borderColor: '#e5e5e5', borderWidth: 2 },
                      '&:hover fieldset': { borderColor: '#00A86B' },
                      '&.Mui-focused fieldset': { borderColor: '#00A86B', borderWidth: 2 },
                    },
                    '& .MuiInputLabel-root': { color: '#737373', fontWeight: 600 },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#00A86B', fontWeight: 600 },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: '#00A86B',
                        '&.Mui-checked': { color: '#00A86B' },
                      }}
                    />
                  }
                  label={<Typography variant="body2" sx={{ color: '#737373' }}>记住我</Typography>}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  py: 1.5,
                  background: '#00A86B',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 0,
                  border: '2px solid #00A86B',
                  textTransform: 'none',
                  boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                  '&:hover': {
                    background: '#008F5A',
                    borderColor: '#008F5A',
                    transform: 'translate(2px, 2px)',
                    boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
                  },
                  '&:disabled': {
                    background: '#e5e5e5',
                    color: '#a3a3a3',
                    borderColor: '#e5e5e5',
                  },
                }}
              >
                {isSubmitting ? <CircularProgress size={24} sx={{ color: '#00A86B' }} /> : '登录'}
              </Button>

              <Divider sx={{ my: 3, borderColor: '#e5e5e5' }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#737373' }}>
                  还没有医生账号？{' '}
                  <Link
                    component={RouterLink}
                    to="/doctor-register"
                    sx={{
                      color: '#00A86B',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    立即注册
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>
        </motion.div>
      </Container>
    </div>
  );
};

export default DoctorLoginPage;
