import * as pricesService from './prices';

describe('Prices Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, REACT_APP_API_URL: 'http://localhost:3000' };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  const token = 'mock-token';
  const mockResponse = { statusCode: 200, message: 'Success' };

  const setupFetchMock = () => {
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse)
    });
  };

  it('createProduct debería llamar a POST /products', async () => {
    setupFetchMock();
    const product = { name: 'Refresco' };
    const res = await pricesService.createProduct(token, product);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/products', expect.objectContaining({ method: 'POST', body: JSON.stringify(product) }));
    expect(res).toEqual(mockResponse);
  });

  it('updateProduct debería llamar a PUT /products/:localId', async () => {
    setupFetchMock();
    const product = { name: 'Refresco' };
    const res = await pricesService.updateProduct(token, product, 1);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/products/1', expect.objectContaining({ method: 'PUT', body: JSON.stringify(product) }));
    expect(res).toEqual(mockResponse);
  });

  it('activateProduct debería llamar a PUT /products/active/:localId/:productId', async () => {
    setupFetchMock();
    const res = await pricesService.activateProduct(token, 1, 2);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/products/active/1/2', expect.objectContaining({ method: 'PUT' }));
    expect(res).toEqual(mockResponse);
  });

  it('desactivateProduct debería llamar a PUT /products/inactive/:localId/:productId', async () => {
    setupFetchMock();
    const res = await pricesService.desactivateProduct(token, 1, 2);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/products/inactive/1/2', expect.objectContaining({ method: 'PUT' }));
    expect(res).toEqual(mockResponse);
  });
});
