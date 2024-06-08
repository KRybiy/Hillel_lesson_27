(function () {
  const container = document.querySelector('#carousel');
  const slides = container.querySelectorAll('.slide');
  const slidesContainer = container.querySelector('#slides-container')
  const indicatorsContainer = container.querySelector('#indicators-container')
  const indicatorItems = container.querySelectorAll('.indicator')
  const pauseBtn = container.querySelector('#pause-btn');
  const nextBtn = container.querySelector('#next-btn')
  const prevBtn = container.querySelector('#prev-btn')

  const SLIDES_COUNT = slides.length;
  const INTERVAL = 2000;
  const CODE_SPACE = 'Space';
  const CODE_ARROW_LEFT = 'ArrowLeft';
  const CODE_ARROW_RIGHT = 'ArrowRight';
  const FA_PAUSE = '<i class="fa-solid fa-circle-pause"></i>';
  const FA_PLAY = '<i class="fa-solid fa-circle-play"></i>';

  let currentSlide = 0;
  let isPlaying = true;
  let timerId = null;
  let startPosX = null;
  let endPosX = null;


  function goToNth(n) {
    slides[currentSlide].classList.toggle('active')
    indicatorItems[currentSlide].classList.toggle('active')
    currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT
    slides[currentSlide].classList.toggle('active')
    indicatorItems[currentSlide].classList.toggle('active')
  }

  function gotoNext() {
    goToNth(currentSlide + 1)
  }

  function gotoPrev() {
    goToNth(currentSlide - 1)
  }

  function pauseHandler() {
    if (!this.isPlaying) return
    isPlaying = false;
    clearInterval(timerId)
    pauseBtn.innerHTML = FA_PLAY;
  }

  function tick() {
    timerId = setInterval(gotoNext, INTERVAL)
  }

  function playHandler() {
    if (this.isPlaying) return
    isPlaying = true;
    tick();
    pauseBtn.innerHTML = FA_PAUSE;
  }

  function pausePlayHandler() {
    isPlaying ? pauseHandler() : playHandler()
    }

  function nextHandler() {
    pauseHandler()
    gotoNext()
  }

  function prevHandler() {
    pauseHandler();
    gotoPrev()
  }

  function indicateHandler(e) {
    const { target } = e;
    if (target.classList.contains('indicator')) {
      pauseHandler()
      goToNth(+target.dataset.slideTo)
    }
  }

  function pressKey(e) {
    const { code } = e;
    if (code === CODE_SPACE) pausePlayHandler();
    if (code === CODE_ARROW_LEFT) prevHandler();
    if (code === CODE_ARROW_RIGHT) nextHandler();
  }

  function swipeStartHandler(e) {
    e.preventDefault(); 
    startPosX = e instanceof MouseEvent 
      ? e.pageX 
      : e.changedTouches[0].pageX // touchEvent
  }

  function swipeEndHandler(e) {
    endPosX = e instanceof MouseEvent 
    ? e.pageX 
    : e.changedTouches[0].pageX // touchEvent

    if (endPosX - startPosX >100) prevHandler()
    if (endPosX - startPosX <-100) nextHandler()
  }

  function initListeners() {
    pauseBtn.addEventListener('click', pausePlayHandler)
    nextBtn.addEventListener('click', nextHandler)
    prevBtn.addEventListener('click', prevHandler)
    indicatorsContainer.addEventListener('click', indicateHandler)
    slidesContainer.addEventListener('mousedown', swipeStartHandler)
    slidesContainer.addEventListener('mouseup', swipeEndHandler)
    slidesContainer.addEventListener('touchstart', swipeStartHandler)
    slidesContainer.addEventListener('touchend', swipeEndHandler)
    document.addEventListener('keydown', pressKey)
  }

  function init() {
    initListeners()
    tick();
  }

  init()
} ())
