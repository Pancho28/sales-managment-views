import { render, screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { HelmetProvider } from 'react-helmet-async';

// Mock Dashboard since it's complex
jest.mock('../components/Dashboard', () => () => <div data-testid="mock-dashboard">Mock Dashboard</div>);

describe('DashboardPage', () => {
  it('renderiza el componente Dashboard', () => {
    render(
      <HelmetProvider>
        <DashboardPage />
      </HelmetProvider>
    );
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument();
  });
});
