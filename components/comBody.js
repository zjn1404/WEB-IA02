export default {
  template: `
  <div class="mt-2 mb-5">
    <div id="carouselExampleDark" class="carousel carousel-dark slide mb-4 carousel-fade">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="10000">
          <div class="d-flex justify-content-center" style="width: 100%">
            <img src="./assets/p1.png" class="d-block carousel-img" alt="...">
          </div>
          <div class="carousel-caption d-none d-md-block">
            <h3>Movie's name</h3>
            <p>[Description]</p>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="2000">
          <div class="d-flex justify-content-center" style="width: 100%">
            <img src="./assets/p2.png" class="d-block carousel-img" alt="...">
          </div>
          <div class="carousel-caption d-none d-md-block">
            <h3>Movie's name</h3>
            <p>[Description]</p>
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
          type="button" 
          data-bs-target="#carouselExampleRide" 
          data-bs-slide-to="0" 
          class="carousel-indicator" 
          :class="{'active': activeIndex === index}"
          @click="setActiveIndex(index)"
          aria-current="true" 
          aria-label="Slide 1">
        </button>
        <button 
          type="button" 
          data-bs-target="#carouselExampleRide" 
          data-bs-slide-to="1" 
          class="carousel-indicator" 
          :class="{'active': activeIndex === index}"
          @click="setActiveIndex(index)"
          aria-label="Slide 2">
        </button>
        <button 
          type="button" 
          data-bs-target="#carouselExampleRide" 
          data-bs-slide-to="2" 
          class="carousel-indicator" 
          :class="{'active': activeIndex === index}"
          @click="setActiveIndex(index)"
          aria-label="Slide 3">
        </button>
      </div>
    </div>

    <div id="carouselExampleRide" class="carousel slide mb-5" data-bs-ride="true">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <div class="d-flex justify-content-center" style="width: 100%">
            <img src="./assets/p1.png" class="carousel-most-popular-img custom-hover-img" alt="...">
            <img src="./assets/p2.png" class="carousel-most-popular-img custom-hover-img" alt="...">
            <img src="./assets/p2.png" class="carousel-most-popular-img custom-hover-img" alt="...">
          </div>
        </div>
        <div class="carousel-item">
          <div class="d-flex justify-content-center" style="width: 100%">
            <img src="./assets/p1.png" class="carousel-most-popular-img custom-hover-img" alt="...">
            <img src="./assets/p2.png" class="carousel-most-popular-img custom-hover-img" alt="...">
            <img src="./assets/p2.png" class="carousel-most-popular-img custom-hover-img" alt="...">
          </div>
        </div>
        <div class="carousel-item">
          <div class="d-flex justify-content-center" style="width: 100%">
            <img src="./assets/p2.png" class="carousel-most-popular-img custom-hover-img" alt="...">
            <img src="./assets/p2.png" class="carousel-most-popular-img custom-hover-img" alt="...">
            <img src="./assets/p2.png" class="carousel-most-popular-img custom-hover-img" alt="...">
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
          type="button" 
          data-bs-target="#carouselTopRating" 
          data-bs-slide-to="0" 
          class="carousel-indicator" 
          :class="{'active': activeIndex === index}"
          @click="setActiveIndex(index)"
          aria-current="true" 
          aria-label="Slide 1">
        </button>
        <button 
          type="button" 
          data-bs-target="#carouselTopRating" 
          data-bs-slide-to="1" 
          class="carousel-indicator" 
          :class="{'active': activeIndex === index}"
          @click="setActiveIndex(index)"
          aria-label="Slide 2">
        </button>
        <button 
          type="button" 
          data-bs-target="#carouselTopRating" 
          data-bs-slide-to="2" 
          class="carousel-indicator" 
          :class="{'active': activeIndex === index}"
          @click="setActiveIndex(index)"
          aria-label="Slide 3">
        </button>
      </div>
    </div>

    <div id="carouselTopRating" class="carousel slide" data-bs-ride="true">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <div class="d-flex justify-content-center" style="width: 100%">
            <img src="./assets/p1.png" class="carousel-most-rating-img custom-hover-img" alt="...">
            <img src="./assets/p2.png" class="carousel-most-rating-img custom-hover-img" alt="...">
            <img src="./assets/p2.png" class="carousel-most-rating-img custom-hover-img" alt="...">
          </div>
        </div>
        <div class="carousel-item">
          <div class="d-flex justify-content-center" style="width: 100%">
            <img src="./assets/p1.png" class="carousel-most-rating-img custom-hover-img" alt="...">
            <img src="./assets/p2.png" class="carousel-most-rating-img custom-hover-img" alt="...">
            <img src="./assets/p2.png" class="carousel-most-rating-img custom-hover-img" alt="...">
          </div>
        </div>
        <div class="carousel-item">
          <div class="d-flex justify-content-center" style="width: 100%">
            <img src="./assets/p2.png" class="carousel-most-rating-img custom-hover-img" alt="...">
            <img src="./assets/p2.png" class="carousel-most-rating-img" custom-hover-img alt="...">
            <img src="./assets/p2.png" class="carousel-most-rating-img custom-hover-img" alt="...">
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselTopRating" data-bs-slide="prev" style="width: 32px">
        <span class="carousel-control-prev-icon mt-5" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselTopRating" data-bs-slide="next" style="width: 32px">
        <span class="carousel-control-next-icon mt-5" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
  `,
};
