import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renderiza el texto proporcionado', () => {
    render(<Footer text="Test Footer" />);
    expect(screen.getByText('Test Footer')).toBeInTheDocument();
  });
});
