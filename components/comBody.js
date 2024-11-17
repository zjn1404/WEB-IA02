import comCarousel from "./comCarousel.js";
import comMovieSearch from "./comMovieSearch.js";
import comMovieDetail from "./comMovieDetail.js";

export default {
  components: {
    comCarousel,
    comMovieSearch,
    comMovieDetail,
  },

  data() {
    return {
      searchTerm: null,
      selectedMovieId: null,
    };
  },

  methods: {
    handleSearch(term) {
      this.searchTerm = term;
      this.selectedMovieId = null;
    },

    handleMovieSelect(movieId) {
      this.selectedMovieId = movieId;
      this.searchTerm = "";
      console.log("Selected movie ID:", this.selectedMovieId);
    },
  },

  template: `
    <div class="mt-2 mb-5">
      <com-carousel 
        v-if="!this.searchTerm && !this.selectedMovieId"
        @movie-selected="handleMovieSelect">
      </com-carousel>
      <com-movie-search 
        v-if="this.searchTerm && !this.selectedMovieId" 
        :searchTerm="searchTerm"
        @movie-selected="handleMovieSelect">
      </com-movie-search>
      <com-movie-detail 
        v-if="this.selectedMovieId"
        :movieId="this.selectedMovieId">
      </com-movie-detail>
    </div>
  `,
};
