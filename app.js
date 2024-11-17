import comHeader from "./components/comHeader.js";
import comNavbar from "./components/comNavbar.js";
import comBody from "./components/comBody.js";
import comFooter from "./components/comFooter.js";

const app = Vue.createApp({
  components: {
    comHeader: comHeader,
    comNavbar: comNavbar,
    comBody: comBody,
    comFooter: comFooter,
  },

  data() {
    return {
      selectedMovieId: null,
    };
  },

  methods: {
    handleSearch(term) {
      this.$refs.body.handleSearch(term);
    },

    handleMovieNavigation(movieId) {
      this.selectedMovieId = movieId;
    },
  },
});

app.mount("#app");
