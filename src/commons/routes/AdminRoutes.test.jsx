import { render, screen } from '@testing-library/react';
import AdminRoutes from './AdminRoutes';
import { MemoryRouter } from 'react-router-dom';

// Mocks
jest.mock('../../admin/components/index.js', () => ({
  Users: () => <div data-testid="users-page">Users Page</div>
}));
jest.mock('../pages', () => ({
  NotFoundPage: () => <div data-testid="not-found-page">Not Found Page</div>
}));

describe('AdminRoutes', () => {
  it('renderiza Users en la ruta base', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AdminRoutes />
      </MemoryRouter>
    );
    expect(screen.getByTestId('users-page')).toBeInTheDocument();
  });

  it('renderiza NotFoundPage en ruta invalida', () => {
    render(
      <MemoryRouter initialEntries={['/invalid']}>
        <AdminRoutes />
      </MemoryRouter>
    );
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});
