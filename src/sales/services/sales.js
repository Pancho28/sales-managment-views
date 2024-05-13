const API_URL= process.env.REACT_APP_API_URL;

export async function getProducts(token) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors'
    };
    const response = await fetch(`${API_URL}/products`, requestOptions);
    const data = await response.json();
    return data;
}

export async function getPaymentsTypes(token) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors'
    };
    const response = await fetch(`${API_URL}/orders/paymentType/all`, requestOptions);
    const data = await response.json();
    return data;
}

export async function createOrder(token,order) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors',
      body: JSON.stringify(order)
    };
    const response = await fetch(`${API_URL}/orders`, requestOptions);
    const data = await response.json();
    return data;
}

export async function getCategories(token) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors'
    };
    const response = await fetch(`${API_URL}/products/category`, requestOptions);
    const data = await response.json();
    return data;
}

export async function getSummaryByPrice(token, localId) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors'
    };
    const response = await fetch(`${API_URL}/products/summaryByPrice/${localId}`, requestOptions);
    const data = await response.json();
    return data;
}

export async function getSummaryByPaymentType(token, localId) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors'
    };
    const response = await fetch(`${API_URL}/orders/summaryPaymentType/${localId}`, requestOptions);
    const data = await response.json();
    return data;
}