import { render, screen, waitFor } from '@testing-library/react';
import Accounting from './Accounting';
import { getSummaryByPaymentType } from '../services/sales';
import { DolarContext } from '../../commons/components/Dashboard';
import useLogout from '../../commons/hooks/useLogout';

// Mocks
jest.mock('../services/sales');
jest.mock('../../commons/hooks/useLogout');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));
jest.mock('moment-timezone', () => {
  return () => ({ tz: () => ({ format: () => '2023-01-01T00:00:00Z' }) });
});

describe('Accounting Page', () => {
  const mockLogout = jest.fn();
  const mockDolarContext = { dataContext: { dolar: 40 } };

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    sessionStorage.setItem('data', JSON.stringify({ accessToken: 'mock', local: { id: 1 }, tz: 'UTC' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('renderiza la tabla y calcula totales', async () => {
    getSummaryByPaymentType.mockResolvedValue({
      statusCode: 200,
      summary: [
        { name: 'Efectivo', currency: 'Dolares', total: '10' },
        { name: 'Punto de Venta', currency: 'Bolivares', total: '400' }
      ]
    });

    render(
      <DolarContext.Provider value={mockDolarContext}>
        <Accounting />
      </DolarContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Efectivo Dolares')).toBeInTheDocument();
      expect(screen.getByText('10$')).toBeInTheDocument();
      
      expect(screen.getByText('Punto de Venta Bolivares')).toBeInTheDocument();
      expect(screen.getByText('16000Bs')).toBeInTheDocument(); // 400 * 40
      
      // Totales
      expect(screen.getByText('10.00$')).toBeInTheDocument();
      expect(screen.getByText('16000.00Bs')).toBeInTheDocument();
    });
  });

  it('llama logout si status es 401', async () => {
    getSummaryByPaymentType.mockResolvedValue({ statusCode: 401 });

    render(
      <DolarContext.Provider value={mockDolarContext}>
        <Accounting />
      </DolarContext.Provider>
    );

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
