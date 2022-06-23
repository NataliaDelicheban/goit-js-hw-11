import axios from 'axios';

const API_KEY = '28202857-da67bbd245b1e5ba97a15a2d6';
const BASE_URL = 'https://pixabay.com/api/';

export default async function fetchPhotos(searchQuery, page) {
  const URL = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  const response = await axios.get(URL);
  return response.data;
}
