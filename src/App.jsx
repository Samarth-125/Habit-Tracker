import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='stats' element={<Stats />} />
          <Route path='settings' element={<Settings />} />
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App