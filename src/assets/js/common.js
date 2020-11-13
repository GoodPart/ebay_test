import './_polyfills/_index.js';
import Layout from '../../components/layout/';
import Module from '../../components/module/';
import sal from 'sal.js';
import AOS from 'aos';

window.layout = new Layout({
  header: {
    enable: true,
    root: '.layout-header',
  },
  footer: {
    enable: true,
    root: '.layout-footer',
  },
  navigation: {
    enable: true,
    root: '.layout-navigation',
  },
  bottomMenu: {
    enable: true,
    root: '.layout-bottommenu',
  },
  listMenu: {},
});

export default class App {
  constructor() {
    this.module = new Module();
    this.scrollY = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
    this.scrollDirection = 'down';

    window.addEventListener(
      'scroll',
      () => {
        const scrollY = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);

        if (scrollY > this.scrollY) {
          this.scrollDirection = 'down';
        } else {
          this.scrollDirection = 'up';
        }
        this.scrollY = scrollY <= 0 ? 0 : scrollY;

        this.onScroll();

        this.scrollY = scrollY;
      },
      false,
    );

    this.scrollHeaderChange();
    this.listMenuChange();

    if (document.querySelectorAll('[data-sal]').length > 0) {
      sal({
        // threshold: 0.7,
        once: false,
      });
    }
    if (document.querySelectorAll('[data-aos]').length > 0) {
      AOS.init({
        easing: 'ease',
        duration: 1000,
        offset: 10,
        once: false,
      });

      window.addEventListener('load', AOS.refresh, false);
    }

    const links = document.querySelectorAll('[data-go-to]');
    links.forEach(ele => {
      ele.addEventListener('click', e => {
        e.preventDefault();
        location.href = `${ele.dataset.goTo}`;
      });
    });
  }

  onScroll() {
    this.scrollHeaderChange();
    this.scrollBottomMenuChange();
    this.listMenuChange();
    this.aosReset();
  }

  aosReset() {
    if (document.querySelectorAll('[data-aos]').length > 0) {
      const visual = document.querySelector(`.visual`);
      const visualHeight = visual.offsetHeight;
      const visualOffsetTop = visual.offsetTop;
      const activeClass = 'active';

      if (this.scrollDirection === 'up') {
        if (this.scrollY < visualOffsetTop + visualHeight) {
          visual.classList.add(activeClass);
        } else {
          visual.classList.remove(activeClass);
        }
      } else {
        visual.classList.remove(activeClass);
      }
    }
  }

  scrollHeaderChange() {
    const position = 0;
    const { scrollY } = this;

    if (document.querySelectorAll('.layout-header--main').length) {
      if (scrollY > position) {
        window.layout.header.viewChange('shape', true);
      } else {
        window.layout.header.viewChange('shape', false);
      }
    }
  }

  scrollBottomMenuChange() {
    const { scrollY, scrollDirection } = this;
    if (document.querySelectorAll('.layout-bottommenu').length) {
      if (scrollDirection === 'down') {
        window.layout.bottomMenu.viewChange('hidden', true);
        const bottomY = document.documentElement.offsetHeight - window.innerHeight;
        const bottomMenuHeight = window.layout.bottomMenu.height;
        if (scrollY >= bottomY - bottomMenuHeight) {
          window.layout.bottomMenu.viewChange('hidden', false);
        }
      } else {
        window.layout.bottomMenu.viewChange('hidden', false);
      }
    }
  }

  listMenuChange() {
    if (document.querySelectorAll('.list-menu').length) {
      const { scrollY } = this;
      const position = window.layout.listMenu.positionTop - window.layout.header.height;

      if (scrollY < position) {
        window.layout.listMenu.viewChange('fixed', false);
      } else {
        window.layout.listMenu.viewChange('fixed', true);
      }
    }
  }
}

window.App = App;
