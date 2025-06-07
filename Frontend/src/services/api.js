import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';
const PRESENCE_API_URL = 'http://localhost:5000/api/presence';
const PICTURES_API_URL = 'http://localhost:5000/api/pictures';

export const register = async (name, email, password, localId) => {
  const response = await axios.post(`${API_URL}/add`, { name, email, password, localId });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const addPresence = async (userId, latitude, longitude) => {
  const response = await axios.post(`${PRESENCE_API_URL}/add`, {
    userId,
    latitude,
    longitude
  });
  return response.data;
};

export const getPresencesByUserId = async (userId) => {
  const response = await axios.get(`${PRESENCE_API_URL}/user/${userId}`);
  return response.data;
};

export const deletePresence = async (presenceId) => {
  const response = await axios.delete(`${PRESENCE_API_URL}/delete/${presenceId}`);
  return response.data;
};

export const updatePresence = async (presenceId, updatedData) => {
  const response = await axios.put(`${PRESENCE_API_URL}/update/${presenceId}`, updatedData);
  return response.data;
};

export const uploadUserPicture = async (formData) => {
  const response = await axios.post(`${PICTURES_API_URL}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getUserPicture = async (userId) => {
  const response = await axios.get(`${PICTURES_API_URL}/${userId}`);
  return response.data;
};
