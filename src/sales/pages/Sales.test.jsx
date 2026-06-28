import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sales from './Sales';
import { DolarContext } from '../../commons/components/Dashboard';
import useProducts from '../../commons/hooks/useProducts';
import useLogout from '../../commons/hooks/useLogout';
import { createOrder } from '../services/sales';
import { enqueueSnackbar } from 'notistack';

// Mocks
jest.mock('../../commons/hooks/useProducts');
jest.mock('../../commons/hooks/useLogout');
jest.mock('../services/sales');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));
jest.mock('../components', () => ({
  DialogPay: ({ completeOrder }) => (
    <button data-testid="dialog-pay-mock" onClick={() => completeOrder([{ paymentTypeId: '1', amount: 4, isPaid: true }], true)}>
      Completar orden mock
    </button>
  )
}));
jest.mock('moment-timezone', () => {
  const m = () => ({
    format: () => '2023-01-01T00:00:00Z',
    tz: () => ({ format: () => '2023-01-01T00:00:00Z' })
  });
  m.tz = () => ({ format: () => '2023-01-01T00:00:00Z' });
  return m;
});

describe('Sales Page', () => {
  const mockLogout = jest.fn();
  const mockDolarContext = { dataContext: { localId: 1, dolar: 40, token: 'mock-token' } };

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    useProducts.mockReturnValue({ 
      products: [
        { id: 'cat1', name: 'Bebidas', product: [{ id: 'p1', name: 'Refresco', price: 2, status: 'ACTIVE' }] }
      ], 
      paymentTypes: [], 
      accessToOrders: true 
    });
    sessionStorage.setItem('data', JSON.stringify({ tz: 'UTC' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  const renderSales = () => {
    return render(
      <DolarContext.Provider value={mockDolarContext}>
        <Sales />
      </DolarContext.Provider>
    );
  };

  it('renderiza la lista de productos vacía inicialmente', () => {
    renderSales();
    expect(screen.getByText('Sin pedidos aún')).toBeInTheDocument();
    expect(screen.getByText('Total compra')).toBeInTheDocument();
  });

  it('permite buscar productos, agregarlos y calcular el total', () => {
    renderSales();
    
    // Buscar
    fireEvent.change(screen.getByLabelText(/Buscar Producto/i), { target: { value: 'Refresco' } });
    
    // Abrir acordeon
    fireEvent.click(screen.getByText('Bebidas'));
    
    // Agregar producto
    const productCard = screen.getByText('Refresco');
    fireEvent.click(productCard);

    // Verificamos en el listado
    expect(screen.queryByText('Sin pedidos aún')).not.toBeInTheDocument();
    // 1 de cantidad, 2 de precio = total 2$
    expect(screen.getByText('2.00$')).toBeInTheDocument(); 
    expect(screen.getByText('80.00Bs')).toBeInTheDocument(); // 2$ * 40Bs
  });

  it('abre el diálogo de pago y envía la orden correctamente', async () => {
    createOrder.mockResolvedValue({ statusCode: 201, message: 'Orden creada' });
    renderSales();
    
    fireEvent.click(screen.getByText('Bebidas'));
    
    // Primer clic: Solo hay un 'Refresco' en la pantalla (el de la lista)
    fireEvent.click(screen.getByText('Refresco')); // Agrega Refresco (2$)
    
    // Segundo clic: Ahora hay dos 'Refresco' (carrito y lista). El de la lista es el último.
    const refrescos = screen.getAllByText('Refresco');
    fireEvent.click(refrescos[refrescos.length - 1]); // Agrega Refresco (4$ total)

    // Botón ordenar se habilita
    const orderBtn = screen.getByRole('button', { name: /Ordenar/i });
    expect(orderBtn).not.toBeDisabled();
    fireEvent.click(orderBtn);

    // Se muestra DialogPay mockeado
    const completeBtn = screen.getByTestId('dialog-pay-mock');
    fireEvent.click(completeBtn);

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalledWith('mock-token', expect.objectContaining({
        totalDl: 4,
        totalBs: 160,
        delivered: true,
        items: [{ quantity: 2, price: 2, productId: 'p1' }]
      }));
      expect(enqueueSnackbar).toHaveBeenCalledWith('Orden creada', { variant: 'success' });
      expect(screen.getByText('Sin pedidos aún')).toBeInTheDocument(); // Se resetea
    });
  });
});
