import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUserResetPassword from './useUserResetPassword';
import { resetPassword } from '../services/admin';
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

describe('useUserResetPassword Hook', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    queryClient.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería resetear la clave y mostrar snackbar de éxito', async () => {
    resetPassword.mockResolvedValue({ statusCode: 201 });
    
    const { result } = renderHook(() => useUserResetPassword(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ 
        token: 'token', 
        user: { id: 1, username: 'juan' }, 
        password: 'newpassword' 
      });
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));
    expect(resetPassword).toHaveBeenCalledWith('token', 1, 'newpassword');
    expect(enqueueSnackbar).toHaveBeenCalledWith('Contraseña cambiada para el usuario juan', { variant: 'success' });
  });

  it('debería mostrar error si falla la actualización', async () => {
    resetPassword.mockResolvedValue({ statusCode: 400, message: 'Bad request' });
    
    const { result } = renderHook(() => useUserResetPassword(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ 
        token: 'token', 
        user: { id: 1, username: 'juan' }, 
        password: 'newpassword' 
      });
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));
    expect(enqueueSnackbar).toHaveBeenCalledWith('Bad request', { variant: 'error' });
  });
});
