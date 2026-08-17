import { lazy, Suspense } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';

// Auth pages
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

// Public pages
const Home = lazy(() => import('@/pages/Home'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));

// App pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Wallet = lazy(() => import('@/pages/Wallet'));
const AssetDetail = lazy(() => import('@/pages/AssetDetail'));
const Markets = lazy(() => import('@/pages/Markets'));
const Buy = lazy(() => import('@/pages/Buy'));
const Sell = lazy(() => import('@/pages/Sell'));
const Send = lazy(() => import('@/pages/Send'));
const Receive = lazy(() => import('@/pages/Receive'));
const Deposit = lazy(() => import('@/pages/Deposit'));
const Withdraw = lazy(() => import('@/pages/Withdraw'));
const Transactions = lazy(() => import('@/pages/Transactions'));
const TransactionDetail = lazy(() => import('@/pages/TransactionDetail'));
const Payments = lazy(() => import('@/pages/Payments'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Statements = lazy(() => import('@/pages/Statements'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Support = lazy(() => import('@/pages/Support'));
const Security = lazy(() => import('@/pages/Security'));
const Settings = lazy(() => import('@/pages/Settings'));
const Profile = lazy(() => import('@/pages/Profile'));

const PageFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Onboarding (protected) */}
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>

        {/* App routes (protected, wrapped in layout) */}
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/wallet" element={<Wallet />} />
            <Route path="/app/wallet/:asset" element={<AssetDetail />} />
            <Route path="/app/markets" element={<Markets />} />
            <Route path="/app/buy" element={<Buy />} />
            <Route path="/app/sell" element={<Sell />} />
            <Route path="/app/send" element={<Send />} />
            <Route path="/app/receive" element={<Receive />} />
            <Route path="/app/deposit" element={<Deposit />} />
            <Route path="/app/withdraw" element={<Withdraw />} />
            <Route path="/app/transactions" element={<Transactions />} />
            <Route path="/app/transactions/:id" element={<TransactionDetail />} />
            <Route path="/app/payments" element={<Payments />} />
            <Route path="/app/portfolio" element={<Portfolio />} />
            <Route path="/app/analytics" element={<Analytics />} />
            <Route path="/app/statements" element={<Statements />} />
            <Route path="/app/notifications" element={<Notifications />} />
            <Route path="/app/support" element={<Support />} />
            <Route path="/app/security" element={<Security />} />
            <Route path="/app/settings" element={<Settings />} />
            <Route path="/app/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
