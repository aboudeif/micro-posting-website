const API_URL = 'http://localhost:3000/api';

class ApiService {
  static getHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  static async request(endpoint, method = 'GET', body = null) {
    const config = {
      method,
      headers: this.getHeaders(),
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('access_token');
        }
        
        let errorMessage = data.message || 'Something went wrong';
        
        if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.join(', ');
        } else if (typeof errorMessage === 'object') {
             if (errorMessage.message && Array.isArray(errorMessage.message)) {
                 errorMessage = errorMessage.message.join(', ');
             } else if (errorMessage.message) {
                 errorMessage = errorMessage.message;
             } else {
                 errorMessage = JSON.stringify(errorMessage);
             }
        }

      throw new Error(errorMessage);
    }

    return data;
  }

  static async login(email, password) {
    const response = await this.request('/auth/login', 'POST', { email, password });
    if (response.data && response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  }

  static async getPosts(userId) {
     const query = userId ? `?userId=${userId}` : '';
     return this.request(`/posts${query}`, 'GET');
  }

  static async createPost(content) {
    return this.request('/posts', 'POST', { content });
  }

  static async deletePost(id) {
    return this.request(`/posts/${id}`, 'DELETE');
  }

  static async getUsers() {
    return this.request('/users', 'GET');
  }
}
