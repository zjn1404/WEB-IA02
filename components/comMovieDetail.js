import { fetchFromUrl } from "../dbProvider.js";
import { TYPE, CLASS } from "../apiComponents.js";

export default {
  props: {
    movieId: "",
  },

  data() {
    return {
      movie: {},
      reviews: [],
      loading: false,
      reviewsLoading: false,
      error: null,
      reviewsError: null,
      fallbackImage:
        "https://via.placeholder.com/400x600?text=No+Image+Available",
      currentPage: 1,
      reviewsPerPage: 5,
    };
  },

  async created() {
    await this.fetchMovieDetails();
    await this.fetchMovieReviews();
  },

  computed: {
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.reviewsPerPage;
      const end = start + this.reviewsPerPage;
      return this.reviews.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.reviews.length / this.reviewsPerPage);
    },

    actorlists() {
      const listSize = 4;
      const lists = [];
      for (let i = 0; i < this.movie.actorList.length; i += listSize) {
        lists.push(this.movie.actorList.slice(i, i + listSize));
      }
      return lists;
    },
  },

  methods: {
    async fetchMovieDetails() {
      this.loading = true;
      this.error = null;

      try {
        const url = `${TYPE.DETAIL}/${CLASS.MOVIE}/${this.movieId}`;
        const response = await fetchFromUrl(url);
        this.movie = response.item;
        console.log(this.movie);
      } catch (err) {
        this.error = "Failed to fetch movie details. Please try again.";
        console.error("Error fetching movie details:", err);
      } finally {
        this.loading = false;
      }
    },

    async fetchMovieReviews() {
      this.reviewsLoading = true;
      this.reviewsError = null;

      try {
        const url = `${TYPE.GET}/${CLASS.REVIEW}/?movieId=${this.movieId}`;
        const response = await fetchFromUrl(url);
        console.log(response);
        if (response.total > 0) {
          this.reviews = response.items[0].items;
        } else {
          this.reviews = [];
        }
      } catch (err) {
        this.reviewsError = "Failed to fetch reviews. Please try again.";
        console.error("Error fetching reviews:", err);
      } finally {
        this.reviewsLoading = false;
      }
    },

    handleImageError(event) {
      event.target.src = this.fallbackImage;
    },

    goToPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    formatDirectorList(directorList) {
      return directorList.map((director) => director.name).join(", ");
    },

    formatActorList(actorList) {
      return actorList
        .map((actor) => {
          if (actor.asCharacter) {
            return `<span class="text-primary" style="cursor: pointer" data-actor-id="${actor.id}">${actor.name}</span> as ${actor.asCharacter}`;
          } else {
            return `<span class="text-primary" style="cursor: pointer" data-actor-id="${actor.id}">${actor.name}</span>`;
          }
        })
        .join(", ");
    },

    getGenre(movie) {
      return movie.genreList.map((genre) => genre.value).join(", ");
    },

    formatDate(date) {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },

    formatRating(rating) {
      if (!rating) return "N/A";
      const formattedRatings = [];
      if (rating.filmAffinity)
        formattedRatings.push(`FilmAffinity: ${rating.filmAffinity}`);
      if (rating.imDb) formattedRatings.push(`IMDb: ${rating.imDb}`);
      if (rating.metacritic)
        formattedRatings.push(`Metacritic: ${rating.metacritic}`);
      if (rating.rottenTomatoes)
        formattedRatings.push(`Rotten Tomatoes: ${rating.rottenTomatoes}`);
      if (rating.theMovieDb)
        formattedRatings.push(`TheMovieDb: ${rating.theMovieDb}`);
      return formattedRatings.join(", ");
    },

    navigateToActor(actorId) {
      this.$emit("actor-selected", actorId);
    },

    handleActorClick(actorId) {
      if (actorId) {
        this.navigateToActor(actorId);
      }
    },
  },

  template: `
    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mt-4" role="alert">
      {{ error }}
    </div>

    <div v-if="!loading && !error && Object.keys(movie).length" class="card mt-4">
      <div class="row g-0">
        <div class="col-md-4">
          <img 
            :src="movie.image" 
            class="img-fluid rounded-start"
            :alt="movie.title || 'No Title'" 
            style="height: 100%; object-fit: cover;"
            @error="handleImageError"
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ movie.title }} ({{ movie.year }})</h5>
            <p class="card-text"><strong>Rating:</strong> {{ formatRating(movie.ratings) }}</p>
            <p class="card-text"><strong>Awards:</strong> {{ movie.awards }}</p>
            <p class="card-text"><strong>Genre:</strong> {{ getGenre(movie) }}</p>
            <p class="card-text"><strong>Release:</strong> {{ formatDate(movie.releaseDate) }}</p>
            <p class="card-text"><strong>Length:</strong> {{ movie.runtimeStr }}</p>
            <p class="card-text"><strong>Plot:</strong> {{ movie.plot }}</p>
            <p class="card-text"><strong>Director:</strong> {{ formatDirectorList(movie.directorList) }}</p>
            <p class="card-text"><strong>Company:</strong> {{ movie.companies }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="movie.actorList?.length" class="mt-4">
      <h5>Casts</h5>
      <div id="actorCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button 
            type="button" 
            v-for="(list, index) in actorlists" 
            :key="index" 
            data-bs-target="#actorCarousel" 
            :data-bs-slide-to="index" 
            :class="{ active: index === 0 }" 
            aria-current="index === 0 ? 'true' : undefined" 
            aria-label="'Slide ' + (index + 1)">
          </button>
        </div>

        <div class="carousel-inner">
          <div 
            v-for="(list, index) in actorlists" 
            :key="index" 
            class="carousel-item" 
            :class="{ active: index === 0 }">
            <div class="row justify-content-center">
              <div 
                v-for="actor in list" 
                :key="actor.id" 
                class="col-6 col-sm-4 col-md-3 col-lg-2 mb-3">
                <div 
                  class="card" 
                  style="cursor: pointer;" 
                  @click="handleActorClick(actor.id)"
                  style="height: 330px;">
                  <img 
                    :src="actor.image || 'placeholder.jpg'" 
                    class="card-img-top" 
                    :alt="actor.name" 
                    style="height: 200px;" 
                    @error="handleImageError">
                  <div class="card-body text-center d-flex align-items-center flex-column">
                    <h6 class="card-title text-primary">{{ actor.name }}</h6>
                    <p class="card-text" v-if="actor.asCharacter">as {{ actor.asCharacter }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          class="carousel-control-prev" 
          type="button" 
          data-bs-target="#actorCarousel" 
          data-bs-slide="prev"
          style="width: 32px">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button 
          class="carousel-control-next" 
          type="button" 
          data-bs-target="#actorCarousel" 
          data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>

    <div v-if="reviewsLoading" class="text-center mt-4">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading Reviews...</span>
      </div>
    </div>

    <div v-if="reviewsError" class="alert alert-warning mt-4" role="alert">
      {{ reviewsError }}
    </div>

    <div v-if="!reviewsLoading && reviews.length === 0">
      <div class="alert alert-info mt-4" role="alert">
        No reviews available for this movie.
      </div>
    </div>
    <div v-if="!reviewsLoading && reviews.length" class="mt-4">
      <h5>Reviews</h5>
      <ul class="list-group">
        <li v-for="review in paginatedReviews" :key="review.id" class="list-group-item">
          <p class="mb-0"><strong>{{ review.username }}: {{ review.title }}</strong></p>  
          <small class="text-muted">{{review.date}}</small>
          <p>{{ review.content }}</p>
        </li>
      </ul>

      <nav class="mt-3">
        <ul class="pagination justify-content-center">
          <li 
            class="page-item" 
            :class="{ disabled: currentPage === 1 }"
            @click="goToPage(currentPage - 1)"
          >
            <a class="page-link" href="javascript:void(0)">Previous</a>
          </li>
          <li 
            class="page-item"
            v-for="page in totalPages"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            <a class="page-link" href="javascript:void(0)">{{ page }}</a>
          </li>
          <li 
            class="page-item" 
            :class="{ disabled: currentPage === totalPages }"
            @click="goToPage(currentPage + 1)"
          >
            <a class="page-link" href="javascript:void(0)">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  `,
};
