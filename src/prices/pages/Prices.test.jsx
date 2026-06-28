import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Prices from './Prices';
import useProducts from '../../commons/hooks/useProducts';
import useLogout from '../../commons/hooks/useLogout';

// Mocks
jest.mock('../../commons/hooks/useProducts');
jest.mock('../../commons/hooks/useLogout');

describe('Prices Page', () => {
  const mockAddProduct = jest.fn();
  const mockModifyProduct = jest.fn();
  const mockActivateProduct = jest.fn();
  const mockDesactivateProduct = jest.fn();

  beforeEach(() => {
    useProducts.mockReturnValue({
      products: [
        { 
          id: 'c1', name: 'Bebidas', 
          product: [
            { id: 'p1', name: 'Refresco', price: 2, status: 'ACTIVE', creationDate: '2023-01-01' }
          ] 
        }
      ],
      categories: [{ id: 'c1', name: 'Bebidas' }],
      addProduct: mockAddProduct,
      modifyProduct: mockModifyProduct,
      activateProduct: mockActivateProduct,
      desactivateProduct: mockDesactivateProduct
    });
    useLogout.mockReturnValue({ logout: jest.fn() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza la lista de productos y permite buscar', () => {
    render(<Prices />);
    expect(screen.getByText('Refresco')).toBeInTheDocument();
    
    // Buscar algo que no existe
    fireEvent.change(screen.getByLabelText(/Buscar producto/i), { target: { value: 'Pizza' } });
    expect(screen.queryByText('Refresco')).not.toBeInTheDocument();
    expect(screen.getByText(/No se encontraron productos que coincidan con/i)).toBeInTheDocument();
    
    // Limpiar busqueda buscando un boton por test id si hubiera, 
    // pero como no hay un role unico fácil, simplemente borramos el input:
    fireEvent.change(screen.getByLabelText(/Buscar producto/i), { target: { value: '' } });
    expect(screen.getByText('Refresco')).toBeInTheDocument();
  });

  it('abre los dialogos de agregar y modificar', async () => {
    render(<Prices />);

    // Abrir agregar
    fireEvent.click(screen.getByRole('button', { name: /Agregar producto/i }));
    expect(screen.getByText('Datos del producto')).toBeInTheDocument();
    
    const cancelBtn = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelBtn); // cierra DialogAdd

    await waitFor(() => {
      expect(screen.queryByText('Datos del producto')).not.toBeInTheDocument();
    });

    // Abrir modificar
    fireEvent.click(screen.getByText('Refresco'));
    expect(screen.getByText('Datos del producto')).toBeInTheDocument();
    
    // El TextField con el nombre del producto deberia tener 'Refresco'
    expect(screen.getByDisplayValue('Refresco')).toBeInTheDocument();
  });
});
