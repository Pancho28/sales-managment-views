import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './SignIn';
import * as authService from '../services/authorization';
import { enqueueSnackbar } from 'notistack';

// Mock de servicios y librerías
jest.mock('../services/authorization');
jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const renderSignIn = () => {
  return render(
    <BrowserRouter>
      <SignIn />
    </BrowserRouter>
  );
};

describe('SignIn Component', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar el formulario correctamente', () => {
    renderSignIn();
    expect(screen.getByText(/Ingrese a Sales Management/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
  });

  it('debería mostrar errores de validación si los campos están vacíos', async () => {
    renderSignIn();
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));
    
    await waitFor(() => {
      expect(screen.getByText('El usuario es requerido')).toBeInTheDocument();
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument();
    });
  });

  it('debería llamar a login, navegar a /admin y mostrar snackbar en éxito si es ADMIN', async () => {
    authService.login.mockResolvedValue({
      statusCode: 200,
      data: { role: 'ADMIN', token: 'mock-token' },
      message: 'Success admin'
    });

    renderSignIn();

    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({ username: 'admin', password: 'password123' });
    });

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Ingresando...', { variant: 'success' });
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
    expect(JSON.parse(sessionStorage.getItem('data'))).toEqual({ role: 'ADMIN', token: 'mock-token' });
  });

  it('debería llamar a login y navegar a /menu si es SELLER', async () => {
    authService.login.mockResolvedValue({
      statusCode: 200,
      data: { role: 'SELLER', token: 'mock-token' },
      message: 'Success seller'
    });

    renderSignIn();

    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'seller' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/menu', { replace: true });
    });
  });

  it('debería mostrar snackbar de error si el login falla con estado distinto a 200', async () => {
    authService.login.mockResolvedValue({
      statusCode: 401,
      message: 'Invalid credentials'
    });

    renderSignIn();

    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Invalid credentials', { variant: 'error' });
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('debería mostrar snackbar de error de sistema si el fetch lanza excepción', async () => {
    authService.login.mockRejectedValue(new Error('Network error'));

    renderSignIn();

    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'erroruser' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'errorpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Usuario o contraseña incorrectos', { variant: 'error' });
    });
  });

  it('debería alternar la visibilidad de la contraseña', () => {
    renderSignIn();
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const toggleButton = screen.getByRole('button', { name: '' }); // El IconButton del ojo
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
