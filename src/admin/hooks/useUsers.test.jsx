import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUsers from './useUsers';
import { getUsers } from '../../admin/services/admin';
import useLogout from '../../commons/hooks/useLogout';
import { enqueueSnackbar } from 'notistack';

// Mocks
jest.mock('../../admin/services/admin');
jest.mock('../../commons/hooks/useLogout');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useUsers Hook', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    sessionStorage.setItem('data', JSON.stringify({ accessToken: 'test-token' }));
    queryClient.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('debería retornar isLoading true inicialmente y luego los datos', async () => {
    getUsers.mockResolvedValue({ statusCode: 200, users: [{ id: 1, username: 'admin' }] });
    const { result } = renderHook(() => useUsers(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([{ id: 1, username: 'admin' }]);
  });

  it('debería llamar a logout si el status de la respuesta es 401', async () => {
    getUsers.mockResolvedValue({ statusCode: 401 });
    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('debería mostrar un snackbar de error si ocurre otro código distinto de 200 y 401', async () => {
    getUsers.mockResolvedValue({ statusCode: 500, message: 'Server Error' });
    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(enqueueSnackbar).toHaveBeenCalledWith('Server Error', { variant: 'error' });
  });
});
