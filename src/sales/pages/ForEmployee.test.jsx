import { render, screen, waitFor } from '@testing-library/react';
import ForEmployee from './ForEmployee';
import { getSummaryForEmployee } from '../services/sales';
import useLogout from '../../commons/hooks/useLogout';

// Mocks
jest.mock('../services/sales');
jest.mock('../../commons/hooks/useLogout');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));
jest.mock('moment-timezone', () => {
  return () => ({ tz: () => ({ format: () => '2023-01-01T00:00:00Z' }) });
});

describe('ForEmployee Page', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    sessionStorage.setItem('data', JSON.stringify({ accessToken: 'mock', local: { id: 1 }, tz: 'UTC' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('renderiza la tabla de consumo por empleado', async () => {
    getSummaryForEmployee.mockResolvedValue({
      statusCode: 200,
      summary: [{ name: 'Hamburguesa', quantity: 2 }]
    });

    render(<ForEmployee />);

    await waitFor(() => {
      expect(screen.getByText('Hamburguesa')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('llama logout si status es 401', async () => {
    getSummaryForEmployee.mockResolvedValue({ statusCode: 401 });
    render(<ForEmployee />);
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
