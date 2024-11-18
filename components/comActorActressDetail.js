import { fetchFromUrl } from "../dbProvider.js";
import { TYPE, CLASS } from "../apiComponents.js";

export default {
  props: {
    actorId: String,
  },

  data() {
    return {
      actor: null,
      movies: [],
      loading: false,
      error: null,
      fallbackImage:
        "https://via.placeholder.com/400x600?text=No+Image+Available",
    };
  },

  async created() {
    await this.fetchActorDetails();
    await this.fetchMovieDetails();
  },

  methods: {
    async fetchActorDetails() {
      this.loading = true;
      this.error = null;

      try {
        const url = `${TYPE.DETAIL}/${CLASS.NAME}/${this.actorId}`;
        const response = await fetchFromUrl(url);
        this.actor = response.item;
        console.log(this.actor);
      } catch (err) {
        this.error = "Failed to fetch actor details. Please try again.";
        console.error("Error fetching actor details:", err);
      } finally {
        this.loading = false;
      }
    },

    async fetchMovieDetails() {
      this.loading = true;
      this.error = null;
      if (this.actor) {
        try {
          const url = `${TYPE.SEARCH}/${CLASS.MOVIE}/${this.actor.name}`;
          const response = await fetchFromUrl(url);
          console.log(response);
          this.movies = response.items;
        } catch (err) {
          this.error = "Failed to fetch movie details. Please try again.";
          console.error("Error fetching movie details:", err);
        } finally {
          this.loading = false;
        }
      }

      this.loading = false;
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

    getGenre(movie) {
      return movie.genreList.map((genre) => genre.value).join(", ");
    },

    navigateToMovie(movieId) {
      this.$emit("movie-selected", movieId);
    },
  },

  template: `
    <div class="container mt-4">
      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-if="!loading && !actor">
        <div class="alert alert-info mt-4" role="alert">
          Actor not found. Please try again.
        </div>
      </div>

      <div v-if="!loading && actor" class="card mb-4 shadow-sm">
        <div class="row g-0">
          <div class="col-md-4">
            <img
              class="img-fluid rounded-start"
              :src="actor.image || fallbackImage"
              :alt="actor.name"
              @error="this.src = fallbackImage"
              style="height: 100%; object-fit: cover;"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h3 class="card-title">{{ actor.name }}</h3>
              <p class="card-text">
                <strong>Birthdate:</strong> {{ formatDate(actor.birthDate) || 'Unknown' }}
              </p>
              <p class="card-text">
                <strong>Death:</strong> {{ formatDate(actor.deathDate) || 'Unknown' }}
              </p>
              <p class="card-text">
                <strong>Awards:</strong> {{ actor.awards || 'None' }}
              </p>
              <p class="card-text">
                <strong>Role:</strong> {{ actor.role || 'Unknown' }}
              </p>
              <p class="card-text">
                <strong>Biography:</strong> {{ actor.summary || 'No biography available' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && actor && movies.length" class="mt-4">
        <h4>Cast Movies</h4>
        <ul class="list-group">
          <li
            v-for="movie in movies"
            :key="movie.id"
            class="list-group-item"
            style="cursor: pointer;"
            @click="navigateToMovie(movie.id)"
          >
            <h5>{{movie.fullTitle}}</h5>
            <p class="card-text"><strong>Rating:</strong> {{ formatRating(movie.ratings) }}</p>
            <p class="card-text"><strong>Genre:</strong> {{ getGenre(movie) }}</p>
            <p class="card-text"><strong>Plot:</strong> {{ movie.plot }}</p>
          </li>
        </ul>
      </div>
      <div v-if="!loading && actor && movies.length === 0" class="alert alert-info mt-4">
        No movies available for this actor.
      </div>
    </div>
  `,
};
