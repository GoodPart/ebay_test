import { isElement } from '../util/is';

import Header from './header/';
import BottomMenu from './bottomMenu/';
import Navigation from './navigation/';
import ListMenu from './listMenu/';

export default class Layout {
  constructor(options) {
    /**
     * Header
     */
    const headerElement = document.querySelector(options.header.root);
    if (headerElement && isElement(headerElement)) {
      this.header = new Header(headerElement);
    }

    /**
     * bottomMenu
     */
    const bottomMenuElement = document.querySelector(options.bottomMenu.root);
    if (bottomMenuElement && isElement(bottomMenuElement)) {
      this.bottomMenu = new BottomMenu(bottomMenuElement);
    }

    /**
     * navigation
     */
    const navigationElement = document.querySelector(options.navigation.root);
    if (navigationElement && isElement(navigationElement)) {
      this.navigation = new Navigation(navigationElement);
    }

    const navigationOpenButton = bottomMenuElement.querySelector('.button--menu');
    const navigationCloseButton = navigationElement.querySelector('.navigation-close');
    navigationOpenButton.addEventListener('click', () => {
      this.navigation.viewChange('active', true);
    });
    navigationCloseButton.addEventListener('click', () => {
      this.navigation.viewChange('active', false);
    });

    /**
     * navigation
     */
    const listMenuElement = document.querySelector('.list-menu');
    if (listMenuElement && isElement(listMenuElement)) {
      this.listMenu = new ListMenu(listMenuElement);
    }
  }
}
