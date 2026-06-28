import { render, screen } from '@testing-library/react';
import App from './App';

// Mock child component
jest.mock('./commons/routes/AppRoutes', () => () => <div data-testid="app-routes">Mock App Routes</div>);

describe('App Component', () => {
  it('renderiza la aplicacion envuelta en QueryClientProvider', () => {
    render(<App />);
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });
});
