import fetchPhotos from './API-KEY';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery .photo-card a', {
  captionDelay: 300,
});

const searchForm = document.querySelector('.search-form');
const loadBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let searchQuery = '';
let page = 1;
let totalElements;

searchForm.addEventListener('submit', onSearch);
loadBtn.addEventListener('click', loadMoreCards);

btnIsHidden();

function clearGallery() {
  gallery.innerHTML = '';
  page = 1;
  totalElements = 0;
  btnIsVisible();
}

async function onSearch(e) {
  try {
    e.preventDefault();
    searchQuery = e.currentTarget.elements.searchQuery.value;
    if (searchQuery === '') {
      return Notify.failure('Enter your search, please!');
    }
    clearGallery();
    const result = await fetchPhotos(searchQuery, page);
    resultCheck(result);
  } catch (error) {
    console.log(error);
  }
}

async function loadMoreCards() {
  const result = await fetchPhotos(searchQuery, ++page);
  resultCheck(result);
}

function resultCheck(result) {
  let totalHits = result.totalHits;
  const cards = result.hits;
  totalElements += cards.length;
  if (page === 1 && totalHits !== 0) {
    Notify.info(`"Hooray! We found ${totalHits} images."!`);
  }
  if (totalHits === 0) {
    btnIsHidden();
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (totalElements >= totalHits) {
    btnIsHidden();
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
  renderCard(cards);
}

function renderCard(cards) {
  const markup = cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href ="${largeImageURL}"  onclick="event.preventDefault()">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width=300px height=200px/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

function btnIsHidden() {
  loadBtn.classList.add('is-hidden');
}

function btnIsVisible() {
  loadBtn.classList.remove('is-hidden');
}

