import axios from 'axios';

export const getTodayMatches = async () => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const response = await axios.get(`/api/matches?date=${today}`);
    return response.data.matches;
  } catch (error) {
    console.error('Erreur API:', error.response?.data || error.message);
    throw error;
  }
};

export const getFootballNews = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=football&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
    );
    return response.data.articles;
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités:', error.response?.data || error.message);
    throw error;
  }
};

export const getTrendingTeams = async () => {
  try {
    const response = await axios.get('/api/competitions/CL/teams');
    return response.data.teams; // On retourne la liste des équipes
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes tendance:', error.response?.data || error.message);
    throw error;
  }
};
