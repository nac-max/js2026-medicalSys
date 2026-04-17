import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  EditNote as EditNoteIcon,
  FolderOpen as FolderOpenIcon,
  Favorite as Heart,
  TrendingUp as Activity,
  Description as FileText,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { patientsApi } from '../../services/api';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    managedPatients: 0,
    todayDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      setLoading(true);
      const patients = await patientsApi.getPatients();
      const patientCount = patients?.length || 0;

      setStats({
        totalPatients: patientCount,
        managedPatients: patientCount,
        todayDate: new Date().toLocaleDateString('zh-CN'),
      });
    } catch (err) {
      console.error('加载统计数据失败:', err);
      setError('加载统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b-2 border-neutral-200 bg-white"
      >
        <Container maxWidth="lg">
          <Box sx={{ py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <div className="w-2 h-12 bg-primary-500" />
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: '#171717',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {user?.full_name || '患者'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
                  PATIENT DASHBOARD
                </Typography>
              </Box>
            </Box>
            <Button
              onClick={handleLogout}
              sx={{
                color: '#DC2626',
                border: '2px solid #DC2626',
                px: 3,
                py: 1,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  background: '#FEF2F2',
                  borderColor: '#DC2626',
                },
              }}
            >
              退出登录
            </Button>
          </Box>
        </Container>
      </motion.div>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert
            severity="error"
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

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress sx={{ color: '#0066FF' }} />
          </Box>
        ) : (
          <>
            {/* Quick Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Box
                sx={{
                  background: 'white',
                  border: '2px solid #e5e5e5',
                  p: 4,
                  mb: 4,
                  boxShadow: '8px 8px 0 rgba(0,0,0,0.05)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: '#171717',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <div className="w-1 h-6 bg-primary-500" />
                  快速操作
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div whileHover={{ x: 2, y: 2 }} whileTap={{ x: 4, y: 4 }}>
                      <Button
                        fullWidth
                        onClick={() => navigate('/patient/symptom-submit')}
                        sx={{
                          py: 2,
                          background: '#0066FF',
                          color: 'white',
                          fontWeight: 700,
                          border: '2px solid #0066FF',
                          textTransform: 'none',
                          boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                          '&:hover': {
                            background: '#0052CC',
                            borderColor: '#0052CC',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <EditNoteIcon sx={{ fontSize: 28 }} />
                          <span>提交症状</span>
                        </Box>
                      </Button>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div whileHover={{ x: 2, y: 2 }} whileTap={{ x: 4, y: 4 }}>
                      <Button
                        fullWidth
                        onClick={() => navigate('/patient/medical-records')}
                        sx={{
                          py: 2,
                          background: 'white',
                          color: '#0066FF',
                          fontWeight: 700,
                          border: '2px solid #0066FF',
                          textTransform: 'none',
                          boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                          '&:hover': {
                            background: '#EFF6FF',
                            borderColor: '#0066FF',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <FolderOpenIcon sx={{ fontSize: 28 }} />
                          <span>诊疗记录</span>
                        </Box>
                      </Button>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div whileHover={{ x: 2, y: 2 }} whileTap={{ x: 4, y: 4 }}>
                      <Button
                        fullWidth
                        onClick={() => navigate('/patient/profile')}
                        sx={{
                          py: 2,
                          background: 'white',
                          color: '#0066FF',
                          fontWeight: 700,
                          border: '2px solid #0066FF',
                          textTransform: 'none',
                          boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                          '&:hover': {
                            background: '#EFF6FF',
                            borderColor: '#0066FF',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 28 }} />
                          <span>个人资料</span>
                        </Box>
                      </Button>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div whileHover={{ x: 2, y: 2 }} whileTap={{ x: 4, y: 4 }}>
                      <Button
                        fullWidth
                        onClick={() => navigate('/patient/complete-profile')}
                        sx={{
                          py: 2,
                          background: 'white',
                          color: '#0066FF',
                          fontWeight: 700,
                          border: '2px solid #0066FF',
                          textTransform: 'none',
                          boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                          '&:hover': {
                            background: '#EFF6FF',
                            borderColor: '#0066FF',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <DescriptionIcon sx={{ fontSize: 28 }} />
                          <span>完善资料</span>
                        </Box>
                      </Button>
                    </motion.div>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      background: 'white',
                      border: '2px solid #e5e5e5',
                      p: 3,
                      boxShadow: '6px 6px 0 rgba(0,0,0,0.05)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          background: '#EFF6FF',
                          border: '2px solid #0066FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Heart sx={{ color: '#0066FF' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#171717' }}>
                          {stats.totalPatients}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
                          总患者数
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      background: 'white',
                      border: '2px solid #e5e5e5',
                      p: 3,
                      boxShadow: '6px 6px 0 rgba(0,0,0,0.05)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          background: '#EFF6FF',
                          border: '2px solid #0066FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Activity sx={{ color: '#0066FF' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#171717' }}>
                          {stats.managedPatients}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
                          管理患者数
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      background: 'white',
                      border: '2px solid #e5e5e5',
                      p: 3,
                      boxShadow: '6px 6px 0 rgba(0,0,0,0.05)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          background: '#EFF6FF',
                          border: '2px solid #0066FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FileText sx={{ color: '#0066FF' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#171717' }}>
                          {stats.todayDate}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
                          今日日期
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Box
                sx={{
                  background: 'white',
                  border: '2px solid #e5e5e5',
                  p: 4,
                  mt: 4,
                  boxShadow: '8px 8px 0 rgba(0,0,0,0.05)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: '#171717',
                    mb: 2,
                  }}
                >
                  关于 MediCareAI
                </Typography>
                <Typography variant="body1" sx={{ color: '#737373', lineHeight: 1.8, mb: 3 }}>
                  MediCareAI 使用先进的 AI 技术为您提供智能诊疗建议。
                  本系统仅供参考，请以医生的实际诊断为准。
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                  <Box
                    sx={{
                      px: 3,
                      py: 1,
                      border: '2px solid #e5e5e5',
                      background: '#fafafa',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#737373', fontWeight: 600 }}>
                      长安大学 Chang&apos;an University
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 3,
                      py: 1,
                      border: '2px solid #e5e5e5',
                      background: '#fafafa',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#737373', fontWeight: 600 }}>
                      License: MIT
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    pt: 3,
                    borderTop: '1px solid #e5e5e5',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#a3a3a3', fontWeight: 600 }}>
                    Developed by Chang&apos;an University | AI-Powered Medical Diagnosis System
                  </Typography>
                  <br />
                  <Typography variant="caption" sx={{ color: '#a3a3a3', fontWeight: 600 }}>
                    长安大学开发 | 人工智能医疗诊断系统 | © 2026
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
