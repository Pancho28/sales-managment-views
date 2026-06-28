import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DialogAddUser from './DialogAddUser';
import { useUserMutationAdd } from '../hooks';

// Mocks
jest.mock('../hooks');
jest.mock('moment-timezone', () => {
  return () => ({ tz: () => ({ format: () => '2023-01-01T00:00:00Z' }) });
});

describe('DialogAddUser Component', () => {
  const mockMutate = jest.fn();
  const mockSetOpen = jest.fn();

  beforeEach(() => {
    useUserMutationAdd.mockReturnValue({ mutation: { mutate: mockMutate, isSubmitting: false } });
    sessionStorage.setItem('data', JSON.stringify({ accessToken: 'mock-token', tz: 'UTC' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('debería renderizar los campos del formulario', () => {
    render(<DialogAddUser open={true} setOpen={mockSetOpen} />);
    expect(screen.getByText('Datos del usuario')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre del usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre del local/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Precio del dolar/i)).toBeInTheDocument();
  });

  it('no debería enviar si los campos requeridos están vacíos', async () => {
    render(<DialogAddUser open={true} setOpen={mockSetOpen} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Crear/i }));
    
    await waitFor(() => {
      expect(screen.getByText('El nombre del usuario es requerido')).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('debería cerrar el modal al presionar Cancelar', () => {
    render(<DialogAddUser open={true} setOpen={mockSetOpen} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
