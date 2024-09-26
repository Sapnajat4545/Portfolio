// script.js
const API_KEY = 'YOUR_OMDB_API_KEY'; // Replace with your OMDb API key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
const movieGrid = document.getElementById('movieGrid');
const movieDetails = document.getElementById('movieDetails');
const searchInput = document.getElementById('searchInput');
const closeDetailsButton = document.getElementById('closeDetails');
const addToWatchlistButton = document.getElementById('addToWatchlistButton');
const watchlistButton = document.getElementById('watchlistButton');
let currentMovieId = '';

searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    if (query) {
        fetchMovies(query);
    } else {
        movieGrid.innerHTML = '';
    }
});

watchlistButton.addEventListener('click', () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    alert(`Watchlist: ${watchlist.join(', ')}`);
});

closeDetailsButton.addEventListener('click', () => {
    movieDetails.classList.add('hidden');
});

addToWatchlistButton.addEventListener('click', () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.includes(currentMovieId)) {
        watchlist.push(currentMovieId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert('Added to Watchlist');
    } else {
        alert('Already in Watchlist');
    }
});

function fetchMovies(query) {
    fetch(`${API_URL}&s=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.Search) {
                movieGrid.innerHTML = data.Search.map(movie => `
                    <div class="movieCard" data-id="${movie.imdbID}">
                        <img src="${movie.Poster}" alt="${movie.Title}">
                        <h3>${movie.Title}</h3>
                        <p>${movie.Year}</p>
                    </div>
                `).join('');
                document.querySelectorAll('.movieCard').forEach(card => {
                    card.addEventListener('click', () => {
                        const movieId = card.getAttribute('data-id');
                        fetchMovieDetails(movieId);
                    });
                });
            } else {
                movieGrid.innerHTML = '<p>No movies found</p>';
            }
        })
        .catch(error => console.error('Error fetching movies:', error));
}

function fetchMovieDetails(id) {
    fetch(`${API_URL}&i=${id}`)
        .then(response => response.json())
        .then(movie => {
            currentMovieId = movie.imdbID;
            document.getElementById('movieTitle').textContent = movie.Title;
            document.getElementById('moviePoster').src = movie.Poster;
            document.getElementById('movieYear').textContent = movie.Year;
            document.getElementById('movieDirector').textContent = movie.Director;
            document.getElementById('moviePlot').textContent = movie.Plot;
            document.getElementById('movieCast').textContent = movie.Actors;
            movieDetails.classList.remove('hidden');
        })
        .catch(error => console.error('Error fetching movie details:', error));
}
