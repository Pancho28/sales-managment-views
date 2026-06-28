import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Unpaid from './Unpaid';
import { getUnpaidOrders, paidOrder } from '../services/sales';
import useLogout from '../../commons/hooks/useLogout';
import useProducts from '../../commons/hooks/useProducts';
import { enqueueSnackbar } from 'notistack';

// Mocks
jest.mock('../services/sales');
jest.mock('../../commons/hooks/useLogout');
jest.mock('../../commons/hooks/useProducts');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));
jest.mock('../components', () => ({
  DialogPay: ({ completeOrder }) => (
    <button data-testid="dialog-pay-mock" onClick={() => completeOrder([{ paymentTypeId: '1', amount: 10, isPaid: true }])}>
      Completar pago
    </button>
  )
}));
jest.mock('moment-timezone', () => {
  const m = () => ({
    format: () => '01/01/2023 12:00 pm',
    tz: () => ({ format: () => '2023-01-01' })
  });
  m.tz = () => ({ format: () => '2023-01-01' });
  return m;
});

describe('Unpaid Page', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    useProducts.mockReturnValue({ paymentTypes: [] });
    sessionStorage.setItem('data', JSON.stringify({ accessToken: 'mock', tz: 'UTC' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('renderiza mensaje cuando no hay ordenes por cobrar', async () => {
    getUnpaidOrders.mockResolvedValue({ statusCode: 200, orders: [] });
    render(<Unpaid />);
    await waitFor(() => {
      expect(screen.getByText('Sin ordenes por cobrar')).toBeInTheDocument();
    });
  });

  it('renderiza ordenes y permite pagarlas', async () => {
    getUnpaidOrders.mockResolvedValue({ 
      statusCode: 200, 
      orders: [
        { 
          id: 1, creationDate: '2023', totalDl: 10, totalBs: 400, 
          orderItem: [{ id: 1, quantity: 2, product: { name: 'Pizza' } }],
          paymentOrder: [{ customerInformation: [{ name: 'Juan', lastName: 'Perez' }] }]
        }
      ] 
    });
    paidOrder.mockResolvedValue({ statusCode: 201 });

    render(<Unpaid />);
    
    await waitFor(() => {
      expect(screen.getByText('Juan Perez')).toBeInTheDocument();
      expect(screen.getByText('1 orden(es) no pagadas, 10$ por cobrar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Orden pendiente de pago desde/i));
    
    const payBtn = await screen.findByRole('button', { name: /Pagar pedido/i });
    fireEvent.click(payBtn);

    const dialogBtn = screen.getByTestId('dialog-pay-mock');
    fireEvent.click(dialogBtn);

    await waitFor(() => {
      expect(paidOrder).toHaveBeenCalledWith('mock', 1, expect.any(Object));
      expect(enqueueSnackbar).toHaveBeenCalledWith('Orden pagada con éxito', { variant: 'success' });
    });
  });
});
