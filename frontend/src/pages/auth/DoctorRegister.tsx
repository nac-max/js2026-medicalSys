import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack,
  Phone,
  Person,
  Business,
  MedicalServices,
  School,
  Upload,
  Delete,
  LocalHospital,
  HealthAndSafety,
  Favorite,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../../services/api';
import { BackgroundBeams } from '../../components/ui/background-beams';

interface DoctorRegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  license_number: string;
  hospital: string;
  department: string;
  title: string;
  specialty: string;
  terms: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024

const DoctorRegister: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [licenseFiles, setLicenseFiles] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorRegisterData>({
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
      phone: '',
      license_number: '',
      hospital: '',
      department: '',
      title: '',
      specialty: '',
      terms: false,
    },
  });

  useEffect(() => {
    setError(null);
  }, []);

  const clearError = () => setError(null);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToPlatformSelect = () => {
    navigate('/platform-select');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);

      const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        setError(`以下文件超过10MB限制: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }

      setLicenseFiles(prev => [...prev, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setLicenseFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: DoctorRegisterData) => {
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      if (licenseFiles.length === 0) {
        setError('请上传执业证书文件');
        setIsSubmitting(false);
        setIsLoading(false);
        return;
      }

      const registerData = {
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        phone: data.phone,
        title: data.title,
        department: data.department,
        hospital: data.hospital,
        license_number: data.license_number,
        specialty: data.specialty,
        professional_type: data.specialty,
      };

      await authApi.registerDoctor(registerData, licenseFiles);

      navigate('/doctor-login');
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

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
          PHYSICIAN REGISTRATION
        </div>
      </motion.header>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10, py: 4 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
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
              onClick={() => navigate('/doctor-login')}
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
              返回登录
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
                    医生认证申请
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#737373', fontWeight: 600 }}>
                    PHYSICIAN CERTIFICATION
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
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="full_name"
                    control={control}
                    rules={{ required: '请输入姓名' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="姓名"
                        error={!!errors.full_name}
                        helperText={errors.full_name?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: '#00A86B' }} />
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
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: '请输入邮箱',
                      pattern: { value: /^\S+@\S+$/i, message: '邮箱格式不正确' },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="邮箱"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
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
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: '请输入密码',
                      minLength: { value: 6, message: '密码至少6位' },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="密码"
                        type={showPassword ? 'text' : 'password'}
                        error={!!errors.password}
                        helperText={errors.password?.message}
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
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="手机号"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone sx={{ color: '#00A86B' }} />
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
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="license_number"
                    control={control}
                    rules={{ required: '请输入执业证书编号' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="执业证书编号"
                        error={!!errors.license_number}
                        helperText={errors.license_number?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <School sx={{ color: '#00A86B' }} />
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
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="hospital"
                    control={control}
                    rules={{ required: '请输入所属医院' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="所属医院"
                        error={!!errors.hospital}
                        helperText={errors.hospital?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Business sx={{ color: '#00A86B' }} />
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
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="department"
                    control={control}
                    rules={{ required: '请输入科室' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="科室"
                        error={!!errors.department}
                        helperText={errors.department?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalHospital sx={{ color: '#00A86B' }} />
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
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: '请输入职称' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="职称"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MedicalServices sx={{ color: '#00A86B' }} />
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
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="specialty"
                    control={control}
                    rules={{ required: '请输入专业领域' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="专业领域"
                        error={!!errors.specialty}
                        helperText={errors.specialty?.message}
                        placeholder="例如：心血管内科、神经外科等"
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
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ border: '2px solid #e5e5e5', borderRadius: 0, boxShadow: 'none' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: '#171717' }}>
                        上传执业证书
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: '#737373' }}>
                        请上传您的执业医师证书、资格证书等相关文件（支持 PDF、JPG、PNG 格式，单个文件不超过 10MB）
                      </Typography>

                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<Upload />}
                        sx={{
                          mb: 2,
                          color: '#00A86B',
                          borderColor: '#00A86B',
                          borderWidth: 2,
                          borderRadius: 0,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#00A86B',
                            borderWidth: 2,
                            background: '#F0FDF4',
                          },
                        }}
                      >
                        选择文件
                        <input
                          type="file"
                          hidden
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </Button>

                      {licenseFiles.length > 0 && (
                        <List sx={{ border: '2px solid #e5e5e5', borderRadius: 0 }}>
                          {licenseFiles.map((file, index) => (
                            <ListItem
                              key={index}
                              secondaryAction={
                                <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                                  <Delete sx={{ color: '#DC2626' }} />
                                </IconButton>
                              }
                            >
                              <ListItemText
                                primary={file.name}
                                secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                primaryTypographyProps={{ fontWeight: 600, color: '#171717' }}
                                secondaryTypographyProps={{ color: '#737373' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting || isLoading}
                sx={{
                  mt: 3,
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
                {isSubmitting || isLoading ? (
                  <CircularProgress size={24} sx={{ color: '#00A86B' }} />
                ) : (
                  '提交认证申请'
                )}
              </Button>

              <Divider sx={{ my: 2, borderColor: '#e5e5e5' }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#737373' }}>
                  已有医生账号？{' '}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate('/doctor-login')}
                    sx={{
                      color: '#00A86B',
                      textDecoration: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    立即登录
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

export default DoctorRegister;
