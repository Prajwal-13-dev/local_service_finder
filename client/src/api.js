

const BASE_URL = 'http://localhost:5001/api';

/**
 * A helper function to handle API responses.
 * It checks for ok status and parses JSON.
 */
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
}

/**
 * A helper for making POST/PUT requests.
 */
async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// --- Auth Routes ---

export const registerUser = (userData) => {
  return postData(`${BASE_URL}/register`, userData);
};

export const loginUser = (credentials) => {
  return postData(`${BASE_URL}/login`, credentials);
};

export const registerProvider = (providerData) => {
  return postData(`${BASE_URL}/provider/register`, providerData);
};

export const loginProvider = (credentials) => {
  return postData(`${BASE_URL}/provider/login`, credentials);
};

// --- Provider Routes ---

export const getProviders = async (category) => {
  let url = `${BASE_URL}/providers`;
  if (category) {
    url += `?category=${category}`;
  }
  
  const response = await fetch(url);
  return handleResponse(response);
};

export const getProviderById = async (id) => {
  const response = await fetch(`${BASE_URL}/providers/${id}`);
  return handleResponse(response);
};

export const postReview = (providerId, reviewData) => {
  return postData(`${BASE_URL}/providers/${providerId}/reviews`, reviewData);
};


// Export all functions as a single default object
const api = {
  registerUser,
  loginUser,
  registerProvider,
  loginProvider,
  getProviders,
  getProviderById,
  postReview
};

export default api;