import { getElement, sequentialToggleClass } from '../util/index';
import { isFunction } from '../util/is';
import { getVideoSize } from '../util/media';

const defaults = {
  loadedClass: 'is-loaded',
  controlsClass: 'video__controller',
  playButtonClass: 'button-video-play',
  volumeButtonClass: 'button-video-volume',
  videoClass: 'video',
  preActiveClass: 'shadow',
  activeClass: 'is-active',
  mutedClass: 'is-muted',
  pausedClass: 'is-paused',
  type: 'cover',
  onload: null,
};

export default class VideoController {
  constructor(container, option) {
    const options = Object.assign({}, defaults, option);
    const root = getElement(container);
    const controller = getElement(`.${options.controlsClass}`, root);
    const playButton = controller && getElement(`.${options.playButtonClass}`, controller);
    const volumnButton = controller && getElement(`.${options.volumeButtonClass}`, controller);
    const video = getElement(`.${options.videoClass}`, root);

    Object.assign(this, {
      options,
      elements: {
        root,
        controller,
        playButton,
        volumnButton,
        video,
      },
      timer: null,
      loaded: false,
      active: false,
      showTimer: null,
      playTimer: null,
    });

    getVideoSize(video).then(info => {
      this.loaded = true;
      this.width = info.width;
      this.height = info.height;
      this.mute();
      this.pause();
      this.resize(video);
      const root = getElement(container);
      root.classList.add(options.loadedClass);

      if (playButton) {
        playButton.addEventListener('click', () => {
          if (video.paused) {
            this.play(true);
          } else {
            this.pause(true);
          }
        });
      }
      if (volumnButton) {
        volumnButton.addEventListener('click', () => {
          if (video.muted) {
            this.unmute();
          } else {
            this.mute();
          }
        });
      }

      root.addEventListener(
        'click',
        event => {
          const { target } = event;
          if (!target.closest('a') && !target.closest('button')) {
            event.preventDefault();
            this.toggle();
          }
        },
        false,
      );

      if (options.onload && isFunction(options.onload)) {
        options.onload(this);
      }
    });
  }

  resize() {
    const { elements, width, height } = this;
    const containerSize = elements.root.getBoundingClientRect();
    const uiClass = width / height >= containerSize.width / containerSize.height ? 'img-h' : 'img-w';

    elements.video.classList.remove('img-w', 'img-h');
    elements.video.classList.add(uiClass);
  }

  play(force) {
    const { elements, options, loaded } = this;
    if (loaded) {
      if (!force) {
        this.mute();
      }
      elements.video.play();

      if (elements.controller) {
        elements.controller.classList.remove(options.pausedClass);
      }

      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        this.hide();
      }, 1500);
    } else {
      if (this.playTimer !== null) {
        window.clearTimeout(this.playTimer);
        this.playTimer = null;
      }
      this.playTimer = window.setTimeout(() => {
        this.play(force);
      }, 100);
    }
  }

  pause(force) {
    const { elements, options } = this;
    if (!force) {
      this.mute();
    }
    elements.video.pause();
    if (elements.controller) {
      elements.controller.classList.add(options.pausedClass);
      this.show();
    }
    // this.timer = window.setTimeout(() => {
    //   this.hide();
    // }, 3000);
  }

  mute() {
    const { elements, options } = this;
    elements.video.muted = true;
    if (elements.controller) {
      elements.controller.classList.add(options.mutedClass);
    }
  }

  unmute() {
    const { elements, options } = this;
    elements.video.muted = false;
    if (elements.controller) {
      elements.controller.classList.remove(options.mutedClass);
    }
  }

  show(callback) {
    const { elements, options, loaded } = this;
    if (loaded && !this.motion) {
      this.motion = true;
      if (elements.controller) {
        sequentialToggleClass({
          element: elements.controller,
          classes: [options.preActiveClass, options.activeClass],
          interval: 150,
          type: 'add',
        }).then(() => {
          this.active = true;
          this.motion = false;

          if (this.showTimer !== null) {
            window.clearTimeout(this.showTimer);
            this.showTimer = null;
          }

          if (callback && isFunction(callback)) {
            callback(this);
          }
        });
      } else {
        this.active = true;
        this.motion = false;

        if (this.showTimer !== null) {
          window.clearTimeout(this.showTimer);
          this.showTimer = null;
        }
        if (callback && isFunction(callback)) {
          callback(this);
        }
      }
      if (this.showTimer !== null) {
        window.clearTimeout(this.showTimer);
        this.showTimer = null;
      }
    } else {
      this.showTimer = window.setTimeout(() => {
        this.show(callback);
      }, 100);
    }
  }

  hide(callback) {
    const { elements, options } = this;
    if (!this.motion) {
      this.motion = true;
      if (elements.controller) {
        sequentialToggleClass({
          element: elements.controller,
          classes: [options.activeClass, options.preActiveClass],
          interval: 150,
          type: 'remove',
        }).then(() => {
          this.active = false;
          this.motion = false;

          if (this.showTimer !== null) {
            window.clearTimeout(this.showTimer);
            this.showTimer = null;
          }

          if (callback && isFunction(callback)) {
            callback(this);
          }
        });
      } else {
        this.active = false;
        this.motion = false;

        if (this.showTimer !== null) {
          window.clearTimeout(this.showTimer);
          this.showTimer = null;
        }

        if (callback && isFunction(callback)) {
          callback(this);
        }
      }
    }
  }

  toggle() {
    if (this.active) {
      this.hide();
    } else {
      this.show();
    }
  }
}
