import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUserMutationModify from './useUserMutationModify';
import { modifyUser } from '../services/admin';
import useLogout from '../../commons/hooks/useLogout';
import { enqueueSnackbar } from 'notistack';

jest.mock('../services/admin');
jest.mock('../../commons/hooks/useLogout');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useUserMutationModify Hook', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    sessionStorage.setItem('data', JSON.stringify({ accessToken: 'mock-token' }));
    queryClient.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('debería modificar, actualizar queryData y mostrar snackbar en success', async () => {
    const modifiedUser = { 
        id: 1, email: 'juan@test.com', username: 'juan_mod', tz: 'UTC', local: { name: 'A', dolar: 1 }
    };
    modifyUser.mockResolvedValue({ statusCode: 200, user: modifiedUser, message: 'User updated' });
    
    // Lista inicial
    queryClient.setQueryData(['users'], [{ id: 1, email: 'old', username: 'old', tz: 'local', local: [{name:'', dolar:0}] }]);
    
    const { result } = renderHook(() => useUserMutationModify(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ userId: 1, name: 'Juan' });
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(modifyUser).toHaveBeenCalledWith('mock-token', 1, { name: 'Juan' });
    const users = queryClient.getQueryData(['users']);
    expect(users[0].username).toEqual('juan_mod');
    expect(enqueueSnackbar).toHaveBeenCalledWith('User updated', { variant: 'success' });
  });

  it('debería llamar a logout si el status es 401', async () => {
    modifyUser.mockResolvedValue({ statusCode: 401 });
    const { result } = renderHook(() => useUserMutationModify(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ userId: 1 });
    });

    await waitFor(() => expect(mockLogout).toHaveBeenCalled());
  });

  it('debería mostrar error si falla (statusCode != 200 y 401)', async () => {
    modifyUser.mockResolvedValue({ statusCode: 500, message: 'Server error modify' });
    const { result } = renderHook(() => useUserMutationModify(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ userId: 1 });
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));
    expect(enqueueSnackbar).toHaveBeenCalledWith('Server error modify', { variant: 'error' });
  });
});
