import { render, screen } from '@testing-library/react';
import AppRoutes from './AppRoutes';

// Mocks
jest.mock('../../authorization/pages/LoginPage', () => () => <div data-testid="login">Login</div>);
jest.mock('../../admin/pages/DashboardAdminPage.jsx', () => () => <div data-testid="admin">Admin</div>);
jest.mock('../pages', () => ({
  DashboardPage: () => <div data-testid="dashboard">Dashboard</div>,
  NotFoundPage: () => <div data-testid="not-found">NotFound</div>
}));

describe('AppRoutes', () => {
  beforeEach(() => {
    // Delete window.location so we can mock it if needed or just let jsdom handle it.
    // MemoryRouter cannot be used inside AppRoutes because AppRoutes uses <Router> internally.
    // Instead we can spy on window.location or use window.history to set initial path before render.
  });

  it('renderiza las rutas', () => {
    window.history.pushState({}, 'Test page', '/');
    render(<AppRoutes />);
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });
});
