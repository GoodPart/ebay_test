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
    el: '.swiper-progress',
    type: 'progressbar',
  },
})

const cardSwiper3 = new Swiper('.swiper-container__card--3', {
  loop: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  spaceBetween: 121,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
})

/////

const header = document.querySelector(".header");
const createDiv = document.createElement("div");

createDiv.className="nav_bg";
header.appendChild(createDiv);

const headerList = document.querySelector(".header_list");
const headerListItem = headerList.querySelectorAll(".header_list__list--item");

const navBg = document.querySelector(".nav_bg");

headerListItem.forEach(menu=> {
  const createSpan = document.createElement("span");
  createSpan.className = 'line';
  menu.childNodes[1].appendChild(createSpan);

  menu.addEventListener("mouseover", (e)=> {
    if(menu.childNodes[1].classList.contains('line')) {
      menu.classList.remove("on")
      navBg.classList.remove("on")
    }else {
      menu.classList.add("on")
      navBg.classList.add("on")
    }
  })

  menu.addEventListener("mouseout", (e)=> {
      menu.classList.remove("on")
      navBg.classList.remove("on")
  })
})



//strategy
const leftTargetParent = document.querySelector(".section__body--article--left");
const leftTargets = leftTargetParent.querySelectorAll(".section__list--item");
// console.log("target, ", target)
const rightTargetParent = document.querySelector(".section__body--article--right");
const rightTargets = rightTargetParent.querySelectorAll(".section__list--item");

leftTargets.forEach((leftTarget, index)=> {
  const createBar = document.createElement("p");
  createBar.className = 'check_bar';

  leftTarget.appendChild(createBar);

  //인텍스 삽입
  leftTarget.setAttribute("data-index", index)

  //좌측 탭 클릭시 이벤트 실행
  leftTarget.addEventListener("click", (e)=> {
    const checkBars = document.querySelectorAll(".check_bar");

    //타겟에 data-index값을 저장함
    const indexData =  e.path[1].attributes[1].value;
    const originalClassName = "sprite-icon sprite-icon-check02"
    const replacClassName = "sprite-icon sprite-icon-check02_active"

    if(e.path[1].classList.contains("on")) {
      console.log("on되어있다.")
    }else {
      for(var i = 0; i<leftTargets.length; i++) {
        leftTargets[i].classList.remove("on");
        rightTargets[i].classList.remove("on");
        leftTargets[i].children[0].className = originalClassName
        checkBars[i].classList.remove("on")
        // e.path[1].children[0].className = originalClassName;
      }
      e.path[1].classList.add("on")
      rightTargets[indexData].classList.add("on")
      e.path[1].children[0].className = replacClassName;
      checkBars[indexData].classList.add("on")
      
    }
  })
})

