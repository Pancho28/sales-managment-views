import AppRoutes from "./commons/routes/AppRoutes";
import { TanStackProvider } from './pluggins/TanStackProvider.jsx';

function App() {
  return (
    <>
      <TanStackProvider>
        <AppRoutes/>
      </TanStackProvider>
    </>
  );
}

export default App;
