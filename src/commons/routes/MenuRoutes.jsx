import { Routes, Route } from 'react-router-dom';
import NotFoundPage from "../pages/NotFoundPage";
import  Sales from "../../sales/components/Sales";

// ----------------------------------------------------------------------

export default function MenuRoutes() {
    return (
    <Routes>
      <Route path="/" element={<Sales/>} />
      <Route path="/precios" element={<>precios</>} />
      <Route path="/totales" element={<>totales</>} />
      <Route path="/cierre" element={<>cierre</>} />
      <Route path="*" element={<NotFoundPage/>} />
    </Routes>
    ); 
  }