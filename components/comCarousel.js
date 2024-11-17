import { fetchFromUrl } from "../dbProvider.js";
import { TYPE, CLASS } from "../apiComponents.js";

export default {
  data() {
    return {
      topRevenue: [],
      mostPopular: [],
      topRated: [],
      activePopularIndex: 0,
      activeRatingIndex: 0,
      activeRevenueIndex: 0,
      itemsPerSlide: 3,
    };
  },

  async created() {
    try {
      const revenueUrl = `${TYPE.GET}/${CLASS.MOVIE}`;
      this.topRevenue = await fetchFromUrl(revenueUrl).then((response) => {
        return response.items
          .sort((a, b) => {
            let revenueA =
              (a.boxOffice?.openingWeekendUSA || 0) +
              (a.boxOffice?.grossUSA || 0) +
              (a.boxOffice?.grossWorldwide || 0) -
              (a.boxOffice?.budget || 0);
            let revenueB =
              (b.boxOffice?.openingWeekendUSA || 0) +
              (b.boxOffice?.grossUSA || 0) +
              (b.boxOffice?.grossWorldwide || 0) -
              (b.boxOffice?.budget || 0);
            return revenueB - revenueA;
          })
          .slice(0, 5);
      });

      const popularUrl = `${TYPE.GET}/${CLASS.MOST_POPULAR}?per_page=15`;
      this.mostPopular = await fetchFromUrl(popularUrl).then((response) => {
        return response.items;
      });

      const ratedUrl = `${TYPE.GET}/${CLASS.TOP50}?per_page=15`;
      this.topRated = await fetchFromUrl(ratedUrl).then((response) => {
        return response.items;
      });

      this.$nextTick(() => {
        const revenueCarousel = document.querySelector("#carouselExampleDark");
        const popularCarousel = document.querySelector("#carouselExampleRide");
        const ratingCarousel = document.querySelector("#carouselTopRating");

        revenueCarousel.addEventListener("slid.bs.carousel", (event) => {
          this.setActiveRevenueIndex(event.to);
        });

        popularCarousel.addEventListener("slid.bs.carousel", (event) => {
          this.setActivePopularIndex(event.to);
        });

        ratingCarousel.addEventListener("slid.bs.carousel", (event) => {
          this.setActiveRatingIndex(event.to);
        });
      });
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  },

  computed: {
    popularSlides() {
      return this.createSlides(this.mostPopular);
    },
    ratingSlides() {
      return this.createSlides(this.topRated);
    },
    revenueIndicators() {
      return Array.from({ length: this.topRevenue.length }, (_, i) => i);
    },
    popularIndicators() {
      return Array.from({ length: this.popularSlides.length }, (_, i) => i);
    },
    ratingIndicators() {
      return Array.from({ length: this.ratingSlides.length }, (_, i) => i);
    },
  },

  methods: {
    createSlides(movies) {
      const slides = [];
      for (let i = 0; i < movies.length; i += this.itemsPerSlide) {
        slides.push(movies.slice(i, i + this.itemsPerSlide));
      }
      return slides;
    },

    getGenre(movie) {
      return (
        "[ " + movie.genreList.map((genre) => genre.value).join(", ") + " ]"
      );
    },

    setActiveRevenueIndex(index) {
      this.activeRevenueIndex = index;
    },

    setActivePopularIndex(index) {
      this.activePopularIndex = index;
    },

    setActiveRatingIndex(index) {
      this.activeRatingIndex = index;
    },

    isSlideActive(index, type) {
      switch (type) {
        case "revenue":
          return this.activeRevenueIndex === index;
        case "popular":
          return this.activePopularIndex === index;
        case "rating":
          return this.activeRatingIndex === index;
        default:
          return false;
      }
    },

    navigateToMovie(movieId) {
      this.$emit("movie-selected", movieId);
    },
  },

  template: `
    <div id="carouselExampleDark" class="carousel carousel-dark slide mb-4 carousel-fade">
      <div class="carousel-indicators">
        <button 
          v-for="index in revenueIndicators"
          :key="'revenue-indicator-' + index"
          type="button"
          data-bs-target="#carouselExampleDark"
          :data-bs-slide-to="index"
          class="carousel-indicator"
          :class="{ active: isSlideActive(index, 'revenue') }"
          @click="setActiveRevenueIndex(index)"
          :aria-current="index === 0"
          :aria-label="'Slide ' + (index + 1)">
        </button>
      </div>
      <div class="carousel-inner">
        <div 
          v-for="(movie, index) in topRevenue"
          :key="'revenue-slide-' + index"
          class="carousel-item"
          :class="{ active: isSlideActive(index, 'revenue') }"
          data-bs-interval="10000">
            <div style="cursor: pointer;" @click="navigateToMovie(movie.id)">
              <div class="d-flex justify-content-center" style="width: 100%">
                <img :src="movie.image" class="d-block carousel-img" :alt="movie.title">
              </div>
              <div class="carousel-caption d-none d-md-block">
                <h3>{{ movie.fullTitle }}</h3>
                <p>{{ getGenre(movie) }}</p>
              </div>
            </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-2">
      <h4 class="m-0">Most Popular</h4>
      <div class="d-flex gap-2">
        <button 
          v-for="index in popularIndicators"
          :key="'popular-indicator-' + index"
          type="button"
          data-bs-target="#carouselExampleRide"
          :data-bs-slide-to="index"
          class="carousel-indicator"
          :class="{ active: isSlideActive(index, 'popular') }"
          @click="setActivePopularIndex(index)"
          :aria-current="index === 0"
          :aria-label="'Slide ' + (index + 1)">
        </button>
      </div>
    </div>

    <div id="carouselExampleRide" class="carousel slide mb-5" data-bs-ride="true">
      <div class="carousel-inner">
        <div 
          v-for="(slide, slideIndex) in popularSlides"
          :key="'popular-slide-' + slideIndex"
          class="carousel-item"
          :class="{ active: isSlideActive(slideIndex, 'popular') }">
          <div class="d-flex justify-content-center">
            <div v-for="(movie, movieIndex) in slide" style="width: 100%; cursor:pointer;" @click="navigateToMovie(movie.id)">
              <img 
                :key="'popular-movie-' + movieIndex"
                :src="movie.image"
                class="carousel-most-popular-img custom-hover-img"
                :alt="movie.title">
            </div>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev" style="width: 32px">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next" style="width: 32px">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-2">
      <h4 class="m-0">Top Rating</h4>
      <div class="d-flex gap-2">
        <button 
          v-for="index in ratingIndicators"
          :key="'rating-indicator-' + index"
          type="button"
          data-bs-target="#carouselTopRating"
          :data-bs-slide-to="index"
          class="carousel-indicator"
          :class="{ active: isSlideActive(index, 'rating') }"
          @click="setActiveRatingIndex(index)"
          :aria-current="index === 0"
          :aria-label="'Slide ' + (index + 1)">
        </button>
      </div>
    </div>

    <div id="carouselTopRating" class="carousel slide" data-bs-ride="true">
      <div class="carousel-inner">
        <div 
          v-for="(slide, slideIndex) in ratingSlides"
          :key="'rating-slide-' + slideIndex"
          class="carousel-item"
          :class="{ active: isSlideActive(slideIndex, 'rating') }">
          <div class="d-flex justify-content-center">
            <div v-for="(movie, movieIndex) in slide"  style="width: 100%; cursor: pointer;" @click="navigateToMovie(movie.id)">
              <img 
                :key="'rating-movie-' + movieIndex"
                :src="movie.image"
                class="carousel-most-rating-img custom-hover-img"
                :alt="movie.title">
            </div>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselTopRating" data-bs-slide="prev" style="width: 32px">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselTopRating" data-bs-slide="next" style="width: 32px">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `,
};
