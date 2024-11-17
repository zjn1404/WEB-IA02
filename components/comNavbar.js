export default {
  data() {
    return {
      searchTerm: "",
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
  },
  template: `
    <nav class="navbar mt-2 rounded app-navbar">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html"><p class="fa-solid fa-house mb-0"></p></a>
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
  `,
};
