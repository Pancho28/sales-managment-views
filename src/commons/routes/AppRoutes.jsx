import LoginPage from '../../authorization/pages/LoginPage';
import { DashboardPage, NotFoundPage } from "../pages";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/menu/*" element={<DashboardPage/>} />
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </Router>
  ); 
}
