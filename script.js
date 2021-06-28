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

////////////////// Lectures

// ------------------- Lecture: 01 Selecting, Creating and deleting the Elements -------------------- //
// // Selecting Elements
// console.log(document.documentElement); // Entire HTML
// console.log(document.head); // Entire HTML Head
// console.log(document.body); // Entire HTML Body

// const header = document.querySelector('.header');
// const allSection = document.querySelectorAll('.section');
// console.log(allSection); // nodelist of all section in the HTML

// console.log(document.getElementById('section--1'));

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons); // HTML collection all Button elements present in HTML document

// console.log(document.getElementsByClassName('btn'));

// //Creating and Inserting Elements
// //1. 'element.insertAdjacetHTML('afterbegin/beforestart/afterstart/beforebegin', html)' //Already used this method in citizen bank app

// //2. creating html element
// //(A) creating element
// const message = document.createElement('div');
// //(B) adding classname to element
// message.classList.add('cookie-message');
// // message.textContent = ('We use cookies to improve functionality and analytics');

// //(C) putting HTML inside created element
// message.innerHTML =
//   'We use cookies to improve functionality and analytics. <button class= "btn btn-close-cookie"> Got it! </button>';

// // (D) adding element to actual DOM
// // Life elements are same as a living person. It cannot be present at two places simutaneously
// // message be either present as the first element or as the last child
// // header.prepend(message); // Adding element as the first child of header element
// header.append(message); // adding element as the last child of header element

// // Important :  But if need the message to be present at two places at the same time... for that we need to use
// //"element.cloneNode(true)" method
// // header.append(message.cloneNode(true));

// //3. before and after methods
// // header.before(message);
// // header.after(message);

// // 4. Delete elements // task:- delete the cookie message
// const closeCookieMessage = document.querySelector('.btn-close-cookie');
// closeCookieMessage.addEventListener('click', function () {
//   message.remove();
// });

// // ---------------------- Lecture: 02 Style Attribute and Classes --------------------------------
// //Styles

// message.style.backgroundColor = '#37383d';
// message.style.width = '100%';
// closeCookieMessage.style.margin = '10px 0';

// console.log(message.style.height); // empty
// console.log(message.style.backgroundColor); // rgb(55, 56, 61)

// // console.log(getComputedStyle(message)); // this will show all the css active on the message element (hardcodded and browser implemented styles both)
// console.log(getComputedStyle(message).color); //rgb(187, 187, 187)
// console.log(getComputedStyle(message).height); //70px

// // Accessing the css variables declared in root i.e nothing but documentElement

// document.documentElement.style.setProperty('--color-primary', '#add8e6');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);
// console.log(logo.id);

// //reassigning attributes
// logo.alt = 'Beutiful bank logo';

// // Non-standard
// console.log(logo.designer);
// //----------------------------
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.twitter-link');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // data attribute
// console.log(logo.dataset.versionNumber);

// //Classes
// logo.classList.add('c', 'j'); //passing multiple classes
// logo.classList.remove('c', 'j'); //detelting classes
// logo.classList.toggle('c');
// logo.classList.contains('c'); // not includes

// // Don't use //it will override all the existing classes and it will let us add only one class at a time
// logo.clasName = 'jonas';

//-------------- Lecture: 03 Types of event Listeners -----------------------
//1. click event // already know this

//2. mouseenter // simply hover event

// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('You are hovering over a h1 element');

//   //removing the eventListener
//   setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 5000);
// };

// h1.addEventListener('mouseenter', alertH1);

// ---------------- Lecture: 04 Event Propogation: Bubbling and Capturing ----------------
// Event Capturing: Events will be fired from top to bottom
// Event Bubbling: Events will be fired from bottom to top // Default behaviour

// Event bubbling in action

// To activate Event capturing pass third argument of eventListener 'true' // by default it is set to false
// to stop the propagation just add event.stopPropagation()

// event.target tells us which event is fired first
//event.currentTraget tells us currently fired event
// const randomInt = function (min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };

// const randomColor = function () {
//   return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// };
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('child element triggred', e.target, e.currentTarget);
//     console.log(e.currentTarget === this);
//     // to stop propagation
//     // e.stopPropagation();
//   },
//   false
// );

// document.querySelector('.nav__links').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('parent element triggred', e.target, e.currentTarget);
//   },
//   false
// );

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('great parent triggred', e.target, e.currentTarget);
//   },
//   false
// );

// ---------------- Lecture: 05 DOM Traversing -------------------
///////////////////////////////////////
// DOM Traversing
// const h1 = document.querySelector('h1');

// // Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// ***=========================== REVISION ===================================***
/*
// Selectors
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnUpArrow = document.querySelector('#up-arrow');

const headerSection = document.querySelector('.header');
const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');

//1. Smooth Page navigation
// Event Delegation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    // Scroll Into View
    document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
  }
});

btnUpArrow.addEventListener('click', function (e) {
  e.preventDefault();

  headerSection.scrollIntoView({ behavior: 'smooth' });
});

//2. Btn Scroll

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();

  section1.scrollIntoView({ behavior: 'smooth' });
});

//3. Sticky Navigation: Intersection Observer API

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const navObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

navObserver.observe(headerSection);

//4. Revealing Sections on scroll

const allSections = document.querySelectorAll('.section');
console.log(allSections);

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  console.log(entry.target);

  //Guard Clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

allSections.forEach(function (sect) {
  sectionObserver.observe(sect);
  sect.classList.add('section--hidden');
});

//5. Lazy-loading

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImage = function (entries, observer) {
  const [entry] = entries;

  //Guard Clause
  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  console.log(entry.target);

  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

//6. Tabbed Components
// Event delegation

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log('clicked');

  if (!clicked) return;

  // Remove active classes from all tabs
  tabs.forEach(function (tab) {
    tab.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(function (tab) {
    tab.classList.remove('operations__content--active');
  });

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content Area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//7. Fade menu on hover

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(function (el) {
      if (el !== link) el.style.opacity = opacity;
    });
  }
};
//Note: mouseenter event do not bubble
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});
*/

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML is parsed and DOM tree built!!!', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('Page is fully loaded!!', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
