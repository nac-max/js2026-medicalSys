import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Link,
} from '@mui/material';
import {
  MedicalServices as DoctorIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { adminApi, apiClient } from '../../services/api';
import { DoctorVerification } from '../../types';

const Doctors: React.FC = () => {
  useAuthStore();
  
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<DoctorVerification[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorVerification | null>(null);
  const [doctorDetail, setDoctorDetail] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewImageName, setPreviewImageName] = useState<string>('');

  // 获取医生详情（包含证书文件信息）
  const fetchDoctorDetail = async (verificationId: string) => {
    try {
      setDetailLoading(true);
      const detail = await adminApi.getDoctorVerificationDetail(verificationId);
      setDoctorDetail(detail);
    } catch (error) {
      console.error('Failed to fetch doctor detail:', error);
      setSnackbar({
        open: true,
        message: '加载医生详情失败',
        severity: 'error',
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewLicenseDocument = async (docIndex: number) => {
    if (!selectedDoctor) {
      setSnackbar({
        open: true,
        message: '未选择医生',
        severity: 'warning',
      });
      return;
    }

    const document = doctorDetail?.license_document?.documents?.[docIndex];
    if (!document || !document.file_exists) {
      setSnackbar({
        open: true,
        message: '证书文件不存在',
        severity: 'warning',
      });
      return;
    }

    try {
      const response = await apiClient.get(`/admin/doctors/verifications/${selectedDoctor.id}/license-documents/${docIndex}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'image/jpeg' });
      const url = window.URL.createObjectURL(blob);
      setPreviewImageUrl(url);
      setPreviewImageName(document.filename);
      setImagePreviewOpen(true);
    } catch (error) {
      console.error('Failed to view license document:', error);
      setSnackbar({
        open: true,
        message: '查看证书文件失败',
        severity: 'error',
      });
    }
  };

  const handleCloseImagePreview = () => {
    setImagePreviewOpen(false);
    if (previewImageUrl) {
      window.URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl(null);
    }
  };

  // 获取医生认证列表
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDoctorVerifications(statusFilter);
      setDoctors(data.verifications || []);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      setSnackbar({
        open: true,
        message: '加载医生列表失败',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // 初始化加载
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // 批准医生认证
  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveDoctor(id);
      setSnackbar({
        open: true,
        message: '已通过认证',
        severity: 'success',
      });
      fetchDoctors();
    } catch (error) {
      setSnackbar({
        open: true,
        message: '操作失败: ' + (error as Error).message,
        severity: 'error',
      });
    }
  };

  // 拒绝医生认证
  const handleReject = async (id: string) => {
    try {
      await adminApi.rejectDoctor(id, '不符合认证要求');
      setSnackbar({
        open: true,
        message: '已拒绝认证',
        severity: 'success',
      });
      fetchDoctors();
    } catch (error) {
      setSnackbar({
        open: true,
        message: '操作失败: ' + (error as Error).message,
        severity: 'error',
      });
    }
  };

  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');
  const [doctorToRevoke, setDoctorToRevoke] = useState<DoctorVerification | null>(null);

  const handleOpenRevokeDialog = (doctor: DoctorVerification) => {
    setDoctorToRevoke(doctor);
    setRevokeReason('');
    setRevokeDialogOpen(true);
  };

  const handleCloseRevokeDialog = () => {
    setRevokeDialogOpen(false);
    setDoctorToRevoke(null);
    setRevokeReason('');
  };

  const handleRevoke = async () => {
    if (!doctorToRevoke) return;

    try {
      await adminApi.revokeDoctor(doctorToRevoke.id, revokeReason);
      setSnackbar({
        open: true,
        message: '已撤销医生认证',
        severity: 'success',
      });
      handleCloseRevokeDialog();
      fetchDoctors();
    } catch (error) {
      setSnackbar({
        open: true,
        message: '操作失败: ' + (error as Error).message,
        severity: 'error',
      });
    }
  };

  const [reapproveDialogOpen, setReapproveDialogOpen] = useState(false);
  const [doctorToReapprove, setDoctorToReapprove] = useState<DoctorVerification | null>(null);
  const [reapproveNotes, setReapproveNotes] = useState('');

  const handleOpenReapproveDialog = (doctor: DoctorVerification) => {
    setDoctorToReapprove(doctor);
    setReapproveNotes('');
    setReapproveDialogOpen(true);
  };

  const handleCloseReapproveDialog = () => {
    setReapproveDialogOpen(false);
    setDoctorToReapprove(null);
    setReapproveNotes('');
  };

  const handleReapprove = async () => {
    if (!doctorToReapprove) return;

    try {
      await adminApi.reapproveDoctor(doctorToReapprove.id, reapproveNotes);
      setSnackbar({
        open: true,
        message: '已重新认证医生',
        severity: 'success',
      });
      handleCloseReapproveDialog();
      fetchDoctors();
    } catch (error) {
      setSnackbar({
        open: true,
        message: '操作失败: ' + (error as Error).message,
        severity: 'error',
      });
    }
  };

  // 查看医生详情
  const handleViewDetails = async (doctor: DoctorVerification) => {
    setSelectedDoctor(doctor);
    setDetailDialogOpen(true);
    await fetchDoctorDetail(doctor.id);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: '待审核', color: 'warning' as const };
      case 'approved':
        return { label: '已通过', color: 'success' as const };
      case 'rejected':
        return { label: '已拒绝', color: 'error' as const };
      case 'revoked':
        return { label: '已撤销', color: 'error' as const };
      default:
        return { label: '未知', color: 'default' as const };
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#CC5500' }} />
      </Box>
    );
  }

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
              <div className="w-2 h-12" style={{ background: '#CC5500' }} />
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: '#171717',
                    letterSpacing: '-0.02em',
                  }}
                >
                  医生认证管理
                </Typography>
                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
                  DOCTOR VERIFICATION
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={fetchDoctors}
              sx={{
                border: '2px solid #CC5500',
                color: '#CC5500',
                '&:hover': {
                  background: '#FFF8F0',
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Container>
      </motion.div>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Box
            sx={{
              background: 'white',
              border: '2px solid #e5e5e5',
              p: 3,
              mb: 4,
              boxShadow: '6px 6px 0 rgba(0,0,0,0.05)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: '#171717',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <div className="w-1 h-6" style={{ background: '#CC5500' }} />
              筛选条件
            </Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel
                sx={{
                  color: '#737373',
                  fontWeight: 600,
                  '&.Mui-focused': { color: '#CC5500' },
                }}
              >
                状态筛选
              </InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="状态筛选"
                sx={{
                  borderRadius: 0,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e5e5',
                    borderWidth: 2,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#CC5500',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#CC5500',
                    borderWidth: 2,
                  },
                }}
              >
                <MenuItem value="">全部状态</MenuItem>
                <MenuItem value="pending">待审核</MenuItem>
                <MenuItem value="approved">已通过</MenuItem>
                <MenuItem value="rejected">已拒绝</MenuItem>
                <MenuItem value="revoked">已撤销</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </motion.div>

        {/* Doctor List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Box
            sx={{
              background: 'white',
              border: '2px solid #e5e5e5',
              boxShadow: '8px 8px 0 rgba(0,0,0,0.05)',
            }}
          >
            {doctors.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  border: '2px dashed #e5e5e5',
                  background: '#fafafa',
                  m: 3,
                }}
              >
                <DoctorIcon sx={{ fontSize: 48, color: '#d4d4d4', mb: 2 }} />
                <Typography variant="body1" sx={{ color: '#737373', fontWeight: 600 }}>
                  暂无认证申请
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        background: '#fafafa',
                        '& th': {
                          borderBottom: '2px solid #e5e5e5',
                          fontWeight: 800,
                          color: '#171717',
                          py: 2,
                        },
                      }}
                    >
                      <TableCell>医生信息</TableCell>
                      <TableCell>医院/科室</TableCell>
                      <TableCell>专业信息</TableCell>
                      <TableCell>执业证号</TableCell>
                      <TableCell>状态</TableCell>
                      <TableCell>提交时间</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctors.map((doctor) => {
                      const statusInfo = getStatusLabel(doctor.status);
                      return (
                        <TableRow
                          key={doctor.id}
                          sx={{
                            '&:hover': {
                              background: '#fafafa',
                            },
                            '& td': {
                              borderBottom: '1px solid #e5e5e5',
                              py: 2,
                            },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  background: '#FFF8F0',
                                  border: '2px solid #CC5500',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <DoctorIcon sx={{ color: '#CC5500', fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 700, color: '#171717' }}>
                                  {doctor.doctor_name || '未知'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
                                  ID: {doctor.id?.slice(0, 8) || '-'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#171717' }}>
                              {doctor.hospital || '-'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#737373' }}>
                              {doctor.department || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#171717' }}>
                              {doctor.title || '-'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#737373' }}>
                              {doctor.specialization || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#171717' }}>
                              {doctor.license_number || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                px: 2,
                                py: 0.5,
                                border: `2px solid ${
                                  statusInfo.color === 'success'
                                    ? '#00A86B'
                                    : statusInfo.color === 'warning'
                                    ? '#F59E0B'
                                    : '#DC2626'
                                }`,
                                background:
                                  statusInfo.color === 'success'
                                    ? '#F0FDF4'
                                    : statusInfo.color === 'warning'
                                    ? '#FEF3C7'
                                    : '#FEF2F2',
                                display: 'inline-block',
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 700,
                                  color:
                                    statusInfo.color === 'success'
                                      ? '#00A86B'
                                      : statusInfo.color === 'warning'
                                      ? '#F59E0B'
                                      : '#DC2626',
                                }}
                              >
                                {statusInfo.label}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
                              {new Date(doctor.created_at).toLocaleDateString('zh-CN')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Button
                                size="small"
                                onClick={() => handleViewDetails(doctor)}
                                sx={{
                                  color: '#0066FF',
                                  border: '2px solid #0066FF',
                                  textTransform: 'none',
                                  fontWeight: 700,
                                  minWidth: 'auto',
                                  px: 1.5,
                                  '&:hover': {
                                    background: '#EFF6FF',
                                  },
                                }}
                              >
                                <ViewIcon sx={{ fontSize: 16 }} />
                              </Button>
                              {doctor.status === 'pending' && (
                                <>
                                  <Button
                                    size="small"
                                    onClick={() => handleApprove(doctor.id)}
                                    sx={{
                                      color: '#00A86B',
                                      border: '2px solid #00A86B',
                                      textTransform: 'none',
                                      fontWeight: 700,
                                      minWidth: 'auto',
                                      px: 1.5,
                                      '&:hover': {
                                        background: '#F0FDF4',
                                      },
                                    }}
                                  >
                                    <CheckIcon sx={{ fontSize: 16 }} />
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={() => handleReject(doctor.id)}
                                    sx={{
                                      color: '#DC2626',
                                      border: '2px solid #DC2626',
                                      textTransform: 'none',
                                      fontWeight: 700,
                                      minWidth: 'auto',
                                      px: 1.5,
                                      '&:hover': {
                                        background: '#FEF2F2',
                                      },
                                    }}
                                  >
                                    <RejectIcon sx={{ fontSize: 16 }} />
                                  </Button>
                                </>
                              )}
                              {doctor.status === 'approved' && (
                                <Button
                                  size="small"
                                  onClick={() => handleOpenRevokeDialog(doctor)}
                                  sx={{
                                    color: '#F59E0B',
                                    border: '2px solid #F59E0B',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    px: 1.5,
                                    '&:hover': {
                                      background: '#FEF3C7',
                                    },
                                  }}
                                >
                                  撤销
                                </Button>
                              )}
                              {(doctor.status === 'revoked' || doctor.status === 'rejected') && (
                                <Button
                                  size="small"
                                  onClick={() => handleOpenReapproveDialog(doctor)}
                                  sx={{
                                    color: '#00A86B',
                                    border: '2px solid #00A86B',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    px: 1.5,
                                    '&:hover': {
                                      background: '#F0FDF4',
                                    },
                                  }}
                                >
                                  重新认证
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
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
      </Container>

      {/* 医生详情对话框 */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>医生认证详情</DialogTitle>
        <DialogContent>
          {selectedDoctor && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  基本信息
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    姓名
                  </Typography>
                  <Typography variant="body1">
                    {(selectedDoctor as any).full_name || selectedDoctor.user_id || '-'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    认证ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedDoctor.id || '-'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  专业信息
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    医院
                  </Typography>
                  <Typography variant="body1">
                    {selectedDoctor.hospital || '-'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    专业领域
                  </Typography>
                  <Typography variant="body1">
                    {selectedDoctor.specialty || '-'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    职称
                  </Typography>
                  <Typography variant="body1">
                    {(selectedDoctor as any).title || '-'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    专业
                  </Typography>
                  <Typography variant="body1">
                    {selectedDoctor.specialty || '-'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    执业证号
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {selectedDoctor.license_number || '-'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    从业年限
                  </Typography>
                  <Typography variant="body1">
                    {selectedDoctor.years_of_experience 
                      ? `${selectedDoctor.years_of_experience} 年`
                      : '-'
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    教育背景
                  </Typography>
                  <Typography variant="body1">
                    {selectedDoctor.education || '-'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    状态
                  </Typography>
                  <Chip
                    label={getStatusLabel(selectedDoctor.status).label}
                    color={getStatusLabel(selectedDoctor.status).color}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    提交时间
                  </Typography>
                  <Typography variant="body1">
                    {selectedDoctor.submitted_at
                      ? new Date(selectedDoctor.submitted_at).toLocaleString('zh-CN')
                      : '-'
                    }
                  </Typography>
                </Box>
              </Grid>

              {/* 执业证书 */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    执业证书
                  </Typography>
                  {detailLoading ? (
                    <CircularProgress size={20} />
                  ) : doctorDetail?.license_document?.has_document ? (
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        共 {doctorDetail.license_document.documents?.length || 0} 个文件
                      </Typography>
                      {doctorDetail.license_document.documents?.map((doc: any, index: number) => (
                        <Box key={index} sx={{ mb: 2, p: 1.5, bgcolor: 'white', borderRadius: 1 }}>
                          <Typography variant="body2" gutterBottom>
                            文件 {index + 1}: {doc.filename}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            上传时间: {doc.upload_date
                              ? new Date(doc.upload_date).toLocaleString('zh-CN')
                              : '-'
                            }
                          </Typography>
                          {doc.file_exists ? (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DocumentIcon />}
                              onClick={() => handleViewLicenseDocument(index)}
                              sx={{ mt: 0.5 }}
                            >
                              查看证书文件
                            </Button>
                          ) : (
                            <Typography variant="body2" color="error">
                              文件不存在
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      未上传执业证书
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>
            关闭
          </Button>
          {selectedDoctor?.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => {
                  handleApprove(selectedDoctor.id);
                  setDetailDialogOpen(false);
                }}
              >
                通过认证
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<RejectIcon />}
                onClick={() => {
                  handleReject(selectedDoctor.id);
                  setDetailDialogOpen(false);
                }}
              >
                拒绝认证
              </Button>
            </>
          )}
          {selectedDoctor?.status === 'approved' && (
            <Button
              variant="contained"
              color="warning"
              startIcon={<RejectIcon />}
              onClick={() => {
                handleOpenRevokeDialog(selectedDoctor);
                setDetailDialogOpen(false);
              }}
            >
              撤销认证
            </Button>
          )}
          {(selectedDoctor?.status === 'revoked' || selectedDoctor?.status === 'rejected') && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              onClick={() => {
                handleOpenReapproveDialog(selectedDoctor);
                setDetailDialogOpen(false);
              }}
            >
              重新认证
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={imagePreviewOpen}
        onClose={handleCloseImagePreview}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {previewImageName}
          <IconButton
            aria-label="close"
            onClick={handleCloseImagePreview}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <RejectIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          {previewImageUrl ? (
            <Box
              component="img"
              src={previewImageUrl}
              alt={previewImageName}
              sx={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImagePreview} variant="contained">
            关闭
          </Button>
          <Button
            onClick={() => {
              if (previewImageUrl) {
                const link = document.createElement('a');
                link.href = previewImageUrl;
                link.download = previewImageName;
                link.click();
              }
            }}
            variant="outlined"
            startIcon={<DocumentIcon />}
          >
            下载
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={revokeDialogOpen}
        onClose={handleCloseRevokeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>撤销医生认证</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            确定要撤销医生 <strong>{doctorToRevoke?.doctor_name}</strong> 的认证吗？
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            撤销后，该医生将无法登录医生平台，但其在平台上的所有历史留言和数据将被保留。
            您可以随时重新认证该医生以恢复其权限。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRevokeDialog} variant="outlined">
            取消
          </Button>
          <Button onClick={handleRevoke} variant="contained" color="warning">
            确认撤销
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={reapproveDialogOpen}
        onClose={handleCloseReapproveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>重新认证医生</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            确定要重新认证医生 <strong>{doctorToReapprove?.doctor_name}</strong> 吗？
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            重新认证后，该医生将恢复登录医生平台的权限，可以继续使用所有医生功能。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReapproveDialog} variant="outlined">
            取消
          </Button>
          <Button onClick={handleReapprove} variant="contained" color="success">
            确认重新认证
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Doctors;
