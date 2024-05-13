import { Helmet } from 'react-helmet-async';

import SignIn from '../components/SignIn';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | Sales Management </title>
      </Helmet>

      <SignIn />
    </>
  );
}
