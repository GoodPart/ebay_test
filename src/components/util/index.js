import { isString, isElement, isNodeList } from './is';

export function debounce(fn, delay) {
  let timerId;
  return function(...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

export function throttle(fn, wait) {
  let previouslyRun, queuedToRun;

  return function invokeFn(...args) {
    const now = Date.now();

    queuedToRun = clearTimeout(queuedToRun);

    if (!previouslyRun || now - previouslyRun >= wait) {
      fn.apply(null, args);
      previouslyRun = now;
    } else {
      queuedToRun = setTimeout(invokeFn.bind(null, ...args), wait - (now - previouslyRun));
    }
  };
}

export function getScrollTop() {
  return window.scrollY || window.pageYOffset;
}

export function getWindowWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

export function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

export function hexToRgbArray(hex) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
  }
  throw new Error('Bad Hex');
}

export function randomString(length = 5) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

export function sequentialToggleClass({ element, classes = [], interval = 100, type = 'add' }) {
  return new Promise(async resolve => {
    for (const className of classes) {
      if (interval) {
        await timeout(interval / 2);
      }
      if (type === 'add') {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
      if (interval) {
        await timeout(interval / 2);
      }
    }
    resolve(element);
  });
}

export function getElement(x, container = document) {
  let element;
  if (isString(x)) {
    element = container.querySelector(x);
  } else if (isElement(x)) {
    element = x;
  }
  return element;
}

export function getElements(x, container = document) {
  let elements;
  if (isString(x)) {
    elements = container.querySelectorAll(x);
  } else if (isNodeList(x)) {
    elements = x;
  }
  return elements;
}

/**
 * 숫자가 한자리일 경우 두자리로 변경 ( ex> 디지털 시계 )
 * @param {Number}
 * @return {String}
 */
export const pad = number => {
  return (number < 10 && number != '00') || number === 0 ? '0' + number : number;
};

/**
 * @param {string} string
 * @returns {string}
 * 받은 문자열중 한글을 <span class="kr"></span> 으로 감싼후 문자열로 리턴함.
 */
export function checkKorVal(string) {
  const checkReg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  const markup = string => {
    return `<span class="kr">${string}</span>`;
  };
  const str = string;
  let values = [];
  let kors = [];
  let checkIndex = 0;
  let check = null;

  for (let i in str) {
    if (check === null) {
      check = checkReg.test(str[i]);
      kors[checkIndex] = check;
      values[checkIndex] = str[i];
    } else {
      if (check === checkReg.test(str[i])) {
        values[checkIndex] = values[checkIndex] + str[i];
      } else {
        checkIndex++;
        check = checkReg.test(str[i]);
        kors[checkIndex] = check;
        values[checkIndex] = str[i];
      }
    }
    // console.log(checkReg.test(str[i]));
  }
  kors.forEach((ele, index) => {
    if (ele) {
      values[index] = markup(values[index]);
    }
  });
  return values.join(' ');
}

/**
 *
 * @param {string} str
 * @return {HTMLElement}
 */
export const stringToHtm = str => {
  const domparser = new DOMParser();

  return domparser.parseFromString(str, 'text/html').body.firstChild;
};

export function setCookie(name, value, day, path) {
  const date = new Date();
  const Path = path ? path : '/';
  date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=${Path};`;
}
export function getCookie(name) {
  const value = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return value ? value[2] : null;
}

/**
 *
 * @param {number} len
 * number 값의 자릿수를 갖는 난수를 리턴
 */
export function uid(len) {
  len = len || 7;
  return Math.random()
    .toString(35)
    .substr(2, len);
}
