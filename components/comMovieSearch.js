import { fetchFromUrl } from "../dbProvider.js";
import { TYPE, CLASS } from "../apiComponents.js";

export default {
  props: {
    searchTerm: "",
  },

  data() {
    return {
      movies: [],
      loading: false,
      error: null,
      fallbackImage:
        "https://via.placeholder.com/400x600?text=No+Image+Available",
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 12,
    };
  },

  watch: {
    searchTerm: {
      handler(newVal) {
        this.currentPage = 1;
        this.handleSearch();
      },
      immediate: true,
    },
  },

  computed: {
    paginationRange() {
      const range = [];
      const showPages = 5;
      let start = Math.max(1, this.currentPage - Math.floor(showPages / 2));
      let end = Math.min(this.totalPages, start + showPages - 1);

      if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1);
      }

      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    },

    showPagination() {
      return this.totalPages > 1 && !this.loading && this.movies.length > 0;
    },
  },

  methods: {
    async handleSearch() {
      let term = String(this.searchTerm).trim();
      if (term === "[object Event]") term = null;
      if (!term) {
        this.movies = [];
        this.totalPages = 0;
        this.totalItems = 0;
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const url = `${TYPE.SEARCH}/${CLASS.MOVIE}/${term}?page=${this.currentPage}&per_page=${this.itemsPerPage}`;
        const response = await fetchFromUrl(url);
        this.movies = response.items;
        this.totalPages = response.total_page;
        this.totalItems = response.total;
      } catch (err) {
        this.error = "Failed to fetch movies. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    getGenre(movie) {
      return (
        "[ " + movie.genreList.map((genre) => genre.value).join(", ") + " ]"
      );
    },

    handleImageError(event) {
      event.target.src = this.fallbackImage;
    },

    async changePage(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage)
        return;
      this.currentPage = page;
      await this.handleSearch();
      this.$el.scrollIntoView({ behavior: "smooth" });
    },

    navigateToMovie(movieId) {
      this.$emit("navigate", movieId);
    },
  },

  template: `
    <div v-if="searchTerm" class="container mt-4">
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-if="!loading && movies.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="movie in movies" :key="movie.id" class="col">
          <div class="card h-100" style="cursor: pointer;" @click="navigateToMovie(movie.id)">
            <img 
              :src="movie.image" 
              class="card-img-top"
              :alt="movie.title || 'No Title'" 
              style="height: 400px; object-fit: cover;"
              @error="handleImageError"
            />
            <div class="card-body d-flex align-items-center">
              <div style="width: 100%">
                <div class="d-flex justify-content-center align-items-center mb-2">
                  <h5 class="card-title mb-0">{{ movie.fullTitle }}</h5>
                </div>

                <div class="mb-2 d-flex justify-content-center align-items-center">
                  <p>{{ getGenre(movie) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav v-if="showPagination" class="mt-4" aria-label="Movie search results pages">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
              Previous
            </button>
          </li>

          <li v-if="paginationRange[0] > 1" class="page-item">
            <button class="page-link" @click="changePage(1)">1</button>
          </li>
          
          <li v-if="paginationRange[0] > 2" class="page-item disabled">
            <span class="page-link">...</span>
          </li>

          <li v-for="page in paginationRange" :key="page" class="page-item" :class="{ active: page === currentPage }">
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>

          <li v-if="paginationRange[paginationRange.length - 1] < totalPages - 1" class="page-item disabled">
            <span class="page-link">...</span>
          </li>

          <li v-if="paginationRange[paginationRange.length - 1] < totalPages" class="page-item">
            <button class="page-link" @click="changePage(totalPages)">{{ totalPages }}</button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
              Next
            </button>
          </li>
        </ul>

        <div class="text-center mt-2">
          <small class="text-muted">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} - 
            {{ Math.min(currentPage * itemsPerPage, totalItems) }} 
            of {{ totalItems }} results
          </small>
        </div>
      </nav>

      <div v-if="!loading && !movies.length" class="alert alert-info" role="alert">
        No movies found for "{{ searchTerm }}"
      </div>
    </div>
  `,
};
