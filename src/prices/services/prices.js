const API_URL= process.env.REACT_APP_API_URL;

export async function createProduct(token,product) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors',
      body: JSON.stringify(product)
    };
    const response = await fetch(`${API_URL}/products`, requestOptions);
    const data = await response.json();
    return data;
}

export async function updateProduct(token,product,localId) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors',
      body: JSON.stringify(product)
    };
    const response = await fetch(`${API_URL}/products/${localId}`, requestOptions);
    const data = await response.json();
    return data;
}

export async function activateProduct(token,localId,productId) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors',
    };
    const response = await fetch(`${API_URL}/products/active/${localId}/${productId}`, requestOptions);
    const data = await response.json();
    return data;
}

export async function desactivateProduct(token,localId,productId) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors',
    };
    const response = await fetch(`${API_URL}/products/inactive/${localId}/${productId}`, requestOptions);
    const data = await response.json();
    return data;
}