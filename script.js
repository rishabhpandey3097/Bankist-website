'use strict';

// Selectors

const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnUpArrow = document.querySelector('#up-arrow');

const headerSection = document.querySelector('.header');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

///////////////////////////////////////
//1. Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////////
//2. Page Navigation

// querySelectorAll returns an array

document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();

    //'this' is pointing towards the current element in the array
    const id = this.getAttribute('href');
    console.log(id);

    //Syntax
    // sectionYouWantToScroll.scrollIntoView({behanior: 'smooth'})
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});

// Event Delegation techinique // It is an efficient one to use // increases performance
// So what we doing here is instead of adding eventListener to all nav__link, we actually attaching eventListner to the parent element(nav__links) which will then propagate to child elements(nav__link)

// 1. Add event listener to common parent element(nav__links)
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching startegy
  if (e.target.classList.contains('nav__link')) {
    console.log(e.target);

    const id = e.target.getAttribute('href'); // section--1/2/3
    document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
  }
});
////////////////////// ////////////////
//Smooth scrolling

//section--1 cordinates = section1.getBoundingClientRect()

btnScrollTo.addEventListener('click', function (e) {
  //defining the current coordinates of the section--1
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords); // we need JS to know that it should scroll to this coordinates on btn click

  //Method (3). Modern and easy way of smooth scrolling // definately use this
  section1.scrollIntoView({ behavior: 'smooth' });
});

btnUpArrow.addEventListener('click', function () {
  const hcoords = headerSection.getBoundingClientRect();
  console.log(hcoords);

  //smooth scroll to header
  headerSection.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////////////////////////////
//3. Tabbed Components

// Applying event delegation method
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //Guard Clause // It will return null if tabs__conatiner id clicked instead of buttons
  if (!clicked) return;

  //removing active class to all tabs
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  //adding active tag to clicked tab
  clicked.classList.add('operations__tab--active');

  //remove active content class from unclicked tabs
  tabsContent.forEach(function (remov) {
    remov.classList.remove('operations__content--active');
  });

  //Activate the tabs content
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////
// Menu fade animation

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // console.log('mouseover', siblings);
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(function (el) {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
//Note: mouseenter event do not bubble
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

//////////////////////////////////////
//Sticky Navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
//////////////////////////////////////////////////////////////////////
//Revealing Elements on scroll: Intersection Observer API

const allSections = document.querySelectorAll('.section');
// console.log(allSections);

const revealSection = function (entries, observer) {
  const [entry] = entries; // only one threshold is there
  // console.log(entry);

  //Guard Clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  // console.log(entry.target);
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null, // null: Entire viewport
  threshold: 0.15, // when intersecting 15% of section
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

////////////////////////////////////////////////////////////////
// Lazy Loading: Intersection Observer API

const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);
const loadImage = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry.target);

  // Guard Clause
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function (e) {
    e.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(image => {
  imgObserver.observe(image);
});

/////////////////////////////////////////////////////////////////
// Slider Component
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
