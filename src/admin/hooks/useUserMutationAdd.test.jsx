import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUserMutationAdd from './useUserMutationAdd';
import { createUser } from '../services/admin';
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

describe('useUserMutationAdd Hook', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    queryClient.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería mutar correctamente, actualizar queryData y mostrar snackbar en success', async () => {
    const newUser = { id: 1, name: 'Juan' };
    createUser.mockResolvedValue({ statusCode: 201, user: newUser });
    
    queryClient.setQueryData(['users'], []); // inicializar lista vacía
    
    const { result } = renderHook(() => useUserMutationAdd(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ token: '123', name: 'Juan' });
    });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));

    expect(createUser).toHaveBeenCalledWith('123', { name: 'Juan' });
    expect(queryClient.getQueryData(['users'])).toEqual([newUser]);
    expect(enqueueSnackbar).toHaveBeenCalledWith('Usuario creado con éxito', { variant: 'success' });
  });

  it('debería llamar a logout si el status es 401', async () => {
    createUser.mockResolvedValue({ statusCode: 401 });
    const { result } = renderHook(() => useUserMutationAdd(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ token: '123' });
    });

    await waitFor(() => expect(mockLogout).toHaveBeenCalled());
  });

  it('debería lanzar error si la creación falla', async () => {
    createUser.mockResolvedValue({ statusCode: 400, message: 'Invalid data' });
    const { result } = renderHook(() => useUserMutationAdd(), { wrapper });

    act(() => {
      result.current.mutation.mutate({ token: '123' });
    });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));
    expect(enqueueSnackbar).toHaveBeenCalledWith('Invalid data', { variant: 'error' });
  });
});
