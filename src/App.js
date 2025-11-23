import AppRoutes from "./commons/routes/AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: 1000 * 60 * 60 * 24 // 24 horas 
        }
    }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes/>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
