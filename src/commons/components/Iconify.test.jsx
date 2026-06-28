import { render } from '@testing-library/react';
import Iconify from './Iconify';

describe('Iconify Component', () => {
  it('renderiza correctamente sin crashear', () => {
    const { container } = render(<Iconify icon="eva:home-fill" />);
    expect(container).toBeInTheDocument();
  });
});
