import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DialogModifyPrice from './DialogModifyPrice';
import { updateProduct, activateProduct, desactivateProduct } from '../services/prices';
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

describe('DialogModifyPrice Component', () => {
  const mockSetOpen = jest.fn();
  const mockSetDetailsNull = jest.fn();
  const mockModifyProduct = jest.fn();
  const mockActivate = jest.fn();
  const mockDesactivate = jest.fn();
  const mockLogout = jest.fn();
  
  const category = { id: 'c1', name: 'Bebidas' };
  const product = { id: 'p1', name: 'Refresco', price: 2, status: 'ACTIVE' };
  const categories = [{ id: 'c1', name: 'Bebidas' }, { id: 'c2', name: 'Snacks' }];
  const mockDolarContext = { dataContext: { localId: 1, token: 'mock-token' } };

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    sessionStorage.setItem('data', JSON.stringify({ tz: 'UTC' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderDialog = (prod = product) => {
    return render(
      <DolarContext.Provider value={mockDolarContext}>
        <DialogModifyPrice open={true} setOpen={mockSetOpen} category={category} product={prod} 
          setDetailsNull={mockSetDetailsNull} modifyProduct={mockModifyProduct} categories={categories} 
          activate={mockActivate} desactivate={mockDesactivate} />
      </DolarContext.Provider>
    );
  };

  it('permite modificar un producto', async () => {
    updateProduct.mockResolvedValue({ statusCode: 201, message: 'Modificado' });
    renderDialog();

    // Cambiamos el nombre
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Refresco 2L' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Actualizar/i }));

    await waitFor(() => {
      expect(updateProduct).toHaveBeenCalledWith('mock-token', expect.objectContaining({ name: 'Refresco 2L' }), 1);
      expect(mockModifyProduct).toHaveBeenCalled();
      expect(enqueueSnackbar).toHaveBeenCalledWith('Modificado', { variant: 'success' });
    });
  });

  it('permite desactivar producto', async () => {
    desactivateProduct.mockResolvedValue({ statusCode: 200 });
    renderDialog();

    fireEvent.click(screen.getByText('Desactivar producto'));

    await waitFor(() => {
      expect(desactivateProduct).toHaveBeenCalledWith('mock-token', 1, 'p1');
      expect(mockDesactivate).toHaveBeenCalledWith('p1');
      expect(enqueueSnackbar).toHaveBeenCalledWith('Producto desactivado', { variant: 'success' });
    });
  });

  it('permite activar producto', async () => {
    activateProduct.mockResolvedValue({ statusCode: 200 });
    renderDialog({ ...product, status: 'INACTIVE' });

    fireEvent.click(screen.getByText('Activar producto'));

    await waitFor(() => {
      expect(activateProduct).toHaveBeenCalledWith('mock-token', 1, 'p1');
      expect(mockActivate).toHaveBeenCalledWith('p1');
      expect(enqueueSnackbar).toHaveBeenCalledWith('Producto activado', { variant: 'success' });
    });
  });

  it('no actualiza si los valores son iguales', async () => {
    renderDialog();
    fireEvent.click(screen.getByRole('button', { name: /Actualizar/i }));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('No se ha modificado el producto', { variant: 'warning' });
      expect(updateProduct).not.toHaveBeenCalled();
    });
  });
});
