import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotDeliveredOrders from './NotDeliveredOrders';
import { getOrdersNotDelivered, deliverOrder } from '../services/sales';
import useLogout from '../../commons/hooks/useLogout';
import { enqueueSnackbar } from 'notistack';

// Mocks
jest.mock('../services/sales');
jest.mock('../../commons/hooks/useLogout');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));
jest.mock('moment-timezone', () => {
  const m = () => ({
    format: () => '12:00 pm',
    tz: () => ({ format: () => '2023-01-01' })
  });
  m.tz = () => ({ format: () => '2023-01-01' });
  return m;
});

describe('NotDeliveredOrders Page', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    sessionStorage.setItem('data', JSON.stringify({ accessToken: 'mock', tz: 'UTC' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('renderiza mensaje cuando no hay ordenes', async () => {
    getOrdersNotDelivered.mockResolvedValue({ statusCode: 200, orders: [] });
    render(<NotDeliveredOrders />);
    await waitFor(() => {
      expect(screen.getByText('Sin ordenes pendientes')).toBeInTheDocument();
    });
  });

  it('renderiza ordenes y permite entregarlas', async () => {
    getOrdersNotDelivered.mockResolvedValue({ 
      statusCode: 200, 
      orders: [
        { id: 1, creationDate: '2023', totalDl: 10, totalBs: 400, orderItem: [{ id: 1, quantity: 2, product: { name: 'Pizza' } }] }
      ] 
    });
    deliverOrder.mockResolvedValue({ statusCode: 201, message: 'Orden entregada' });

    render(<NotDeliveredOrders />);
    
    await waitFor(() => {
      expect(screen.getByText(/Ordenes pendientes: 1/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Orden pendiente desde/i));
    
    const deliverBtn = await screen.findByRole('button', { name: /Entregar pedido/i });
    fireEvent.click(deliverBtn);

    await waitFor(() => {
      expect(deliverOrder).toHaveBeenCalledWith('mock', 1, expect.any(Object));
      expect(enqueueSnackbar).toHaveBeenCalledWith('Orden entregada', { variant: 'success' });
    });
  });
});
