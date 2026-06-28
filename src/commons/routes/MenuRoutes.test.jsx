import { render, screen } from '@testing-library/react';
import MenuRoutes from './MenuRoutes';
import { MemoryRouter } from 'react-router-dom';

// Mocks
jest.mock('../../sales/pages', () => ({
  Sales: () => <div data-testid="sales">Sales</div>,
  Totals: () => <div data-testid="totals">Totals</div>,
  Accounting: () => <div data-testid="accounting">Accounting</div>,
  NotDeliveredOrders: () => <div data-testid="orders">Orders</div>,
  Unpaid: () => <div data-testid="unpaid">Unpaid</div>,
  ForEmployee: () => <div data-testid="foremployee">ForEmployee</div>
}));
jest.mock('../../prices/pages', () => ({
  Prices: () => <div data-testid="prices">Prices</div>
}));
jest.mock('../pages', () => ({
  NotFoundPage: () => <div data-testid="not-found">Not Found</div>
}));

describe('MenuRoutes', () => {
  const routes = [
    { path: '/', testId: 'sales' },
    { path: '/precios', testId: 'prices' },
    { path: '/orders', testId: 'orders' },
    { path: '/totales', testId: 'totals' },
    { path: '/cierre', testId: 'accounting' },
    { path: '/unpaid', testId: 'unpaid' },
    { path: '/foremployee', testId: 'foremployee' },
    { path: '/invalid-path', testId: 'not-found' }
  ];

  routes.forEach(({ path, testId }) => {
    it(`renderiza el componente correcto para ${path}`, () => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <MenuRoutes />
        </MemoryRouter>
      );
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });
});
