import { render, screen, waitFor } from '@testing-library/react';
import Totals from './Totals';
import { getSummaryByPrice } from '../services/sales';
import { DolarContext } from '../../commons/components/Dashboard';
import useLogout from '../../commons/hooks/useLogout';

// Mocks
jest.mock('../services/sales');
jest.mock('../../commons/hooks/useLogout');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));
jest.mock('moment-timezone', () => {
  return () => ({ tz: () => ({ format: () => '2023-01-01T00:00:00Z' }) });
});

describe('Totals Page', () => {
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
    getSummaryByPrice.mockResolvedValue({
      statusCode: 200,
      summary: [
        { name: 'Refresco', quantity: 2, price: 5 }
      ]
    });

    render(
      <DolarContext.Provider value={mockDolarContext}>
        <Totals />
      </DolarContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Refresco')).toBeInTheDocument();
      expect(screen.getByText('5$')).toBeInTheDocument();
      expect(screen.getAllByText('10.00$').length).toBeGreaterThan(0); // subtotal
      
      // Totales
      expect(screen.getByText('400.00 Bs')).toBeInTheDocument(); // Total bolivares (10*40)
    });
  });

  it('llama logout si status es 401', async () => {
    getSummaryByPrice.mockResolvedValue({ statusCode: 401 });

    render(
      <DolarContext.Provider value={mockDolarContext}>
        <Totals />
      </DolarContext.Provider>
    );

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
