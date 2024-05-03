const API_URL= process.env.REACT_APP_API_URL;

export async function login(username,password) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({ username , password })
    };
    const response = await fetch(`${API_URL}/authorization`, requestOptions);
    const data = await response.json();
    return data;
}

