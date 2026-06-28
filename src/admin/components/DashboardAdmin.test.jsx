import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardAdmin from './DashboardAdmin';
import useLogout from '../../commons/hooks/useLogout';

// Mocks
jest.mock('../../commons/hooks/useLogout');
jest.mock('./ListItemsAdmin', () => () => <div data-testid="list-items-admin" />);
jest.mock('../../commons/routes/AdminRoutes', () => () => <div data-testid="admin-routes" />);

describe('DashboardAdmin Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar el dashboard con su menú y título', () => {
    render(
      <BrowserRouter>
        <DashboardAdmin />
      </BrowserRouter>
    );

    expect(screen.getByText('Administrator Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('list-items-admin')).toBeInTheDocument();
    expect(screen.getByTestId('admin-routes')).toBeInTheDocument();
  });

  it('debería llamar a logout al hacer clic en salir', () => {
    render(
      <BrowserRouter>
        <DashboardAdmin />
      </BrowserRouter>
    );

    // Buscar el botón por el tooltip "Salir"
    const exitButton = screen.getByLabelText('Salir');
    fireEvent.click(exitButton);
    
    expect(mockLogout).toHaveBeenCalledWith(1);
  });
});
