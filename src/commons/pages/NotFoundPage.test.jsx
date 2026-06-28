import { render, screen } from '@testing-library/react';
import NotFoundPage from './NotFoundPage';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

describe('NotFoundPage', () => {
  it('renderiza el componente NotFound', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <NotFoundPage />
        </BrowserRouter>
      </HelmetProvider>
    );
    expect(screen.getByText(/no se ha encontrado la página/i)).toBeInTheDocument();
  });
});
