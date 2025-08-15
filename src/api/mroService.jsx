import { API_CONFIG } from './apiconfig.jsx';

export const MroService = {
  async ping() {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PING}`);
    return await response.text();
  },

  async login(credentials) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    const token = response.headers.get('x-amzn-remapped-authorization')?.replace('Bearer ', '');

    return { user: data, token };
  },

  async getProducts(params = {}, token) {
  const query = new URLSearchParams({
    keyword: params.keyword || '',
    page: params.page || 0,
    size: params.size || 5
  }).toString();

  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}?${query}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Data fetched from API:", data);
  // Retournez un objet standardisé contenant les données et les infos de pagination
  return {
    products: data.content || data.data || data, // Adaptez selon la structure de votre API
    pagination: {
      currentPage: data.number || params.page,
      totalPages: data.totalPage || Math.ceil(data.totalElements / params.size),
      totalItems: data.size || data.total
    }
  };
},

  async createProduct(productData) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this._getAuthHeader()
      },
      body: JSON.stringify(productData)
    });

    return this._handleResponse(response);
  },

  async updateStock(productId, operation) {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}/stock`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this._getAuthHeader()
        },
        body: JSON.stringify(operation)
      }
    );

    return this._handleResponse(response);
  },

  async getUsers(params = {}) {
    const query = new URLSearchParams({
      keyword: params.keyword || '',
      status: params.status || true,
      page: params.page || 0,
      size: params.size || 10,
      ...params
    }).toString();

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}?${query}`, {
      headers: this._getAuthHeader()
    });
    return this._handleResponse(response);
  },

  async getProductTypes() {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCT_TYPES}`, {
      headers: this._getAuthHeader()
    });

    return this._handleResponse(response);
  },

  async getUserRoles() {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ROLES}`, {
      headers: this._getAuthHeader()
    });

    return this._handleResponse(response);
  },

  _getAuthHeader() {
    const token = localStorage.getItem('Token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async _handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return await response.json();
  }
};