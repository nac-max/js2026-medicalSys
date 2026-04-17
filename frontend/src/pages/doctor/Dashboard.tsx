import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import {
  MedicalServices as MedicalServicesIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { doctorsApi } from '../../services/api';
import type { Doctor, SharedMedicalCase } from '../../types';

interface DashboardStats {
  mentioned_cases: number;
  public_cases: number;
  today_cases: number;
  exported_count: number;
  growth: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState<string>('');

  const {
    data: doctor,
    error: doctorError,
  } = useQuery<Doctor>({
    queryKey: ['doctor', 'profile'],
    queryFn: doctorsApi.getProfile,
  });

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useQuery<DashboardStats>({
    queryKey: ['doctor', 'dashboard-stats'],
    queryFn: async () => {
      const data = await doctorsApi.getDashboardStats();
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const {
    data: recentCases,
    isLoading: casesLoading,
  } = useQuery<SharedMedicalCase[]>({
    queryKey: ['doctor', 'recent-mentions'],
    queryFn: async () => {
      const data = await doctorsApi.getCases('mentioned', 5);
      return Array.isArray(data) ? data : (data.cases || []);
    },
    refetchOnMount: true,
  });

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    setCurrentDate(date.toLocaleDateString('zh-CN', options));
  }, []);

  const handleViewCase = (caseId: string) => {
    navigate(`/doctor/cases/${caseId}`);
  };

  const StatCard: React.FC<{
    title: string;
    value: number | string;
    subtitle: string;
    icon: React.ReactNode;
    color?: string;
    onClick?: () => void;
  }> = ({ title, value, subtitle, icon, color = '#00A86B', onClick }) => (
    <motion.div whileHover={{ x: onClick ? 2 : 0, y: onClick ? 2 : 0 }}>
      <Box
        onClick={onClick}
        sx={{
          background: 'white',
          border: '2px solid #e5e5e5',
          p: 3,
          cursor: onClick ? 'pointer' : 'default',
          boxShadow: '6px 6px 0 rgba(0,0,0,0.05)',
          transition: 'all 0.2s',
          '&:hover': onClick ? {
            borderColor: color,
          } : {},
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              background: `${color}15`,
              border: `2px solid ${color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#171717' }}>
            {value}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#171717', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
          {subtitle}
        </Typography>
      </Box>
    </motion.div>
  );

  const CaseItem: React.FC<{ caseItem: SharedMedicalCase }> = ({ caseItem }) => {
    const profile = caseItem.anonymous_patient_profile || {};

    return (
      <motion.div whileHover={{ x: 2, y: 2 }}>
        <Box
          onClick={() => handleViewCase(caseItem.id)}
          sx={{
            background: 'white',
            border: '2px solid #e5e5e5',
            p: 3,
            cursor: 'pointer',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.05)',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: '#00A86B',
            },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#171717' }}>
              病例 #{caseItem.id.toString().slice(0, 8)}
            </Typography>
            <Box
              sx={{
                px: 2,
                py: 0.5,
                border: '2px solid #00A86B',
                background: '#F0FDF4',
              }}
            >
              <Typography variant="caption" sx={{ color: '#00A86B', fontWeight: 700 }}>
                {caseItem.original_case?.disease?.name || '未分类'}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
              👤 {profile.age_range || '未知年龄'} · {profile.gender || '未知性别'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
              📍 {profile.city_tier || '未知地区'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
              📅 {new Date(caseItem.created_at).toLocaleDateString('zh-CN')}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: '#737373',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {caseItem.anonymized_symptoms || '暂无症状描述'}
          </Typography>
        </Box>
      </motion.div>
    );
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
              <div className="w-2 h-12 bg-success-500" />
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: '#171717',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {doctor?.full_name || '医生'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
                  PHYSICIAN DASHBOARD
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
              {currentDate}
            </Typography>
          </Box>
        </Container>
      </motion.div>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {(doctorError || statsError) && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              border: '2px solid #DC2626',
              borderRadius: 0,
              background: '#FEF2F2',
            }}
          >
            加载数据失败，请刷新页面重试
          </Alert>
        )}

        {statsLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress sx={{ color: '#00A86B' }} />
          </Box>
        ) : (
          <>
            {/* Stats Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="@我的病例"
                    value={stats?.mentioned_cases || 0}
                    subtitle="需要您参与的病例"
                    icon={<PersonIcon sx={{ color: '#00A86B', fontSize: 24 }} />}
                    color="#00A86B"
                    onClick={() => navigate('/doctor/mentions')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="公开病例"
                    value={stats?.public_cases || 0}
                    subtitle="可浏览的病例总数"
                    icon={<VisibilityIcon sx={{ color: '#0066FF', fontSize: 24 }} />}
                    color="#0066FF"
                    onClick={() => navigate('/doctor/cases')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="今日新增"
                    value={stats?.today_cases || 0}
                    subtitle="今天新增的病例"
                    icon={<TrendingUpIcon sx={{ color: '#F59E0B', fontSize: 24 }} />}
                    color="#F59E0B"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="已导出"
                    value={stats?.exported_count || 0}
                    subtitle="导出的科研数据"
                    icon={<DownloadIcon sx={{ color: '#8B5CF6', fontSize: 24 }} />}
                    color="#8B5CF6"
                    onClick={() => navigate('/doctor/export')}
                  />
                </Grid>
              </Grid>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
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
                  <div className="w-1 h-6 bg-success-500" />
                  快速操作
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <motion.div whileHover={{ x: 2, y: 2 }} whileTap={{ x: 4, y: 4 }}>
                    <Button
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate('/doctor/cases')}
                      sx={{
                        px: 3,
                        py: 1.5,
                        background: '#00A86B',
                        color: 'white',
                        fontWeight: 700,
                        border: '2px solid #00A86B',
                        textTransform: 'none',
                        boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                        '&:hover': {
                          background: '#008F5A',
                          borderColor: '#008F5A',
                        },
                      }}
                    >
                      浏览公开病例
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ x: 2, y: 2 }} whileTap={{ x: 4, y: 4 }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => navigate('/doctor/export')}
                      sx={{
                        px: 3,
                        py: 1.5,
                        color: '#00A86B',
                        fontWeight: 700,
                        border: '2px solid #00A86B',
                        textTransform: 'none',
                        boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                        '&:hover': {
                          background: '#F0FDF4',
                          borderColor: '#00A86B',
                        },
                      }}
                    >
                      导出科研数据
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>

            {/* Recent Cases */}
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
                  boxShadow: '8px 8px 0 rgba(0,0,0,0.05)',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: '#171717',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <div className="w-1 h-6 bg-success-500" />
                    最近@我的病例
                  </Typography>
                  <Button
                    onClick={() => navigate('/doctor/mentions')}
                    sx={{
                      color: '#00A86B',
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': {
                        background: '#F0FDF4',
                      },
                    }}
                  >
                    查看全部 →
                  </Button>
                </Box>

                {casesLoading ? (
                  <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress sx={{ color: '#00A86B' }} />
                  </Box>
                ) : recentCases && recentCases.length > 0 ? (
                  <Box display="flex" flexDirection="column" gap={2}>
                    {recentCases.map((caseItem) => (
                      <CaseItem key={caseItem.id} caseItem={caseItem} />
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 6,
                      border: '2px dashed #e5e5e5',
                      background: '#fafafa',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 48, color: '#d4d4d4', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: '#737373', fontWeight: 600 }}>
                      暂无@您的病例
                    </Typography>
                  </Box>
                )}
              </Box>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Box
                sx={{
                  background: 'white',
                  border: '2px solid #e5e5e5',
                  p: 3,
                  mt: 4,
                  boxShadow: '6px 6px 0 rgba(0,0,0,0.05)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600, mb: 1 }}>
                  Developed by Chang&apos;an University | AI-Powered Medical Diagnosis System
                </Typography>
                <Typography variant="caption" sx={{ color: '#a3a3a3', fontWeight: 600 }}>
                  长安大学开发 | 人工智能医疗诊断系统 | © 2026
                </Typography>
              </Box>
            </motion.div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
