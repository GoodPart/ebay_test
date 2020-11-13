import Swiper from 'swiper';
import { Autoplay } from 'swiper/js/swiper.esm';
import VideoController from '../../components/videoController/';
import { element } from '../util/is';

function numFormat(variable) {
  variable = Number(variable).toString();
  if (Number(variable) < 10 && variable.length == 1) variable = '0' + variable;
  return variable;
}

const defaultOption = {
  videoModuleSelector: '.video-container',
  fullSwiperClass: '.swiper-container--full',
  scrollSwiperClass: '.swiper-container--prd-scroll',
  boxSwiperClass: '.swiper-container--prd-box',
  cardSwiperClass: '.swiper-container--prd-card',
  videoSwiperClass: '.swiper-container--video',
  vipSwiperClass: '.swiper-container--vip',
  cardSwiperClass2 : 'swiper-container-card2',
};

export default class Module {
  constructor(option = {}) {
    const options = Object.assign({}, defaultOption, option);
    const instance = this;
    const videoSwipers = [];
    const videoLists = [];
    Object.assign(this, {
      options,
      videoSwipers,
      state: {
        currentVideoSwiper: null,
        currentVideoSwiperIndex: null,
        currentPlayedVideo: null,
      },
    });
    this.videoTimer = null;
    /**
     * fullSwiper
     */
    const fullSwiperElements = document.querySelectorAll(options.fullSwiperClass);
    if (fullSwiperElements.length > 0) {
      fullSwiperElements.forEach(element => {
        new Swiper(element, {
          loop: false,
          parallax: true,
          scrollbar: {
            el: element.querySelector('.swiper-scrollbar'),
            hide: false,
          },
          pagination: {
            el : element.querySelector('.swiper-pagination'),
            type : 'custom',
            renderCustom: function(fullSwiperElements, current, total) {
              return '<span class="">'+ (current < 10 ? '0'+current : current) +'</span>' + ' ' + '<span class="totalclass">'+(total<10 ? '0'+total: total )+'</span>'
            }
            // renderFraction: function(currentClass, totalClass) {
            //   return currentClass + '-' + totalClass
            // }
           
          },
          on: {
            slideChange : function(e) {
              // let testIndex = 0;
              console.log(this)
              const swiperSlide = this.el.querySelectorAll(".swiper-slide")
              swiperSlide[this.realIndex].querySelector(".swiper-titles").classList.add("active")



              // console.log(this.realIndex)

              // console.log("asdasd", swiperSlide[this.realIndex])
              // swiperSlide[]
              // slideTitle.classList.add("active")
              
            }
            // slideChange: function() {
            //   const pagination = this.el.querySelector('.swiper-paging__current');
            //   pagination.innerHTML = numFormat(this.realIndex + 1);
            // },
          },
        });
      });
    }

    /*
    *cardSwiper2
    */

    // const cardSwiper2 = document.querySelectorAll(option.cardSwiperClass2);


    
    

    /**
     * scrollSwiper
     */
    const scrollSwiperElements = document.querySelectorAll(options.scrollSwiperClass);
    if (scrollSwiperElements.length > 0) {
      scrollSwiperElements.forEach(element => {
        new Swiper(element, {
          nested: true,
          loop: false,
          freeMode: true,
          slidesPerView: 'auto',
          scrollbar: {
            el: element.querySelector('.swiper-scrollbar'),
            hide: false,
            snapOnRelease: false,
          },
        });
      });
    }

    /**
     * boxSwiper
     */
    const boxSwiperElements = document.querySelectorAll(options.boxSwiperClass);
    if (boxSwiperElements.length > 0) {
      boxSwiperElements.forEach(element => {
        new Swiper(element, {
          loop: true,
          parallax: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          pagination: {
            el: element.querySelector('.swiper-pagination'),
            type: 'custom',
            renderCustom: function(swiper, current /*, total */) {
              return `<em class="swiper-pagination-current">${numFormat(current)}</em> / 12`;
            },
          },
        });
      });
    }

    /**
     * cardSwiper
     */
    const cardSwiperElements = document.querySelectorAll(options.cardSwiperClass);
    if (cardSwiperElements.length > 0) {
      cardSwiperElements.forEach(element => {
        new Swiper(element, {
          loop: false,
          parallax: true,
          slidesPerView: 'auto',
          centeredSlides: true,
          pagination: {
            el: element.querySelector('.swiper-pagination'),
            type: 'custom',
            renderCustom: function(swiper, current /*, total */) {
              return `<em class="swiper-pagination-current">${numFormat(current)}</em> / 12`;
            },
          },
          on: {
            imagesReady: function() {
              setTimeout(() => {
                this.el.style.height = `${this.slides[this.activeIndex].offsetHeight}px`;
                this.update();
              }, 400);
            },
            slideChange: function() {
              const pagination = this.el.querySelector('.swiper-paging__current');
              if (pagination) {
                pagination.innerHTML = numFormat(this.realIndex + 1);
              }
            },
          },
        });
      });
    }

    /**
     * videoFullSwiper
     */
    const videoSwiperElements = document.querySelectorAll(options.videoSwiperClass);
    if (videoSwiperElements.length > 0) {
      videoSwiperElements.forEach((element, index) => {
        const items = element.querySelectorAll('.swiper-slide');
        const videos = [];
        items.forEach(item => {
          videos.push(new VideoController(item.querySelector('.video-container')));
        });
        this.videoSwipers.push({
          index,
          root: element,
          items,
          videos,
          swiper: new Swiper(element, {
            init: true,
            loop: false,
            pagination: {
              el: element.querySelector('.swiper-pagination'),
              type: 'custom',
              renderCustom: function(swiper, current /*, total */) {
                return `<em class="swiper-pagination-current">${numFormat(current)}</em> / 06`;
              },
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            on: {
              slideChange: function() {
                instance.videoSwiperSlideChange(this);
              },
            },
          }),
        });
        const io = this.swiperIntersectionObserver(this.videoSwipers);
        io.observe(element);
      });
    }

    /**
     * vipSwiper
     */
    const vipSwiperElements = document.querySelectorAll(options.vipSwiperClass);
    if (vipSwiperElements.length > 0) {
      vipSwiperElements.forEach((element, index) => {
        const items = element.querySelectorAll('.swiper-slide');
        const videos = [];
        items.forEach((item, index) => {
          const videoContainer = item.querySelector('.video-container');
          if (videoContainer) {
            videos[index] = new VideoController(item.querySelector('.video-container'));
          }
        });
        this.videoSwipers.push({
          index,
          root: element,
          items,
          videos,
          swiper: new Swiper(element, {
            loop: false,
            pagination: {
              el: element.querySelector('.swiper-pagination'),
            },
            on: {
              init: function() {
                instance.vipSwiperInit(this);
              },
              slideChange: function() {
                instance.videoSwiperSlideChange(this);
              },
            },
          }),
        });
        const io = this.swiperIntersectionObserver(this.videoSwipers);
        io.observe(element);
      });
    }

    const videoElements = document.querySelectorAll(options.videoModuleSelector);
    if (videoElements.length > 0) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            videoLists.forEach((controller /*, index */) => {
              if (controller.elements.root === entry.target) {
                if (this.videoTimer) {
                  this.videoTimer = null;
                }
                if (!this.videoTimer) {
                  this.videoTimer = window.setTimeout(() => {
                    controller.play();
                  }, 200);
                }
              }
            });
          } else {
            videoLists.forEach((controller /*, index */) => {
              if (controller.elements.root === entry.target) {
                if (this.videoTimer) {
                  this.videoTimer = null;
                }
                controller.pause();
              }
            });
          }
        });
      });
      videoElements.forEach(element => {
        if (!element.closest('.swiper-container')) {
          io.observe(element);
          videoLists.push(new VideoController(element));
        }
      });
    }
  }

  videoSwiperSlideChange(swiper) {
    const { state, videoSwipers } = this;
    const { currentVideoSwiper, currentVideoSwiperIndex } = state;

    if (currentVideoSwiper && swiper.el === currentVideoSwiper.el) {
      const index = swiper.activeIndex;

      videoSwipers[currentVideoSwiperIndex].videos.forEach((controller, i) => {
        if (i === index) {
          this.state.currentPlayedVideo = controller;
          controller.play();
        } else {
          controller.pause();
        }
      });
    }
  }

  vipSwiperInit(swiper) {
    for (let i = 0; i < swiper.slides.length; i++) {
      swiper.slides[i].style.height = `${window.innerHeight - (window.layout.header.height + 195)}px`;
      const rotateButton = swiper.slides[i].querySelector('.button--360');
      if (rotateButton) {
        rotateButton.addEventListener('click', () => {
          swiper.slides[i].classList.add('layer-360-active');
        });

        swiper.slides[i].querySelector('.button--360-close').addEventListener('click', () => {
          swiper.slides[i].classList.remove('layer-360-active');
        });
      }
    }
    swiper.update();
  }

  swiperIntersectionObserver(swipers) {
    return new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            swipers.forEach((item, index) => {
              if (item.root === entry.target) {
                this.state.currentVideoSwiper = item.swiper;
                this.state.currentVideoSwiperIndex = index;

                if (swipers[index].videos.length) {
                  swipers[index].videos.forEach((controller, i) => {
                    const activeIndex = item.swiper.activeIndex;
                    if (i === activeIndex) {
                      if (this.videoTimer) {
                        this.videoTimer = null;
                      }
                      if (!this.videoTimer) {
                        this.videoTimer = window.setTimeout(() => {
                          controller.play();
                        }, 200);
                      }
                    }
                  });
                } else {
                  const activeIndex = item.swiper.activeIndex;
                  const currentSlide = (() => {
                    if (item.swiper.slides.length) {
                      return item.swiper.slides[activeIndex];
                    } else {
                      return swipers[index].items[0];
                    }
                  })();
                  const video = currentSlide.querySelector(this.options.videoModuleSelector);

                  if (video) {
                    const currentVideoSwiperVideos = swipers[index].videos[activeIndex];
                    if (!currentVideoSwiperVideos) {
                      this.videoSwipers[index].videos[activeIndex] = new VideoController(video);
                      if (this.videoTimer) {
                        this.videoTimer = null;
                      }
                      if (!this.videoTimer) {
                        this.videoTimer = window.setTimeout(() => {
                          this.videoSwipers[index].videos[activeIndex].play();
                        }, 200);
                      }
                    }
                  }
                }
              }
            });
          } else {
            swipers.forEach((item, index) => {
              if (item.root === entry.target) {
                swipers[index].videos.forEach((controller, i) => {
                  const activeIndex = item.swiper.activeIndex;
                  if (i === activeIndex) {
                    if (this.videoTimer) {
                      this.videoTimer = null;
                    }
                    controller.pause();
                  }
                });
              }
            });
          }
        });
      },
      {
        threshold: 0.5,
      },
    );
  }
}

const cardSwiper2 = new Swiper('.swiper-container-card2', {
  slidesPerView: 'auto',
  spaceBetween : 10,
  slidesOffsetBefore: 16,
  slidesOffsetAfter: 16
})