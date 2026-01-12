import LoginPage from '../../authorization/pages/LoginPage';
import { DashboardPage, NotFoundPage } from "../pages";
import DashboardAdminPage from '../../admin/pages/DashboardAdminPage.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function AppRoutes() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/menu/*" element={<DashboardPage/>} />
        <Route path="/admin/*" element={<DashboardAdminPage/>}/>
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </Router>
  ); 
}
