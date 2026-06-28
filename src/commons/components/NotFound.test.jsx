import { render, screen, fireEvent } from '@testing-library/react';
import NotFound from './NotFound';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('NotFound Component', () => {
  it('renderiza la pagina 404', () => {
    render(<NotFound />, { wrapper: BrowserRouter });
    expect(screen.getByText(/no se ha encontrado la página/i)).toBeInTheDocument();
  });

  it('permite navegar al menu principal', () => {
    render(<NotFound />, { wrapper: BrowserRouter });
    const button = screen.getByRole('button', { name: /Ir al menu principal/i });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
