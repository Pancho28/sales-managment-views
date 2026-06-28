import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DialogModifyUser from './DialogModifyUser';
import { useUserMutationModify } from '../hooks';
import { enqueueSnackbar } from 'notistack';

// Mocks
jest.mock('../hooks');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));

describe('DialogModifyUser Component', () => {
  const mockMutate = jest.fn();
  const mockSetOpen = jest.fn();
  
  const mockUser = {
    id: 1,
    username: 'juan',
    email: 'juan@test.com',
    tz: 'UTC',
    local: [{ name: 'Sucursal A', dolar: '40' }]
  };

  beforeEach(() => {
    useUserMutationModify.mockReturnValue({ mutation: { mutate: mockMutate, isSubmitting: false } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería cargar los datos iniciales del usuario', () => {
    render(<DialogModifyUser open={true} setOpen={mockSetOpen} user={mockUser} />);
    expect(screen.getByLabelText(/Nombre del usuario/i)).toHaveValue('juan');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('juan@test.com');
    expect(screen.getByLabelText(/Nombre del local/i)).toHaveValue('Sucursal A');
    expect(screen.getByLabelText(/Precio del dolar/i)).toHaveValue(40);
  });

  it('debería mostrar un warning si se intenta guardar sin cambios', async () => {
    render(<DialogModifyUser open={true} setOpen={mockSetOpen} user={mockUser} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Actualizar/i }));
    
    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('No se realizaron cambios en el usuario', { variant: 'warning' });
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('debería mutar si hay cambios', async () => {
    render(<DialogModifyUser open={true} setOpen={mockSetOpen} user={mockUser} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'juan2@test.com' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Actualizar/i }));
    
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
