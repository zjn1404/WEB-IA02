import comCarousel from "./comCarousel.js";
import comMovieSearch from "./comMovieSearch.js";
import comMovieDetail from "./comMovieDetail.js";
import comActorActressDetail from "./comActorActressDetail.js";

export default {
  components: {
    comCarousel,
    comMovieSearch,
    comMovieDetail,
    comActorActressDetail,
  },

  data() {
    return {
      searchTerm: null,
      selectedMovieId: null,
      selectedActorId: null,
    };
  },

  methods: {
    handleSearch(term) {
      this.searchTerm = term;
      this.selectedMovieId = null;
      selectedActorId = null;
    },

    handleMovieSelect(movieId) {
      this.selectedMovieId = movieId;
      this.searchTerm = null;
      console.log("Selected movie ID:", this.selectedMovieId);
    },

    handleActorSelect(actorId) {
      this.selectedActorId = actorId;
      this.selectedMovieId = null;
      this.searchTerm = null;
      console.log("Selected actor ID:", this.selectedActorId);
    },
  },

  template: `
    <div class="mt-2 mb-5">
      <com-carousel 
        v-if="!this.searchTerm && !this.selectedMovieId && !this.selectedActorId"
        @movie-selected="handleMovieSelect">
      </com-carousel>
      <com-movie-search 
        v-if="this.searchTerm && !this.selectedMovieId" 
        :searchTerm="searchTerm"
        @movie-selected="handleMovieSelect">
      </com-movie-search>
      <com-movie-detail 
        v-if="this.selectedMovieId"
        :movieId="this.selectedMovieId"
        @actor-selected="handleActorSelect">
      </com-movie-detail>
      <com-actor-actress-detail
        v-if="this.selectedActorId"
        :actorId="this.selectedActorId">
      </com-actor-actress-detail>
    </div>
  `,
};
