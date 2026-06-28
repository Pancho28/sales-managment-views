import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUserMutationStatus from './useUserMutationStatus';
import { activeUser, inactiveUser } from '../services/admin';
import useLogout from '../../commons/hooks/useLogout';
import { enqueueSnackbar } from 'notistack';
import { Status } from '../../commons/helpers/enum';

jest.mock('../services/admin');
jest.mock('../../commons/hooks/useLogout');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useUserMutationStatus Hook', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    queryClient.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería desactivar un usuario si está activo', async () => {
    inactiveUser.mockResolvedValue({ statusCode: 201, message: 'Desactivado' });
    queryClient.setQueryData(['users'], [{ id: 1, status: Status.ACTIVE }]);
    
    const { result } = renderHook(() => useUserMutationStatus(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ token: 'token', userId: 1, currentStatus: Status.ACTIVE });
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));
    expect(inactiveUser).toHaveBeenCalledWith('token', 1);
    
    const users = queryClient.getQueryData(['users']);
    expect(users[0].status).toEqual(Status.INACTIVE);
    expect(enqueueSnackbar).toHaveBeenCalledWith('Desactivado', { variant: 'success' });
  });

  it('debería activar un usuario si está inactivo', async () => {
    activeUser.mockResolvedValue({ statusCode: 201, message: 'Activado' });
    queryClient.setQueryData(['users'], [{ id: 1, status: Status.INACTIVE }]);
    
    const { result } = renderHook(() => useUserMutationStatus(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ token: 'token', userId: 1, currentStatus: Status.INACTIVE });
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));
    expect(activeUser).toHaveBeenCalledWith('token', 1);
    
    const users = queryClient.getQueryData(['users']);
    expect(users[0].status).toEqual(Status.ACTIVE);
  });
});
