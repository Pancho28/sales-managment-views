import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import DashboardAdminPage from './DashboardAdminPage';

// Mockeamos el componente principal que renderiza
jest.mock('../components', () => ({
  DashboardAdmin: () => <div data-testid="dashboard-admin-mock" />
}));

describe('DashboardAdminPage Component', () => {
  it('debería renderizar el layout y el componente interno DashboardAdmin', () => {
    render(
      <HelmetProvider>
        <DashboardAdminPage />
      </HelmetProvider>
    );
    
    expect(screen.getByTestId('dashboard-admin-mock')).toBeInTheDocument();
  });
});
