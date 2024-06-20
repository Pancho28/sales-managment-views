import { Routes, Route } from 'react-router-dom';
import { NotFoundPage } from "../pages";
import { Sales, Totals, Accounting, Orders } from "../../sales/pages";
import { Prices } from "../../prices/pages";

// ----------------------------------------------------------------------

export default function MenuRoutes() {
    return (
    <Routes>
      <Route path="/" element={<Sales/>} />
      <Route path="/precios" element={<Prices/>} />
      <Route path="/orders" element={<Orders/>} />
      <Route path="/totales" element={<Totals/>} />
      <Route path="/cierre" element={<Accounting/>} />
      <Route path="*" element={<NotFoundPage/>} />
    </Routes>
    ); 
  }