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


const CACHE_TIME = 5 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();

// cache-ը եթե չկա կանչում է API
const fetchWithCache = async (key: string, fetchFunction: () => Promise<any>) => {
  const cachedData = cache.get(key);

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIME) {
    console.log(`♻️ Using cached data for: ${key}`);
    return cachedData.data;
  }

  console.log(`🌍 Fetching new data for: ${key}`);
  const data = await fetchFunction();
  cache.set(key, { data, timestamp: Date.now() });

  return data;
};

// PopularMovies(cache + API)
export const getPopularMovies = async (page = 1): Promise<Movie[]> => {
  return fetchWithCache(`popular_movies_page_${page}`, async () => {
    try {
      const response = await apiClient.get('/movie/popular', { params: { page } });
      return response.data.results;
    } catch (error) {
      console.error('❌ Error fetching popular movies:', error);
      return [];
    }
  });
};

// searchMovies(cache + API)
export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  return fetchWithCache(`search_${query}`, async () => {
    try {
      const response = await apiClient.get('/search/movie', {
        params: { query, language: 'en-US', page: 1 }
      });
      console.log('🔍 API Search Response:', response.data);
      return response.data.results || [];
    } catch (error) {
      console.error('❌ Error searching movies:', error);
      return [];
    }
  });
};

// getGenres (cache + API)
export const getGenres = async (): Promise<Genre[]> => {
  return fetchWithCache('movie_genres', async () => {
    try {
      const response = await apiClient.get('/genre/movie/list');
      return response.data.genres;
    } catch (error) {
      console.error('❌ Error fetching genres:', error);
      return [];
    }
  });
};

// getMoviesByGenre (cache + API)
export const getMoviesByGenre = async (genreId: number, page = 1): Promise<Movie[]> => {
  return fetchWithCache(`movies_by_genre_${genreId}_page_${page}`, async () => {
    try {
      const response = await apiClient.get('/discover/movie', { params: { with_genres: genreId, page } });
      return response.data.results;
    } catch (error) {
      console.error('❌ Error fetching movies by genre:', error);
      return [];
    }
  });
};

// services/movieService.ts
export const addToFavorites = (movie: Movie) => {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.some((m: Movie) => m.id === movie.id)) {
      favorites.push(movie);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  };
  
  export const removeFromFavorites = (movieId: number) => {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter((m: Movie) => m.id !== movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };
  
  export const getFavorites = (): Movie[] => {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  };
  // getTopRatedMovies
export const getTopRatedMovies = async (page = 1): Promise<Movie[]> => {
    try {
      const response = await apiClient.get('/movie/top_rated', {
        params: { page }
      });
      return response.data.results;
    } catch (error) {
      console.error('❌ Error fetching top-rated movies:', error);
      return [];
    }
  };
  