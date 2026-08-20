$(document).ready(function () {

  // Task 1 — Quotes carousel
  $.getJSON("https://smileschool-api.hbtn.info/quotes", function (quotes) {
    let carouselHTML = "";

    for (let i = 0; i < quotes.length; i++) {
      const quote = quotes[i];
      const activeClass = i === 0 ? "active" : "";

      carouselHTML += `
        <div class="carousel-item ${activeClass}">
          <div class="row mx-auto align-items-center">
            <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
              <img src="${quote.pic_url}" class="d-block align-self-center" alt="Carousel Pic ${i + 1}" />
            </div>
            <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
              <div class="quote-text">
                <p class="text-white">« ${quote.text}</p>
                <h4 class="text-white font-weight-bold">${quote.name}</h4>
                <span class="text-white">${quote.title}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    $(".quotes .carousel-inner").html(carouselHTML);
  });

  // Generic slider function — reused for Popular and Latest
  function initSlider(trackId, prevBtnId, nextBtnId) {
    const $track = $("#" + trackId);
    const $prev = $("#" + prevBtnId);
    const $next = $("#" + nextBtnId);
    let currentIndex = 0;

    function getCardsPerView() {
      const width = $(window).width();
      if (width < 576) return 1;
      if (width < 992) return 2;
      return 4;
    }

    function slideTo(index) {
      const $cards = $track.children(".card");
      const cardWidth = $cards.outerWidth(true);
      const maxIndex = Math.max($cards.length - getCardsPerView(), 0);

      if (index < 0) index = 0;
      if (index > maxIndex) index = maxIndex;

      currentIndex = index;
      $track.css("transform", "translateX(" + -currentIndex * cardWidth + "px)");
    }

    $next.on("click", function (e) {
      e.preventDefault();
      slideTo(currentIndex + 1);
    });

    $prev.on("click", function (e) {
      e.preventDefault();
      slideTo(currentIndex - 1);
    });

    $(window).on("resize", function () {
      slideTo(currentIndex);
    });
  }

  // Helper — builds card HTML, shared by Popular and Latest (same object shape)
  function buildTutorialCardsHTML(tutorials) {
    let cardsHTML = "";

    for (let i = 0; i < tutorials.length; i++) {
      const tutorial = tutorials[i];
      let starsHTML = "";

      for (let s = 1; s <= 5; s++) {
        starsHTML +=
          s <= tutorial.star
            ? `<img src="images/star_on.png" alt="star on" width="15px" />`
            : `<img src="images/star_off.png" alt="star off" width="15px" />`;
      }

      cardsHTML += `
        <div class="card">
          <img src="${tutorial.thumb_url}" class="card-img-top" alt="Video thumbnail" />
          <div class="card-img-overlay text-center">
            <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay" />
          </div>
          <div class="card-body">
            <h5 class="card-title font-weight-bold">${tutorial.title}</h5>
            <p class="card-text text-muted">${tutorial["sub-title"]}</p>
            <div class="creator d-flex align-items-center">
              <img src="${tutorial.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle" />
              <h6 class="pl-3 m-0 main-color">${tutorial.author}</h6>
            </div>
            <div class="info pt-3 d-flex justify-content-between">
              <div class="rating">${starsHTML}</div>
              <span class="main-color">${tutorial.duration}</span>
            </div>
          </div>
        </div>
      `;
    }

    return cardsHTML;
  }

  // Task 2 — Popular tutorials
  $.getJSON("https://smileschool-api.hbtn.info/popular-tutorials", function (tutorials) {
    $("#popular-track").html(buildTutorialCardsHTML(tutorials));
    $(".popular .loader").hide();
    initSlider("popular-track", "popular-prev", "popular-next");
  });

  // Task 3 — Latest videos
  $.getJSON("https://smileschool-api.hbtn.info/latest-videos", function (videos) {
    $("#latest-track").html(buildTutorialCardsHTML(videos));
    $(".latest .loader").hide();
    initSlider("latest-track", "latest-prev", "latest-next");
  });

  // Task 5 — Courses page (dynamic search/topic/sort)
  if ($("#courses-results").length) {

    const $searchInput = $("#course-search");
    const $topicMenu = $("#topic-dropdown-menu");
    const $topicLabel = $("#topic-label");
    const $sortMenu = $("#sort-dropdown-menu");
    const $sortLabel = $("#sort-label");
    const $resultsContainer = $("#courses-results");
    const $videoCount = $(".video-count");
    const $coursesLoader = $(".results .loader");

    let currentQ = "";
    let currentTopic = "all";
    let currentSort = "most_popular";
    let searchTimeout;

    function formatLabel(value) {
      return value
        .split("_")
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }

    function buildCourseCardsHTML(courses) {
      let cardsHTML = "";

      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        let starsHTML = "";

        for (let s = 1; s <= 5; s++) {
          starsHTML +=
            s <= course.star
              ? `<img src="images/star_on.png" alt="star on" width="15px" />`
              : `<img src="images/star_off.png" alt="star off" width="15px" />`;
        }

        cardsHTML += `
          <div class="col-12 col-sm-4 col-lg-3 d-flex justify-content-center">
            <div class="card">
              <img src="${course.thumb_url}" class="card-img-top" alt="Video thumbnail" />
              <div class="card-img-overlay text-center">
                <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay" />
              </div>
              <div class="card-body">
                <h5 class="card-title font-weight-bold">${course.title}</h5>
                <p class="card-text text-muted">${course["sub-title"]}</p>
                <div class="creator d-flex align-items-center">
                  <img src="${course.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle" />
                  <h6 class="pl-3 m-0 main-color">${course.author}</h6>
                </div>
                <div class="info pt-3 d-flex justify-content-between">
                  <div class="rating">${starsHTML}</div>
                  <span class="main-color">${course.duration}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      return cardsHTML;
    }

    function fetchCourses(q, topic, sort) {
      $coursesLoader.show();

      $.ajax({
        url: "https://smileschool-api.hbtn.info/courses",
        data: { q: q, topic: topic, sort: sort },
        dataType: "json",
        success: function (response) {
          $resultsContainer.html(buildCourseCardsHTML(response.courses));
          $videoCount.text(response.courses.length + " videos");
          $coursesLoader.hide();
        },
        error: function () {
          $coursesLoader.hide();
        }
      });
    }

    function buildDropdown($menu, $label, values, currentValue, onSelect) {
      let itemsHTML = "";

      for (let i = 0; i < values.length; i++) {
        itemsHTML += `<a class="dropdown-item" href="#" data-value="${values[i]}">${formatLabel(values[i])}</a>`;
      }

      $menu.html(itemsHTML);
      $label.text(formatLabel(currentValue));

      $menu.find(".dropdown-item").on("click", function (e) {
        e.preventDefault();
        const selectedValue = $(this).data("value");
        $label.text(formatLabel(selectedValue));
        onSelect(selectedValue);
      });
    }

    // Initial load — populates dropdowns from the API's own topic/sort lists
    $.ajax({
      url: "https://smileschool-api.hbtn.info/courses",
      dataType: "json",
      success: function (response) {
        currentQ = response.q;
        currentTopic = response.topic;
        currentSort = response.sort;

        $searchInput.val(currentQ);

        buildDropdown($topicMenu, $topicLabel, response.topics, currentTopic, function (value) {
          currentTopic = value;
          fetchCourses(currentQ, currentTopic, currentSort);
        });

        buildDropdown($sortMenu, $sortLabel, response.sorts, currentSort, function (value) {
          currentSort = value;
          fetchCourses(currentQ, currentTopic, currentSort);
        });

        $resultsContainer.html(buildCourseCardsHTML(response.courses));
        $videoCount.text(response.courses.length + " videos");
        $coursesLoader.hide();
      }
    });

    $searchInput.on("input", function () {
      currentQ = $(this).val();
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function () {
        fetchCourses(currentQ, currentTopic, currentSort);
      }, 400);
    });
  }

});
