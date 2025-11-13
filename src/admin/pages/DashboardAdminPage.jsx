import { Helmet } from 'react-helmet-async';

import { DashboardAdmin } from "../components";

// ----------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title> Administrator Dashboard | Sales Management </title>
      </Helmet>

      <DashboardAdmin />
    </>
  );
}
