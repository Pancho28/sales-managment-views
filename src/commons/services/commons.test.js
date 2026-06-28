import * as commonsService from './commons';

describe('Commons Service', () => {
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

  it('updateDolar llama a la ruta correcta con method PUT', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ statusCode: 200 })
    });
    const res = await commonsService.updateDolar(1, 5.5, 'token');
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/users/dolar/1', expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify({ dolar: 5.5 })
    }));
    expect(res.statusCode).toBe(200);
  });
});
