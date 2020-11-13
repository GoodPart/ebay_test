import { sequentialToggleClass } from './index';
import { isElement } from './is';

function getAspRatio(n1, n2) {
  return n1 > n2 ? [n1 / n2, 1] : [1, n2 / n1];
}

function imageLoadPromise(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = e =>
      resolve({
        width: e.target.naturalWidth,
        height: e.target.naturalHeight,
      });
    img.onerror = reject;
    img.src = src;
  });
}

function videoLoadPromise(videoElement) {
  return new Promise((resolve, reject) => {
    if (videoElement.readyState) {
      resolve({
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
    } else {
      videoElement.addEventListener('loadedmetadata', () => {
        if (videoElement.videoWidth !== 0 && videoElement.videoHeight !== 0) {
          resolve({
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
          });
        } else {
          reject(Error('(' + videoElement + ' )비디오 메타데이터 오류'));
        }
      });
      videoElement.addEventListener('error', () => {
        reject(Error('(' + videoElement + ' )비디오 메타데이터 오류'));
      });
    }
  });
}

export async function getImageSize(img) {
  let dimentions = {};
  if (isElement(img) && img.dataset.width && img.dataset.height) {
    dimentions.width = parseInt(img.dataset.width, 10);
    dimentions.height = parseInt(img.dataset.height, 10);
  } else {
    dimentions = await imageLoadPromise(img.src);
  }
  return dimentions;
}

export async function getVideoSize(video) {
  let dimentions = {};
  if (isElement(video) && video.dataset.videoWidth && video.dataset.videoHeight) {
    dimentions.width = parseInt(video.dataset.videoWidth, 10);
    dimentions.height = parseInt(video.dataset.videoHeight, 10);
  } else {
    dimentions = await videoLoadPromise(video);
  }
  return dimentions;
}

export async function getCoverRatio(element, container) {
  let containerSize = {};
  let elementSize = {};
  const media = element.tagName.toLowerCase();

  if (media === 'video') {
    elementSize = await getVideoSize(element);
  } else if (media === 'img') {
    elementSize = await getImageSize(element);
  }
  element.dataset.width = elementSize.width;
  element.dataset.height = elementSize.height;

  if (container && isElement(container)) {
    const containerRect = container.getBoundingClientRect();
    containerSize = {
      width: containerRect.width,
      height: containerRect.height,
    };
  } else {
    containerSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const containerRatio = getAspRatio(containerSize.width, containerSize.height);
  const imageRatio = getAspRatio(elementSize.width, elementSize.height);

  return containerRatio[1] < imageRatio[1] ? 'width' : 'height';
}

export async function getItemRatio(element, container) {
  let containerSize = {};
  let elementSize = {};
  const media = element.tagName.toLowerCase();

  if (media === 'video') {
    elementSize = await getVideoSize(element);
  } else if (media === 'img') {
    elementSize = await getImageSize(element);
    element.dataset.width = elementSize.width;
    element.dataset.height = elementSize.height;
  }

  if (container && isElement(container)) {
    const containerRect = container.getBoundingClientRect();
    containerSize = {
      width: containerRect.width,
      height: containerRect.height,
    };
  } else {
    containerSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const containerRatio = getAspRatio(containerSize.width, containerSize.height);
  const imageRatio = getAspRatio(elementSize.width, elementSize.height);
  return containerRatio[1] > imageRatio[1] ? 'width' : 'height';
}

export function coverMediaStyleFix(element, container) {
  element.classList.remove('sc-img-w', 'sc-img-h', 'sc-img-loaded');
  getCoverRatio(element, container).then(type => {
    const ratioClass = type === 'width' ? 'sc-img-w' : 'sc-img-h';
    element.classList.add('sc-img-loaded', ratioClass);
  });
}

export function scaleDownStyleFix(element, container) {
  element.classList.remove('sc-img-w', 'sc-img-h', 'sc-img-loaded');
  getItemRatio(element, container).then(type => {
    const ratioClass = type === 'width' ? 'sc-img-w' : 'sc-img-h';
    element.classList.add('sc-img-loaded', ratioClass);
  });
}

export function scaleDownStyleFixMain(element, container) {
  element.classList.remove('sc-img-w', 'sc-img-h', 'sc-img-loaded');
  getItemRatio(element, container).then(type => {
    if (container.closest('#goodsSwiper')) {
      element.classList.add('sc-img-loaded', 'sc-img-w');
    } else {
      const ratioClass = type === 'width' ? 'sc-img-w' : 'sc-img-h';
      element.classList.add('sc-img-loaded', ratioClass);
    }
  });
}

export const videoControls = {
  timer: null, // 비디오 컨트롤러를 숨기는 timer 를 저장함. null 이거나 timer 가 들어가 있거나 함.
  show: element => {
    // 버튼을 보여줌.
    // 재생중일 경우 일정 시간 이후 버튼 등을 숨김.
    if (videoControls.timer !== null) {
      window.clearTimeout(videoControls.timer);
      videoControls.timer = null;
    }
    sequentialToggleClass({
      element: element,
      classes: ['ready', 'view'],
      interval: 200,
      type: 'add',
    }).then(element => {
      if (element.querySelector('.button-video-play').classList.contains('pause')) {
        videoControls.delayHide(element);
      }
    });
  },
  hide: element => {
    // 버튼을 숨김.
    if (videoControls.timer === null) {
      sequentialToggleClass({
        element: element,
        classes: ['view', 'ready'],
        interval: 200,
        type: 'remove',
      });
    } else {
      window.clearTimeout(videoControls.timer);
      videoControls.timer = null;
      videoControls.hide(element);
    }
  },
  delayHide: element => {
    // 일정 시간 이후 버튼을 숨김.
    if (videoControls.timer === null) {
      videoControls.timer = window.setTimeout(() => {
        sequentialToggleClass({
          element: element,
          classes: ['view', 'ready'],
          interval: 200,
          type: 'remove',
        });
      }, 3000);
    } else {
      window.clearTimeout(videoControls.timer);
      videoControls.timer = null;
      videoControls.delayHide(element);
    }
  },
  toggle: element => {
    // 상태에 따라 버튼을 보이거나 숨김.
    if (element.classList.contains('view')) {
      videoControls.hide(element);
    } else {
      videoControls.show(element);
    }
  },
  autoPlay: (container, type) => {
    const videoEle = container.querySelector('video');
    if (type === 'play') {
      if (videoEle) {
        videoEle.muted = true;
        videoEle.play();
        container.querySelector('.button-video-play').classList.add('pause');
        container.querySelector('.button-video-volume').classList.add('muted');
      }
    } else {
      if (videoEle) {
        videoEle.pause();
        container.querySelector('.button-video-play').classList.remove('pause');
        container.querySelector('.button-video-volume').classList.remove('muted');
      }
    }
  },
};
