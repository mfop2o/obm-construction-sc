import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { AuthProvider, useAuth } from './lib/auth'
import { LanguageProvider } from './i18n'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/layout/ScrollToTop'
import AdminLayout from './components/admin/AdminLayout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Careers from './pages/Careers'
import OpeningDetail from './pages/OpeningDetail'
import Contact from './pages/Contact'
import RequestQuote from './pages/RequestQuote'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProjects from './pages/admin/AdminProjects'
import AdminProjectEditor from './pages/admin/AdminProjectEditor'
import AdminData from './pages/admin/AdminData'
import AdminContacts from './pages/admin/AdminContacts'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminContactInfo from './pages/admin/AdminContactInfo'
import AdminServices from './pages/admin/AdminServices'
import AdminCareers from './pages/admin/AdminCareers'
import AdminApplications from './pages/admin/AdminApplications'
import AdminHomeStats from './pages/admin/AdminHomeStats'
import AdminAbout from './pages/admin/AdminAbout'
import AdminSettings from './pages/admin/AdminSettings'

function RequireAuth() {
  const { loading, user } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-900" />
      </div>
    )
  }
  if (!user) return <Navigate to="/admin/login" replace />
  return <Outlet />
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:slug" element={<ProjectDetails />} />
              <Route path="about" element={<About />} />
              <Route path="careers" element={<Careers />} />
          <Route path="careers/:id" element={<OpeningDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="request-quote" element={<RequestQuote />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="admin/login" element={<AdminLogin />} />
            <Route element={<RequireAuth />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="projects/new" element={<AdminProjectEditor key="new" />} />
                <Route path="projects/:slug" element={<AdminProjectEditor key="edit" />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="contact-info" element={<AdminContactInfo />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="careers" element={<AdminCareers />} />
            <Route path="applications" element={<AdminApplications />} />
                <Route path="home-stats" element={<AdminHomeStats />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="data" element={<AdminData />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </LanguageProvider>
    </MotionConfig>
  )
}

export default App
