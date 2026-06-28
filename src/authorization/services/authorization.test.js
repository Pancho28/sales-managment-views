import { login } from './authorization';

describe('Authorization Service', () => {
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

  it('debería llamar a login y retornar datos en caso de éxito', async () => {
    const mockData = { statusCode: 200, data: { token: '123' }, message: 'Success' };
    
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData)
    });

    const credentials = { username: 'testuser', password: 'password123' };
    const response = await login(credentials);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/authorization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify(credentials)
    });
    
    expect(response).toEqual(mockData);
  });
});
