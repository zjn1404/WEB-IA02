export default {
  data() {
    return {
      searchTerm: "",
      loading: false,
    };
  },
  methods: {
    handleSearch(e) {
      if (!this.searchTerm.trim()) return;
      this.$emit("search", this.searchTerm);
    },
    handleKeyup(event) {
      event.preventDefault();
      this.handleSearch();
    },
    displaySpinner() {
      this.loading = true;
      setTimeout(() => {
        window.location.href = "index.html";
        const currentTheme = localStorage.getItem("currentTheme");
        document.getElementById("app").setAttribute("data-bs-theme", currentTheme);
      }, 500);
    },
  },
  template: `
    <nav class="navbar mt-2 rounded app-navbar">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html" @click.prevent="displaySpinner">
          <p class="fa-solid fa-house mb-0"></p>
        </a>
        <form class="d-flex" role="search" @submit.prevent="handleSearch">
          <input 
            class="form-control me-2" 
            type="search" 
            v-model="searchTerm"
            placeholder="Search" 
            aria-label="Search"
            @keyup.enter="handleKeyup"
          >
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </nav>
    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `,
};
