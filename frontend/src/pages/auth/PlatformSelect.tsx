import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  alpha,
} from '@mui/material';
import {
  Person,
  LocalHospital,
  Settings,
  ArrowForward,
  TrendingUp,
  Security,
  Speed,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface Platform {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  accentColor: string;
}

const PlatformSelect: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const platforms: Platform[] = [
    {
      id: 'patient',
      title: '患者平台',
      description: '提交症状、获取AI诊断建议、管理您的健康档案',
      icon: <Person sx={{ fontSize: 48 }} />,
      features: ['智能症状分析', '诊疗记录管理', '文档上传解析'],
      color: '#ff6b6b',
      accentColor: '#ee5a6f',
    },
    {
      id: 'doctor',
      title: '医生平台',
      description: '浏览专业领域病例、科研数据导出、患者@病例管理',
      icon: <LocalHospital sx={{ fontSize: 48 }} />,
      features: ['匿名化病例', '@我的病例', '科研数据导出'],
      color: '#4ecdc4',
      accentColor: '#45b7af',
    },
    {
      id: 'admin',
      title: '管理平台',
      description: '系统监控、AI模型配置、知识库管理、医生认证审核',
      icon: <Settings sx={{ fontSize: 48 }} />,
      features: ['系统监控', 'AI模型配置', '医生认证审核'],
      color: '#f7b731',
      accentColor: '#ffa502',
    },
  ];

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(165deg, #0a0e27 0%, #1a1f3a 40%, #2d1b3d 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(78,205,196,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 8 } }}>
        {/* Header */}
        <Box sx={{ mb: 8, ml: { xs: 2, md: 6 } }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '3rem', md: '5.5rem' },
              fontWeight: 900,
              background: 'linear-gradient(135deg, #fff 0%, #4ecdc4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.04em',
              mb: 2,
              textShadow: '0 0 40px rgba(78,205,196,0.3)',
            }}
          >
            MediCareAI
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 300,
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            智能疾病管理系统
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 300,
              fontStyle: 'italic',
            }}
          >
            Intelligent Disease Management System
          </Typography>
        </Box>

        {/* Platform Cards */}
        <Grid container spacing={4} sx={{ px: { xs: 2, md: 6 } }}>
          {platforms.map((platform, index) => (
            <Grid item xs={12} md={4} key={platform.id}>
              <Card
                onMouseEnter={() => setHoveredCard(platform.id)}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${alpha(platform.color, 0.3)}`,
                  borderRadius: 4,
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: hoveredCard === platform.id ? 'translateY(-12px) scale(1.02)' : 'translateY(0)',
                  boxShadow: hoveredCard === platform.id
                    ? `0 20px 60px ${alpha(platform.color, 0.4)}`
                    : '0 8px 32px rgba(0,0,0,0.3)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${platform.color}, ${platform.accentColor})`,
                    opacity: hoveredCard === platform.id ? 1 : 0.6,
                    transition: 'opacity 0.3s',
                  },
                }}
              >
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(platform.color, 0.2)}, ${alpha(platform.accentColor, 0.1)})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      color: platform.color,
                      transition: 'transform 0.3s',
                      transform: hoveredCard === platform.id ? 'rotate(-5deg) scale(1.1)' : 'rotate(0)',
                    }}
                  >
                    {platform.icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {platform.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 3,
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {platform.description}
                  </Typography>

                  {/* Features */}
                  <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {platform.features.map((feature, idx) => (
                      <Chip
                        key={idx}
                        label={feature}
                        size="small"
                        sx={{
                          bgcolor: alpha(platform.color, 0.15),
                          color: platform.color,
                          border: `1px solid ${alpha(platform.color, 0.3)}`,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Box>

                  {/* Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      component={RouterLink}
                      to={
                        platform.id === 'patient'
                          ? '/login'
                          : platform.id === 'doctor'
                          ? '/doctor-login'
                          : '/admin-login'
                      }
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForward />}
                      sx={{
                        py: 1.5,
                        background: `linear-gradient(135deg, ${platform.color}, ${platform.accentColor})`,
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          background: `linear-gradient(135deg, ${platform.accentColor}, ${platform.color})`,
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      登录
                    </Button>
                    {(platform.id === 'patient' || platform.id === 'doctor') && (
                      <Button
                        component={RouterLink}
                        to={platform.id === 'patient' ? '/register' : '/doctor-register'}
                        variant="outlined"
                        sx={{
                          py: 1.5,
                          px: 2,
                          borderColor: alpha(platform.color, 0.5),
                          color: platform.color,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: platform.color,
                            bgcolor: alpha(platform.color, 0.1),
                          },
                        }}
                      >
                        注册
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 12, px: { xs: 2, md: 6 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'left' }}>
                <TrendingUp sx={{ fontSize: 40, color: '#4ecdc4', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                  AI驱动诊断
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  基于MinerU和大语言模型的智能诊断系统
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'left' }}>
                <Security sx={{ fontSize: 40, color: '#ff6b6b', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                  数据安全保护
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  符合医疗数据隐私保护标准的加密存储
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'left' }}>
                <Speed sx={{ fontSize: 40, color: '#f7b731', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                  高效协作
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  患者、医生、管理员三端协同工作流程
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 12,
            py: 4,
            px: { xs: 2, md: 6 },
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
            MediCareAI © 2025
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
            长安大学 Chang'an University
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 1 }}>
            MIT License
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PlatformSelect;