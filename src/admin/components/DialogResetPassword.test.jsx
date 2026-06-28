import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DialogResetPassword from './DialogResetPassword';
import { useUserResetPassword } from '../hooks';

jest.mock('../hooks');

describe('DialogResetPassword Component', () => {
  const mockMutate = jest.fn();
  const mockSetOpen = jest.fn();
  
  const mockUser = { id: 1, username: 'juan' };

  beforeEach(() => {
    useUserResetPassword.mockReturnValue({ mutation: { mutate: mockMutate, isSubmitting: false } });
    sessionStorage.setItem('data', JSON.stringify({ accessToken: 'mock-token' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('debería mostrar el nombre del usuario en el título', () => {
    render(<DialogResetPassword open={true} setOpen={mockSetOpen} user={mockUser} />);
    expect(screen.getByText('Reestablecer clave para el usuario juan')).toBeInTheDocument();
  });

  it('no debería mutar si el campo está vacío', async () => {
    render(<DialogResetPassword open={true} setOpen={mockSetOpen} user={mockUser} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Actualizar/i }));
    
    await waitFor(() => {
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('debería mutar con la nueva contraseña', async () => {
    render(<DialogResetPassword open={true} setOpen={mockSetOpen} user={mockUser} />);
    
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /Actualizar/i }));
    
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        password: 'newpassword123',
        user: mockUser,
        token: 'mock-token'
      });
    });
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
