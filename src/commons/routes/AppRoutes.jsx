import LoginPage from '../../auth/pages/LoginPage';
import Dashboard from "../../sales/components/Dashboard";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </Router>
  ); 
}
