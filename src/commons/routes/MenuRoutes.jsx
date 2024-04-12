import { Routes, Route } from 'react-router-dom';
import NotFoundPage from "../pages/NotFoundPage";
import Sales from "../../sales/components/Sales";
import Prices from "../../prices/components/Prices";
import Totals from "../../sales/components/Totals";
import Accouting from '../../sales/components/Accounting';

// ----------------------------------------------------------------------

export default function MenuRoutes() {
    return (
    <Routes>
      <Route path="/" element={<Sales/>} />
      <Route path="/precios" element={<Prices/>} />
      <Route path="/totales" element={<Totals/>} />
      <Route path="/cierre" element={<Accouting/>} />
      <Route path="*" element={<NotFoundPage/>} />
    </Routes>
    ); 
  }