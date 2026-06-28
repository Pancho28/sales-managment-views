import * as salesService from './sales';

describe('Sales Service', () => {
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

  it('getProducts debería llamar a /products/byCategory', async () => {
    setupFetchMock();
    const res = await salesService.getProducts(token);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/products/byCategory', expect.objectContaining({ method: 'GET' }));
    expect(res).toEqual(mockResponse);
  });

  it('getPaymentsTypes debería llamar a /orders/paymentType/all', async () => {
    setupFetchMock();
    const res = await salesService.getPaymentsTypes(token);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/orders/paymentType/all', expect.objectContaining({ method: 'GET' }));
    expect(res).toEqual(mockResponse);
  });

  it('createOrder debería llamar a POST /orders con el payload', async () => {
    setupFetchMock();
    const order = { items: [] };
    const res = await salesService.createOrder(token, order);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors',
      body: JSON.stringify(order)
    });
    expect(res).toEqual(mockResponse);
  });

  it('getCategories debería llamar a /products/category', async () => {
    setupFetchMock();
    const res = await salesService.getCategories(token);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/products/category', expect.objectContaining({ method: 'GET' }));
    expect(res).toEqual(mockResponse);
  });

  it('getSummaryByPrice debería hacer POST a /products/summaryByPrice/:localId', async () => {
    setupFetchMock();
    const date = { start: '2023' };
    const res = await salesService.getSummaryByPrice(token, '1', date);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/products/summaryByPrice/1', expect.objectContaining({ method: 'POST', body: JSON.stringify(date) }));
    expect(res).toEqual(mockResponse);
  });

});
