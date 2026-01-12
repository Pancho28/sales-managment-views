import { Routes, Route } from 'react-router-dom';
import { NotFoundPage } from "../pages";
import { Users } from "../../admin/components/index.js";

// ----------------------------------------------------------------------

export default function AdminRoutes() {
    return (
    <Routes>
      <Route path="/" element={<Users/>} />
      <Route path="*" element={<NotFoundPage/>} />
    </Routes>
    ); 
  }