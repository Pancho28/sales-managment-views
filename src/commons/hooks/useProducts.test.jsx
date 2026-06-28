import { renderHook, waitFor } from '@testing-library/react';
import useProducts from './useProducts';
import { getProducts, getPaymentsTypes, getCategories } from '../../sales/services/sales';
import { enqueueSnackbar } from 'notistack';
import useLogout from './useLogout';

jest.mock('../../sales/services/sales');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));
jest.mock('./useLogout.jsx');
jest.mock('moment-timezone', () => () => ({ tz: () => ({ format: () => '2023-01-01T00:00:00Z' }) }));

describe('useProducts hook', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    sessionStorage.setItem('data', JSON.stringify({ accessToken: 'token', access: [] }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('obtiene los productos y categorias de la API', async () => {
    getProducts.mockResolvedValue({ statusCode: 200, products: [] });
    getPaymentsTypes.mockResolvedValue({ statusCode: 200, paymentTypes: [] });
    getCategories.mockResolvedValue({ statusCode: 200, categories: [] });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.products).toEqual([]);
      expect(result.current.paymentTypes).toEqual([]);
      expect(result.current.categories).toEqual([]);
    });
  });

  it('obtiene productos del sessionStorage si existen', async () => {
    sessionStorage.setItem('products', JSON.stringify([{ id: '1' }]));
    sessionStorage.setItem('paymentTypes', JSON.stringify([]));
    sessionStorage.setItem('categories', JSON.stringify([]));
    sessionStorage.setItem('access', JSON.stringify(true));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.products).toEqual([{ id: '1' }]);
    });
    
    expect(getProducts).not.toHaveBeenCalled();
  });
});
