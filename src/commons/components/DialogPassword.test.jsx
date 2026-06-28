import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DialogPassword from './DialogPassword';
import { enqueueSnackbar } from 'notistack';

jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));

describe('DialogPassword Component', () => {
  const mockSetOpen = jest.fn();
  const mockVerifyAccess = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderDialog = () => {
    return render(
      <DialogPassword open={true} setOpen={mockSetOpen} password="123" verifyAccess={mockVerifyAccess} />
    );
  };

  it('permite acceder con clave correcta', async () => {
    renderDialog();

    const input = screen.getByLabelText(/Clave de acceso/i);
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Acceder/i }));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Clave correcta', { variant: 'success' });
      expect(mockSetOpen).toHaveBeenCalledWith(false);
      expect(mockVerifyAccess).toHaveBeenCalledWith(true);
    });
  });

  it('muestra error con clave incorrecta', async () => {
    renderDialog();

    const input = screen.getByLabelText(/Clave de acceso/i);
    fireEvent.change(input, { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Acceder/i }));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Clave incorrecta', { variant: 'error' });
      expect(mockSetOpen).toHaveBeenCalledWith(false);
      expect(mockVerifyAccess).toHaveBeenCalledWith(false);
    });
  });

  it('permite mostrar y ocultar la contraseña', () => {
    renderDialog();
    
    const input = screen.getByLabelText(/Clave de acceso/i);
    expect(input).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: '' }); // The IconButton doesn't have an explicit aria-label but it's an IconButton inside endAdornment
    // Let's find it by icon
    // It's the only button other than Cancelar/Acceder
    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons[0]; 

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });
});
