import Swiper from 'swiper';
import AOS from 'aos';

const cardSwiper = new Swiper('.swiper-container__card', {
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
})

const cardSwiperFull = new Swiper('.swiper-container__card--full', {
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
})

/*------------------------------------*/
const swiper2 = new Swiper('.swiper2', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});


const verticalSwiper = new Swiper('.vertical-swiper', {
  direction: "vertical",
  slidesPerView: 3,
  // height: 49,
  spaceBetween: 18,
  slidesOffsetBefore: 10,
  // slidesOffsetBefore: 39,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});


const freeSwiper = new Swiper('.free-swiper', {
    spaceBetween: 30,
    freeMode: true,
    slidesPerView: 'auto'

})


/////

const headerList = document.querySelector(".header_list");
const headerListItem = headerList.querySelectorAll(".header_list__list--item");

headerListItem.forEach(menu=> {
  const createSpan = document.createElement("span");
  createSpan.className = 'line';
  menu.childNodes[1].appendChild(createSpan);

  menu.addEventListener("mouseover", (e)=> {
    if(menu.childNodes[1].classList.contains('line')) {
      menu.classList.remove("on")
    }else {
      menu.classList.add("on")
    }
  })

  menu.addEventListener("mouseout", (e)=> {
      menu.classList.remove("on")
  })
})

const header = document.querySelector(".header");
const createDiv = document.createElement("div");
createDiv.className="nav_bg";
header.appendChild(createDiv);