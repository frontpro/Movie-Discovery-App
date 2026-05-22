
const API_KEY = '135b91af87c639745c63caa131d1c2b9'; 

const API_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

const main = document.getElementById('main-container');
const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('movie-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-btn');

// 1. 
getMovies(API_URL + `/movie/popular?api_key=${API_KEY}&language=ar-SA&page=1`);

async function getMovies(url) {
    main.innerHTML = '<p style="text-align:center; width:100%;">جاري التحميل...</p>';
    try {
        const res = await fetch(url);
        const data = await res.json();
        showMovies(data.results);
    } catch (err) {
        console.error("Error fetching data:", err);
        main.innerHTML = '<p style="color:red;">فشل جلب البيانات. تأكد من مفتاح API أو الاتصال.</p>';
    }
}

// 2. 
function showMovies(movies) {
    main.innerHTML = '';
    movies.forEach(movie => {
        const { title, poster_path, vote_average, id, overview, backdrop_path } = movie;
        
        
        if (!poster_path) return;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');
        movieEl.innerHTML = `
            <img src="${IMG_URL + poster_path}" alt="${title}">
            <div class="rating">${vote_average.toFixed(1)}⭐</div>
            <div class="movie-info">
                <h3>${title}</h3>
            </div>
        `;
        
      
        movieEl.addEventListener('click', () => openModal(movie));
        main.appendChild(movieEl);
    });
}

// 3. 
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value;
    if (searchTerm && searchTerm !== '') {
        getMovies(API_URL + `/search/movie?api_key=${API_KEY}&language=ar-SA&query="${searchTerm}"`);
        searchInput.value = '';
    } else {
        window.location.reload();
    }
});

// 4. 
function openModal(movie) {
    const { title, overview, vote_average, release_date, poster_path, backdrop_path } = movie;
    modal.style.display = 'flex';
    modalBody.innerHTML = `
        <div class="modal-header">
            <img src="${IMG_URL + poster_path}" alt="${title}">
            <div>
                <h2 style="color:var(--primary-color);">${title}</h2>
                <p><strong>تاريخ الإصدار:</strong> ${release_date || 'غير معروف'}</p>
                <p><strong>التقييم:</strong> ${vote_average.toFixed(1)} / 10</p>
                <p><strong>القصة:</strong> ${overview || 'لا يوجد وصف متاح لهذا الفيلم.'}</p>
            </div>
        </div>
        ${backdrop_path ? `<img src="${BACKDROP_URL + backdrop_path}" style="width:100%; border-radius:5px;">` : ''}
    `;
}

//
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target == modal) modal.style.display = 'none';
}
