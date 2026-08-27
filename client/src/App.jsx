import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ConnectionsPage from './pages/ConnectionsPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import HomePage from './pages/HomePage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import PostPage from './pages/PostPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SavedPage from './pages/SavedPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="boot"><span className="boot-logo">S</span><strong>Loading SocialSphere...</strong></div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/" replace/> : <AuthPage mode="login"/>}/>
    <Route path="/register" element={user ? <Navigate to="/" replace/> : <AuthPage mode="register"/>}/>
    <Route element={<Protected><AppShell/></Protected>}>
      <Route index element={<HomePage/>}/>
      <Route path="explore" element={<ExplorePage/>}/>
      <Route path="search" element={<SearchPage/>}/>
      <Route path="saved" element={<SavedPage/>}/>
      <Route path="notifications" element={<NotificationsPage/>}/>
      <Route path="settings" element={<SettingsPage/>}/>
      <Route path="post/:postId" element={<PostPage/>}/>
      <Route path="u/:username/connections/:type" element={<ConnectionsPage/>}/>
      <Route path="u/:username/:type" element={<ConnectionsPage/>}/>
      <Route path="u/:username" element={<ProfilePage/>}/>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
