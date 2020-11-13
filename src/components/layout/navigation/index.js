// const defaults = {
//   modePrefixClass: 'is-',
// };

// const defaultState = {
//   active: false,
// };

// export default class Navigation {
//   constructor(rootElement, option = { enable: true }) {
//     if (option.enable) {
//       const options = Object.assign({}, defaults, option);
//       const state = Object.assign({}, defaultState);
//       const dimentions = rootElement.getBoundingClientRect();

//       Object.assign(this, {
//         options,
//         rootElement,
//         state,
//         viewState: {},
//         height: dimentions.height,
//       });
//     }
//   }

//   viewChange(...args) {
//     this.viewChangeCheck(...args);
//     window.setTimeout(() => {
//       this.viewChangeCheck(...args);
//     }, 50);
//   }

//   viewChangeCheck(mode, value = true) {
//     const { rootElement, options, state } = this;
//     const toggleClassName = options.modePrefixClass + mode;

//     if (value) {
//       rootElement.classList.add(toggleClassName);
//     } else {
//       rootElement.classList.remove(toggleClassName);
//     }

//     if (rootElement.classList.contains('is-active')) {
//       document.getElementsByTagName('html')[0].classList.add('is-menu-open');
//     } else {
//       document.getElementsByTagName('html')[0].classList.remove('is-menu-open');
//     }

//     Object.assign(state, {
//       [mode]: value,
//     });
//   }
// }
