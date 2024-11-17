import comCarousel from "./comCarousel.js";
import comMovieSearch from "./comMovieSearch.js";

export default {
  components: {
    comCarousel,
    comMovieSearch,
  },

  data() {
    return {
      searchTerm: "",
    };
  },

  methods: {
    handleSearch(term) {
      this.searchTerm = term;
    },
  },

  template: `
    <div class="mt-2 mb-5">
      <com-carousel v-if="!searchTerm"></com-carousel>
      <com-movie-search v-if="searchTerm" :searchTerm="searchTerm"></com-movie-search>
    </div>
  `,
};
