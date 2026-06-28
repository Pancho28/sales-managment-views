import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAccessUser from './useAccessUser';
import { getAccess } from '../../admin/services/admin';
import useLogout from '../../commons/hooks/useLogout';
import { enqueueSnackbar } from 'notistack';

jest.mock('../../admin/services/admin');
jest.mock('../../commons/hooks/useLogout');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useAccessUser Hook', () => {
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

  it('debería retornar isLoading true inicialmente y luego los datos de accessos', async () => {
    getAccess.mockResolvedValue({ statusCode: 200, accesses: [{ id: 1, name: 'Admin' }] });
    const { result } = renderHook(() => useAccessUser(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([{ id: 1, name: 'Admin' }]);
  });
});
