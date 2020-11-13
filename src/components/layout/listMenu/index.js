const defaults = {
  modePrefixClass: 'is--',
};

const defaultState = {
  fixed: false,
};

export default class ListMenu {
  constructor(rootElement, option = { enable: true }) {
    if (option.enable) {
      const options = Object.assign({}, defaults, option);
      const state = Object.assign({}, defaultState);
      const dimentions = rootElement.getBoundingClientRect();

      Object.assign(this, {
        options,
        rootElement,
        state,
        viewState: {},
        dimentions,
        height: dimentions.height,
        positionTop: rootElement.offsetTop,
      });
    }
  }

  viewChange(...args) {
    this.viewChangeCheck(...args);
    window.setTimeout(() => {
      this.viewChangeCheck(...args);
    }, 50);
  }

  viewChangeCheck(mode, value = true) {
    const { rootElement, options, state } = this;
    const toggleClassName = options.modePrefixClass + mode;

    if (value) {
      rootElement.classList.add(toggleClassName);
    } else {
      rootElement.classList.remove(toggleClassName);
    }

    Object.assign(state, {
      [mode]: value,
    });
  }
}
