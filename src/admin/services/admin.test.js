import * as adminService from './admin';

describe('Admin Service', () => {
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
  const mockResponse = { statusCode: 200, data: [], message: 'Success' };

  const setupFetchMock = () => {
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse)
    });
  };

  it('getUsers debería hacer GET a /users', async () => {
    setupFetchMock();
    const res = await adminService.getUsers(token);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors'
    });
    expect(res).toEqual(mockResponse);
  });

  it('createUser debería hacer POST a /users con el payload', async () => {
    setupFetchMock();
    const newUser = { name: 'Juan' };
    const res = await adminService.createUser(token, newUser);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors',
      body: JSON.stringify(newUser)
    });
    expect(res).toEqual(mockResponse);
  });

  it('activeUser debería hacer PUT a /users/activate/:id', async () => {
    setupFetchMock();
    const res = await adminService.activeUser(token, '123');
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/users/activate/123', expect.objectContaining({ method: 'PUT' }));
    expect(res).toEqual(mockResponse);
  });

  it('inactiveUser debería hacer PUT a /users/inactivate/:id', async () => {
    setupFetchMock();
    const res = await adminService.inactiveUser(token, '123');
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/users/inactivate/123', expect.objectContaining({ method: 'PUT' }));
    expect(res).toEqual(mockResponse);
  });

  it('resetPassword debería hacer PUT a /users/changepassword/:id', async () => {
    setupFetchMock();
    const res = await adminService.resetPassword(token, '123', 'newpass');
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/users/changepassword/123', expect.objectContaining({ 
        method: 'PUT',
        body: JSON.stringify({ password: 'newpass' })
    }));
    expect(res).toEqual(mockResponse);
  });

  it('modifyUser debería hacer PUT a /users/:id', async () => {
    setupFetchMock();
    const userData = { username: 'juan2' };
    const res = await adminService.modifyUser(token, '123', userData);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/users/123', expect.objectContaining({ 
        method: 'PUT',
        body: JSON.stringify(userData)
    }));
    expect(res).toEqual(mockResponse);
  });

  it('getAccess debería hacer GET a /users/access/all', async () => {
    setupFetchMock();
    const res = await adminService.getAccess(token);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/users/access/all', expect.objectContaining({ method: 'GET' }));
    expect(res).toEqual(mockResponse);
  });

});
