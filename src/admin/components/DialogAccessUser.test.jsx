import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DialogAccessUser from './DialogAccessUser';

describe('DialogAccessUser Component', () => {
  const mockSetOpen = jest.fn();
  
  const mockAccess = [
    { id: '1', name: 'Ventas' },
    { id: '2', name: 'Precios' }
  ];

  const mockUserAccess = ['1']; // El usuario tiene acceso a "1" pero no a "2"

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar los accesos y marcar los que tiene el usuario por defecto', () => {
    render(<DialogAccessUser open={true} setOpen={mockSetOpen} access={mockAccess} userAccess={mockUserAccess} />);
    
    expect(screen.getByText('Accessos del usuario')).toBeInTheDocument();
    
    const checkboxVentas = screen.getByLabelText('Ventas');
    const checkboxPrecios = screen.getByLabelText('Precios');

    expect(checkboxVentas).toBeChecked();
    expect(checkboxPrecios).not.toBeChecked();
  });

  it('debería ejecutar el submit y hacer log de los valores enviados (comportamiento actual del componente)', async () => {
    // Espiamos console.log ya que el onSubmit actual de DialogAccessUser solo hace log
    console.log = jest.fn(); 

    render(<DialogAccessUser open={true} setOpen={mockSetOpen} access={mockAccess} userAccess={mockUserAccess} />);
    
    // Marcamos la casilla de precios
    const checkboxPrecios = screen.getByLabelText('Precios');
    fireEvent.click(checkboxPrecios);

    fireEvent.click(screen.getByRole('button', { name: /Crear/i }));
    
    await waitFor(() => {
      // Como marcamos el 2 y el 1 venía marcado por defecto, ambos deben ser true
      expect(console.log).toHaveBeenCalledWith({ '1': true, '2': true });
    });
  });

  it('debería cerrar el modal al cancelar', () => {
    render(<DialogAccessUser open={true} setOpen={mockSetOpen} access={mockAccess} userAccess={mockUserAccess} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
