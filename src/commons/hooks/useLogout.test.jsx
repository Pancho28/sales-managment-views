import { renderHook, act } from '@testing-library/react';
import useLogout from './useLogout';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));

describe('useLogout hook', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    sessionStorage.setItem('data', 'some-data');
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('limpia sessionStorage y navega a inicio controladamente', () => {
    const { result } = renderHook(() => useLogout());
    act(() => {
      result.current.logout(1);
    });

    expect(sessionStorage.getItem('data')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    expect(enqueueSnackbar).toHaveBeenCalledWith('Sesión cerrada', { variant: 'success' });
  });

  it('hace logout por error de auth (no controlado)', () => {
    const { result } = renderHook(() => useLogout());
    act(() => {
      result.current.logout();
    });

    expect(sessionStorage.getItem('data')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    expect(enqueueSnackbar).toHaveBeenCalledWith('Vuelva a iniciar sesión', { variant: 'warning' });
  });
});
