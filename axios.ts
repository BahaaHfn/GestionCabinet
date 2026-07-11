import axios from 'axios';

// Création d'une instance Axios avec configuration de base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes sortantes pour injecter le jeton de sécurité (JWT)
api.interceptors.request.use(
  (config) => {
    // Récupération du jeton depuis le localStorage (ou un store Zustand/Redux)
    const token = localStorage.getItem('token');

    if (token) {
      // Configuration de l'en-tête Authorization de la requête HTTP
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses pour gérer les erreurs globales (ex: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Nettoyage du token expiré ou invalide
      localStorage.removeItem('token');
      // Redirection éventuelle de l'utilisateur
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
