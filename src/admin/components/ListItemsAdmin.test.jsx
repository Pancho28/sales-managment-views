import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListItemsAdmin from './ListItemsAdmin';

describe('ListItemsAdmin Component', () => {
  it('debería renderizar la opción Usuarios', () => {
    render(
      <BrowserRouter>
        <ListItemsAdmin />
      </BrowserRouter>
    );
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
  });
});
