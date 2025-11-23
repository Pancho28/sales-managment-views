const API_URL= process.env.REACT_APP_API_URL;

export async function getUsers(token) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors'
    };
    const response = await fetch(`${API_URL}/users`, requestOptions);
    const data = await response.json();
    return data;

}

export async function createUser(token,user) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors',
      body: JSON.stringify(user)
    };
    const response = await fetch(`${API_URL}/users`, requestOptions);
    const data = await response.json();
    return data;
}

export async function activeUser(token,userId) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors'
    };
    const response = await fetch(`${API_URL}/users/activate/${userId}`, requestOptions);
    const data = await response.json();
    return data;
}

export async function inactiveUser(token,userId) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors'
    };
    const response = await fetch(`${API_URL}/users/inactivate/${userId}`, requestOptions);
    const data = await response.json();
    return data;
}

export async function resetPassword(token,userId,newPassword) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors',
      body: JSON.stringify({ password: newPassword })
    };
    const response = await fetch(`${API_URL}/users/changepassword/${userId}`, requestOptions);
    const data = await response.json();
    return data;
}

export async function modifyUser(token,userId,newUserData) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      mode: 'cors',
      body: JSON.stringify(newUserData)
    };
    const response = await fetch(`${API_URL}/users/${userId}`, requestOptions);
    const data = await response.json();
    return data;
}