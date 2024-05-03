const API_URL= process.env.REACT_APP_API_URL;

export async function updateDolar(userId,dolar,token) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors',
      body: JSON.stringify({ dolar: parseFloat(dolar) })
    };
    const response = await fetch(`${API_URL}/users/dolar/${userId}`, requestOptions);
    const data = await response.json();
    return data;
}

