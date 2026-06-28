import { render, screen, fireEvent } from '@testing-library/react';
import ListItems from './ListItems';
import { BrowserRouter } from 'react-router-dom';
import useLogout from '../hooks/useLogout';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));
jest.mock('../hooks/useLogout');

describe('ListItems Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    sessionStorage.setItem('data', JSON.stringify({
      access: [
        { name: 'Open orders', pass: '123' },
        { name: 'Total by product', pass: null }
      ]
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ListItems />
      </BrowserRouter>
    );
  };

  it('renderiza la lista de elementos en base al acceso', () => {
    renderComponent();
    expect(screen.getByText('Ventas')).toBeInTheDocument();
    expect(screen.getByText('Por entregar')).toBeInTheDocument();
    expect(screen.getByText('Totales')).toBeInTheDocument();
    expect(screen.queryByText('Cierre')).not.toBeInTheDocument(); // No tiene acceso
  });

  it('abre el dialogo de contraseña si la vista lo requiere', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Por entregar'));
    // El dialogo DialogPassword deberia abrirse
    expect(screen.getByText('Clave de acceso')).toBeInTheDocument();
  });

  it('navega directamente si la vista no requiere contraseña', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Totales'));
    expect(mockNavigate).toHaveBeenCalledWith('/menu/totales');
  });

  it('hace logout si no hay acceso en el sessionStorage', () => {
    sessionStorage.clear();
    renderComponent();
    expect(mockLogout).toHaveBeenCalled();
  });
});
