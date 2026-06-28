import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DialogDolar from './DialogDolar';
import { updateDolar } from '../services/commons';
import useLogout from '../hooks/useLogout';
import { enqueueSnackbar } from 'notistack';

jest.mock('../services/commons');
jest.mock('../hooks/useLogout');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));

describe('DialogDolar Component', () => {
  const mockSetOpen = jest.fn();
  const mockSetDolar = jest.fn();
  const mockLogout = jest.fn();
  const dataContext = { localId: 1, token: 'token', dolar: 5 };

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderDialog = () => {
    return render(
      <DialogDolar open={true} setOpen={mockSetOpen} dataContext={dataContext} setDolar={mockSetDolar} />
    );
  };

  it('permite cambiar el dolar', async () => {
    updateDolar.mockResolvedValue({ statusCode: 201, message: 'Dolar actualizado' });
    renderDialog();

    const input = screen.getByLabelText(/Cambio del dolar/i);
    fireEvent.change(input, { target: { value: '6.5' } });
    fireEvent.click(screen.getByRole('button', { name: /Cambiar/i }));

    await waitFor(() => {
      expect(updateDolar).toHaveBeenCalledWith(1, '6.50', 'token');
      expect(mockSetDolar).toHaveBeenCalledWith('6.50');
      expect(mockSetOpen).toHaveBeenCalledWith(false);
      expect(enqueueSnackbar).toHaveBeenCalledWith('Dolar actualizado', { variant: 'success' });
    });
  });

  it('muestra advertencia si el dolar es igual', async () => {
    renderDialog();

    fireEvent.click(screen.getByRole('button', { name: /Cambiar/i }));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('No se ha modificado el valor del cambio', { variant: 'warning' });
    });
  });

  it('muestra advertencia si el dolar es negativo', async () => {
    renderDialog();

    const input = screen.getByLabelText(/Cambio del dolar/i);
    fireEvent.change(input, { target: { value: '-1' } });
    fireEvent.click(screen.getByRole('button', { name: /Cambiar/i }));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('No se puede colocar el cambio menor a 0$', { variant: 'warning' });
    });
  });

  it('cierra sesion en 401', async () => {
    updateDolar.mockResolvedValue({ statusCode: 401 });
    renderDialog();

    const input = screen.getByLabelText(/Cambio del dolar/i);
    fireEvent.change(input, { target: { value: '6.5' } });
    fireEvent.click(screen.getByRole('button', { name: /Cambiar/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
