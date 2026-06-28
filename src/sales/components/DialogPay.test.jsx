import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DialogPay from './DialogPay';
import { enqueueSnackbar } from 'notistack';

jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));

describe('DialogPay Component', () => {
  const mockSetOpen = jest.fn();
  const mockCompleteOrder = jest.fn();

  const paymentTypes = [
    { id: '1', name: 'Efectivo' },
    { id: '2', name: 'UNPAID' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente con 1 método de pago', () => {
    render(
      <DialogPay 
        open={true} 
        setOpen={mockSetOpen} 
        paymentTypes={paymentTypes} 
        completeOrder={mockCompleteOrder} 
        total={100} 
        accessToOrders={true} 
        withUnPaid={true} 
      />
    );
    expect(screen.getByText(/Forma de pago/i)).toBeInTheDocument();
    expect(screen.getByText(/Total 100\$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Orden entregada/i)).toBeInTheDocument(); // accessToOrders = true
  });

  it('cierra el modal al presionar Cancelar', () => {
    render(<DialogPay open={true} setOpen={mockSetOpen} paymentTypes={paymentTypes} completeOrder={mockCompleteOrder} total={100} accessToOrders={false} withUnPaid={true} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
  
});
