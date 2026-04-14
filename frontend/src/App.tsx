import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { zhCN } from 'date-fns/locale';
import { Box, CircularProgress } from '@mui/material';

import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import ErrorBoundary from './components/common/ErrorBoundary';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PlatformSelect from './pages/auth/PlatformSelect';
import DoctorLoginPage from './pages/auth/DoctorLoginPage';
import DoctorRegister from './pages/auth/DoctorRegister';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmail';

import PatientLayout from './components/layout/PatientLayout';
import PatientDashboard from './pages/patient/Dashboard';
import SymptomSubmit from './pages/patient/SymptomSubmit';
import MedicalRecords from './pages/patient/MedicalRecords';
import MedicalRecordDetail from './pages/patient/MedicalRecordDetail';
import PatientProfile from './pages/patient/Profile';
import CompleteProfile from './pages/patient/CompleteProfile';

import DoctorLayout from './components/layout/DoctorLayout';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorMentions from './pages/doctor/Mentions';
import DoctorCases from './pages/doctor/Cases';
import DoctorCaseDetail from './pages/doctor/CaseDetail';
import DoctorProfile from './pages/doctor/Profile';
import DoctorExport from './pages/doctor/Export';
import DoctorMessages from './pages/doctor/Messages';

import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDoctors from './pages/admin/Doctors';
import AdminKnowledgeBase from './pages/admin/KnowledgeBase';
import AdminAIModels from './pages/admin/AIModels';
import AdminLogs from './pages/admin/Logs';
import AdminMessages from './pages/admin/Messages';
import EmailConfig from './pages/admin/EmailConfig';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0066FF',
      light: '#3384FF',
      dark: '#0052CC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00C2FF',
      light: '#33CFFF',
      dark: '#009ACC',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFB020',
    },
    error: {
      main: '#FF3366',
    },
    success: {
      main: '#00D084',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0A0E27',
      secondary: '#4A5568',
      disabled: '#A0AEC0',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h2: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
    h3: { fontWeight: 600, letterSpacing: '0em', lineHeight: 1.4 },
    h4: { fontWeight: 600, letterSpacing: '0em' },
    h5: { fontWeight: 600, letterSpacing: '0em' },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0em' },
  },
  shape: { borderRadius: 2 },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundImage: 'none' } },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '2px solid #E2E8F0',
          boxShadow: 'none',
        },
        elevation0: { boxShadow: 'none' },
        elevation1: { boxShadow: 'none', border: '2px solid #E2E8F0' },
        elevation2: { boxShadow: 'none', border: '2px solid #CBD5E0' },
        elevation3: { boxShadow: 'none', border: '2px solid #0066FF' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          borderRight: '2px solid #E2E8F0',
          boxShadow: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #E2E8F0',
          boxShadow: 'none',
          color: '#0A0E27',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          cursor: 'pointer',
          boxShadow: 'none',
          border: '2px solid transparent',
          '&:hover': { boxShadow: 'none' },
          '&:active': { boxShadow: 'none' },
        },
        contained: {
          border: '2px solid #0052CC',
          '&:hover': { boxShadow: 'none', border: '2px solid #003D99' },
        },
        outlined: {
          border: '2px solid currentColor',
          '&:hover': { border: '2px solid currentColor' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: '#FFFFFF',
            '& fieldset': { borderColor: '#CBD5E0', borderWidth: 2 },
            '&:hover fieldset': { borderColor: '#718096', borderWidth: 2 },
            '&.Mui-focused fieldset': { borderColor: '#0066FF', borderWidth: 2 },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E0', borderWidth: 2 },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#718096' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0066FF', borderWidth: 2 },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '2px solid #E2E8F0',
          boxShadow: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          transition: 'background 0.15s',
          '&:hover': {
            backgroundColor: '#F0F4FF',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 4 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 4, fontWeight: 500 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E2E8F0',
          fontFamily: '"Inter", system-ui, sans-serif',
        },
        head: {
          fontWeight: 700,
          backgroundColor: '#F5F7FA',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#718096',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0A0E27',
          color: '#FFFFFF',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#E2E8F0' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: '#F5F7FA' },
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ allowedRoles?: string[] }> = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Modified for Android WebView: Don't redirect to platform select on role mismatch
  // This prevents the Android app from jumping to platform select page when
  // navigating between doctor pages like /doctor/cases
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Log the mismatch for debugging but allow the navigation to proceed
    // The API layer will enforce authorization, returning 403 if truly unauthorized
    console.warn('[ProtectedRoute] Role mismatch detected:', {
      userRole: user?.role,
      allowedRoles: allowedRoles,
      currentPath: window.location.pathname
    });
    // Return Outlet to render the requested page instead of redirecting to /
    return <Outlet />;
  }

  return <Outlet />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<PlatformSelect />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/doctor-login" element={<DoctorLoginPage />} />
                  <Route path="/doctor-register" element={<DoctorRegister />} />
                  <Route path="/admin-login" element={<AdminLoginPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  
                  <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                    <Route path="/patient" element={<PatientLayout />}>
                      <Route index element={<PatientDashboard />} />
                      <Route path="complete-profile" element={<CompleteProfile />} />
                      <Route path="symptom-submit" element={<SymptomSubmit />} />
                      <Route path="medical-records" element={<MedicalRecords />} />
                      <Route path="medical-records/:id" element={<MedicalRecordDetail />} />
                      <Route path="profile" element={<PatientProfile />} />
                    </Route>
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                    <Route path="/doctor" element={<DoctorLayout />}>
                      <Route index element={<DoctorDashboard />} />
                      <Route path="mentions" element={<DoctorMentions />} />
                      <Route path="cases" element={<DoctorCases />} />
                      <Route path="cases/:id" element={<DoctorCaseDetail />} />
                      <Route path="profile" element={<DoctorProfile />} />
                      <Route path="export" element={<DoctorExport />} />
                      <Route path="messages" element={<DoctorMessages />} />
                    </Route>
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="doctors" element={<AdminDoctors />} />
                      <Route path="knowledge-base" element={<AdminKnowledgeBase />} />
                      <Route path="ai-models" element={<AdminAIModels />} />
                      <Route path="messages" element={<AdminMessages />} />
                      <Route path="logs" element={<AdminLogs />} />
                      <Route path="email-config" element={<EmailConfig />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ErrorBoundary>
            </AuthProvider>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
