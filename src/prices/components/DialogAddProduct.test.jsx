import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DialogAddProduct from './DialogAddProduct';
import { createProduct } from '../services/prices';
import { DolarContext } from '../../commons/components/Dashboard';
import useLogout from '../../commons/hooks/useLogout';
import { enqueueSnackbar } from 'notistack';

// Mocks
jest.mock('../services/prices');
jest.mock('../../commons/hooks/useLogout');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));
jest.mock('moment-timezone', () => {
  return () => ({ tz: () => ({ format: () => '2023-01-01T00:00:00Z' }) });
});

describe('DialogAddProduct Component', () => {
  const mockSetOpen = jest.fn();
  const mockAddProduct = jest.fn();
  const mockLogout = jest.fn();
  const categories = [{ id: '1', name: 'Bebidas' }];
  const mockDolarContext = { dataContext: { localId: 1, token: 'mock-token' } };

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    sessionStorage.setItem('data', JSON.stringify({ tz: 'UTC' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  const renderDialog = () => {
    return render(
      <DolarContext.Provider value={mockDolarContext}>
        <DialogAddProduct open={true} setOpen={mockSetOpen} addProduct={mockAddProduct} categories={categories} />
      </DolarContext.Provider>
    );
  };

  it('permite crear un producto', async () => {
    createProduct.mockResolvedValue({ statusCode: 201, message: 'Creado', productId: 'p1' });
    renderDialog();

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Refresco' } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '5' } });
    
    // Select dropdown
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Bebidas'));

    fireEvent.click(screen.getByRole('button', { name: /Crear/i }));

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith('mock-token', expect.objectContaining({ name: 'Refresco', price: 5 }));
      expect(mockAddProduct).toHaveBeenCalledWith(expect.objectContaining({ name: 'Refresco' }));
      expect(enqueueSnackbar).toHaveBeenCalledWith('Creado', { variant: 'success' });
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  it('muestra error si el precio es negativo', async () => {
    renderDialog();

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Refresco' } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '-1' } });
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Bebidas'));

    fireEvent.click(screen.getByRole('button', { name: /Crear/i }));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('No se puede colocar precios menores a 0$', { variant: 'warning' });
      expect(createProduct).not.toHaveBeenCalled();
    });
  });

  it('llama logout en 401', async () => {
    createProduct.mockResolvedValue({ statusCode: 401 });
    renderDialog();

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Refresco' } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '5' } });
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Bebidas'));

    fireEvent.click(screen.getByRole('button', { name: /Crear/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
