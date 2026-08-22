import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SearchPage from './pages/SearchPage.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="boot">Loading SocialSphere...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useAuth();
  return <Routes><Route path="/login" element={user ? <Navigate to="/"/> : <AuthPage mode="login"/>}/><Route path="/register" element={user ? <Navigate to="/"/> : <AuthPage mode="register"/>}/><Route element={<Protected><AppShell/></Protected>}><Route index element={<HomePage/>}/><Route path="explore" element={<ExplorePage/>}/><Route path="search" element={<SearchPage/>}/><Route path="u/:username" element={<ProfilePage/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>;
}
