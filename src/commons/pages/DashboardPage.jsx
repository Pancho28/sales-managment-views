import { Helmet } from 'react-helmet-async';

import Dashboard from "../components/Dashboard";

// ----------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Sales Management </title>
      </Helmet>

      <Dashboard />
    </>
  );
}
