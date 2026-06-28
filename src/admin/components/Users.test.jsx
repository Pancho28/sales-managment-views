import { render, screen, fireEvent } from '@testing-library/react';
import Users from './Users';
import { useUsers, useUserMutationStatus, useAccessUser } from '../hooks';
import { Status, Roles } from '../../commons/helpers/enum.ts';

// Mocks
jest.mock('../hooks');
jest.mock('../../commons/components', () => ({
  SkeletonTable: () => <div data-testid="skeleton-table" />
}));
jest.mock('.', () => ({
  DialogAddUser: () => <div data-testid="dialog-add" />,
  DialogResetPassword: () => <div data-testid="dialog-reset" />,
  DialogModifyUser: () => <div data-testid="dialog-modify" />,
  DialogAccessUser: () => <div data-testid="dialog-access" />
}));

describe('Users Component', () => {
  const mockMutateStatus = jest.fn();

  beforeEach(() => {
    useUsers.mockReturnValue({ isLoading: false, isError: false, data: [] });
    useAccessUser.mockReturnValue({ isLoading: false, isError: false, data: [] });
    useUserMutationStatus.mockReturnValue({ mutation: { mutate: mockMutateStatus } });
    sessionStorage.setItem('data', JSON.stringify({ accessToken: 'mock' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('muestra skeleton si está cargando usuarios', () => {
    useUsers.mockReturnValue({ isLoading: true });
    render(<Users />);
    expect(screen.getByTestId('skeleton-table')).toBeInTheDocument();
  });

  it('muestra error si la carga de usuarios falla', () => {
    useUsers.mockReturnValue({ isLoading: false, isError: true, error: { message: 'Error conexion' } });
    render(<Users />);
    expect(screen.getByText(/Error cargando usuarios: Error conexion/i)).toBeInTheDocument();
  });

  it('renderiza la tabla con los datos del usuario', () => {
    useUsers.mockReturnValue({ 
      isLoading: false, 
      isError: false, 
      data: [{ 
        id: 1, username: 'juan', email: 'juan@test.com', role: Roles.SELLER, 
        local: [{name: 'Sucursal A', dolar: 40}], status: Status.ACTIVE, 
        creationDate: '2023-01-01', tz: 'UTC' 
      }] 
    });
    
    render(<Users />);
    expect(screen.getByText('juan')).toBeInTheDocument();
    expect(screen.getByText('Sucursal A')).toBeInTheDocument();
    expect(screen.getByText('40.00$')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('abre el diálogo de agregar usuario', () => {
    render(<Users />);
    fireEvent.click(screen.getByRole('button', { name: /Agregar usuario/i }));
    expect(screen.getByTestId('dialog-add')).toBeInTheDocument();
  });

  it('abre el menú de opciones y permite cambiar el estado del usuario', () => {
    useUsers.mockReturnValue({ 
      isLoading: false, 
      isError: false, 
      data: [{ 
        id: 1, username: 'juan', role: Roles.SELLER, 
        local: [{name: 'Sucursal A', dolar: 40}], status: Status.ACTIVE, 
        creationDate: '2023-01-01', tz: 'UTC' 
      }] 
    });
    
    render(<Users />);
    
    // Abrir menú de opciones
    const optionsButton = screen.getByTestId('MoreHorizIcon').parentElement;
    fireEvent.click(optionsButton);
    
    // Click en cambiar estado
    fireEvent.click(screen.getByText('Cambiar estado'));
    
    expect(mockMutateStatus).toHaveBeenCalledWith({
        userId: 1, currentStatus: Status.ACTIVE, token: 'mock'
    });
  });

});
