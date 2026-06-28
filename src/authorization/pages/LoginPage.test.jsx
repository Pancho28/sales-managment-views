import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mockeamos el componente SignIn para aislar la prueba de la página
jest.mock('../components/SignIn', () => () => <div data-testid="sign-in-mock" />);

describe('LoginPage Component', () => {
  it('debería renderizar la página y contener el componente SignIn', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </HelmetProvider>
    );
    
    expect(screen.getByTestId('sign-in-mock')).toBeInTheDocument();
  });
});
