import apiClient from './api';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

// ✅ Ստանալ հայտնի ֆիլմերը
export const getPopularMovies = async (page = 1): Promise<Movie[]> => {
  try {
    const response = await apiClient.get('/movie/popular', {
      params: { page }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

// ✅ Ստանալ ֆիլմեր ըստ որոնման
export const searchMovies = async (query: string): Promise<any[]> => {
    if (!query) return [];
    try {
      const response = await apiClient.get('/search/movie', {
        params: { query: query, language: 'en-US', page: 1 }
      });
      console.log('✅ API Search Response:', response.data);
      return response.data.results || [];
    } catch (error) {
      console.error('❌ Error searching movies:', error);
      return [];
    }
  };
// ✅ Ստանալ ժանրերի ցանկը
export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await apiClient.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

// ✅ Ստանալ ֆիլմեր ըստ ժանրի
export const getMoviesByGenre = async (genreId: number, page = 1): Promise<Movie[]> => {
  try {
    const response = await apiClient.get('/discover/movie', {
      params: { with_genres: genreId, page }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return [];
  }
};
