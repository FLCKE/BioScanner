
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user/'; 
const PRESENCE_API_URL = 'http://localhost:5000/api/presence/';

export const register = async (name, email, password, localId) => {
  const response = await axios.post(`${API_URL}add`, { name, email,  password, localId });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}login`, { email, password });
  return response.data;
};


export const getPresencesByUserId = async (userId) => {
  const response = await axios.get(`${PRESENCE_API_URL}${userId}`);
  return response.data;
};
