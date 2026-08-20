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

$.getJSON("https://smileschool-api.hbtn.info/popular-tutorials", function (tutorials) {
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

  $("#popular-track").html(cardsHTML);
  $(".popular .loader").hide();
  initSlider("popular-track", "popular-prev", "popular-next");
});