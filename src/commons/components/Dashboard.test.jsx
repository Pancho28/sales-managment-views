import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import useLogout from '../hooks/useLogout';

jest.mock('../routes/MenuRoutes', () => () => <div data-testid="mock-menu-routes">MenuRoutes</div>);
jest.mock('./ListItems', () => () => <div data-testid="mock-list-items">ListItems</div>);
jest.mock('./DialogDolar', () => ({ open, setOpen }) => (
  open ? <div data-testid="mock-dialog-dolar"><button onClick={() => setOpen(false)}>Cerrar Dolar</button></div> : null
));
jest.mock('../hooks/useLogout');

describe('Dashboard Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    sessionStorage.setItem('data', JSON.stringify({
      id: 1,
      accessToken: 'token',
      local: { id: 1, name: 'Local Test', dolar: 5.5 }
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('renderiza correctamente con la data del sessionStorage', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard LOCAL TEST')).toBeInTheDocument();
    expect(screen.getByText('5.5$')).toBeInTheDocument();
    expect(screen.getByTestId('mock-menu-routes')).toBeInTheDocument();
    expect(screen.getByTestId('mock-list-items')).toBeInTheDocument();
  });

  it('llama logout si no hay data en el sessionStorage', async () => {
    sessionStorage.clear();
    render(<Dashboard />);
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it('permite abrir y cerrar el DialogDolar', () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByText('5.5$'));
    expect(screen.getByTestId('mock-dialog-dolar')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Cerrar Dolar'));
    expect(screen.queryByTestId('mock-dialog-dolar')).not.toBeInTheDocument();
  });

  it('llama logout controlado al hacer click en Salir', () => {
    render(<Dashboard />);
    // ExitToAppIcon is rendered inside an IconButton, we can find it by Tooltip text? No, tooltip might not render until hover.
    // Better find all icon buttons and click the last one which is the exit button.
    const exitBtn = screen.getByRole('button', { name: /salir/i });
    fireEvent.click(exitBtn);
    expect(mockLogout).toHaveBeenCalledWith(1);
  });
});
