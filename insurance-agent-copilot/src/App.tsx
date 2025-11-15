import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import UniversalMicButton from './components/UniversalMicButton'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import LeadListPage from './pages/LeadListPage'
import LeadProfilePage from './pages/LeadProfilePage'
import TasksPage from './pages/TasksPage'
import NotificationsPage from './pages/NotificationsPage'
import AIAssistantPage from './pages/AIAssistantPage'

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <ThemeProvider>
      {isLoggedIn && <ThemeToggle />}
      {isLoggedIn && <UniversalMicButton />}
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/ai" element={
          <ProtectedRoute>
            <AIAssistantPage />
          </ProtectedRoute>
        } />
        <Route path="/leads" element={
          <ProtectedRoute>
            <LeadListPage />
          </ProtectedRoute>
        } />
        <Route path="/leads/:id" element={
          <ProtectedRoute>
            <LeadProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        
        {/* Redirect to login if not authenticated */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
