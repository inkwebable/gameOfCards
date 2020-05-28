/**
 * @class
 * @property _id {string} card id
 */

class Card {
  /**
   * @TODO split options
   * @param {object} [options={name: false, value: 0, suit: false, image: false, imageDefault: false, cardColor: false,visible: false, allowFlip: false, clickable: false,movable: false, moving: false, droppable: false,inArea: false, transitioning: false, faceUp: false,faceDown: false, currentEvent: false,events: { click, transitioned },onClick, onCardFaceUp, onCardFaceDown}] - options
   */
  constructor(options) {
    const defaultOptions = {
      name: '',
      value: 0,
      suit: '',
      image: '',
      imageDefault: 'front',
      cardColor: '',
      visible: false,
      allowFlip: true,
      clickable: true,
      movable: true,
      moving: false,
      droppable: false,
      inArea: null,
      transitioning: false,
      faceUp: false,
      faceDown: true,
      currentEvent: null,
      events: {
        click: () => {
        },
        transitionend: () => {
        },
      },
      /**
       *
       * @param evt {HTMLElement}
       */
      onClick: (evt) => {
      },
      onCardFaceUp: () => {
      },
      onCardFaceDown: () => {
      },
    };

    let newOptions = Object.assign({}, defaultOptions, options);
    // console.log('create card', newOptions.events);

    Object.defineProperties(this, {
      '_id': {
        value: newOptions.id || undefined,
        writable: false,
      },
    });

    this.name = newOptions.name || '';
    this.value = newOptions.value || 0;
    this.suit = newOptions.suit || '';
    this.image = newOptions.image || '';
    this.imageDefault = newOptions.imageDefault;
    this.cardColor = newOptions.cardColor || '';
    this.visible = newOptions.visible || false;
    this.allowFlip = newOptions.allowFlip || true;
    this.clickable = newOptions.clickable || true;
    this.movable = newOptions.movable || true;
    this.moving = newOptions.moving || false;
    this.droppable = newOptions.droppable || false;
    this.inArea = newOptions.inArea || null;
    this.transitioning = newOptions.transitioning || false;
    this.faceUp = newOptions.faceUp || false;
    this.faceDown = newOptions.faceDown || true;
    this.currentEvent = newOptions.currentEvent || null;
    this.events = newOptions.events || {};
    this.onClick = newOptions.onClick || ((evt) => {
    });
    this.onCardFaceUp = newOptions.onCardFaceUp || ((evt) => {
    });
    this.onCardFaceDown = newOptions.onCardFaceDown || ((evt) => {
    });
    this.hand = {};
  }

  /**
   * Set the dom make up for a card
   * @param dom {Node}
   */
  setDom(dom) {
    Object.defineProperty(this, 'dom', {
      value: dom,
      writable: false,
    });
  }

  /**
   * Set the card container class
   * @param val {string}
   */
  setDOMClassContainer(val) {
    this.dom.className = val;
  }

  /**
   * Append to the card container class
   * @param val {string}
   */
  addDOMClassContainer(val) {
    this.dom.className += ` ${val}`;
  }

  /**
   * Set the card class
   * @param val {string}
   */
  setDOMClassCard(val) {
    this.dom.children[0].className = val;
  }

  /**
   * append to the card class
   * @param val {string}
   */
  addDOMClassCard(val) {
    this.dom.children[0].className += ` ${val}`;
  }

  /**
   *
   * @param onClick {function}
   * @param props {object}
   * @param activateListener {boolean}
   *
   * @example card.setClickEvent(handleCardClick, { hand });
   * @returns {onClick}
   */
  setClickEvent(onClick, props, activateListener = true) {
    this.onClick = onClick.bind(this, props);

    if (activateListener) {
      this.activateClickEventListener();
    }

    return this.onClick;
  }

  /**
   * Set the transition event fns
   *
   * @param onCardFaceUp {function}
   * @param onCardFaceDown {function}
   * @param props {Object}
   * @param activateListener {boolean}}
   *
   * @example card.setTransitionEvent({ onCardFaceUp: afterCardFlipUp, onCardFaceDown: afterCardFlipDown }, { hand });
   */
  setTransitionEvent({ onCardFaceUp, onCardFaceDown }, props, activateListener = true) {
    if (onCardFaceUp) {
      this.onCardFaceUp = onCardFaceUp.bind(this, props);
    }

    if (onCardFaceDown) {
      this.onCardFaceDown = onCardFaceDown.bind(this, props);
    }

    if (activateListener) {
      this.activateTransitionedEventListener();
    }
  }

  /**
   * Activate the click event listener
   */
  activateClickEventListener() {
    this.clearClickListener();
    this.events.click = this.onClick;
    this.dom.addEventListener('click', this.events.click);
  }

  /**
   * Activate the transitioned event listener
   */
  activateTransitionedEventListener() {
    this.clearTransitionedListener();
    this.events.transitionend = this._afterTransition.bind(this);
    this.dom.addEventListener('transitionend', this.events.transitionend);
  }

  /**
   * Activate all the html event listeners
   */
  activateAllEventListeners() {
    this.removeAllEventListeners();

    this.activateClickEventListener();
    this.activateTransitionedEventListener();
  }

  /**
   * Remove all html event listeners
   */
  removeAllEventListeners() {
    this.clearClickListener();
    this.clearTransitionedListener();
  }

  /**
   * Dynamically remove all events
   * @returns {Array}
   */
  removeAllEvents() {
    // console.log('core/Card removeAllEvents', this);
    const removed = [];

    for (let event in this.events) {
      if (this.clearEvent(event)) {
        removed.push(`${event} removed`);
        this.events[event] = () => {
        };
      } else {
        console.error(`${event}event not removed from card ${this._id}`);
      }
    }

    return removed;
  }

  /**
   * Remove the given event listener from the card
   * @param event {HTMLElement}
   */
  clearEvent(event) {
    if ({}.hasOwnProperty.call(this.events, event)) {
      this.dom.removeEventListener(event, this.events[event]);

      return true
    }

    return false;
  }

  /**
   * Remove the click event from the card
   * @param event {HTMLElement}
   */
  clearClickListener(event = this.events.click) {
    this.dom.removeEventListener('click', event);
  }

  /**
   * Remove the transitioned event from the card
   * @param event {HTMLElement}
   */
  clearTransitionedListener(event = this.events.transitionend) {
    this.dom.removeEventListener('transitionend', event);
  }

  /**
   * Flip a card face up
   *
   * @returns {boolean}
   */
  flipCardFaceUp() {
    this.currentEvent = 'flipCardFaceUp';

    if (!this.visible) {
      this.dom.querySelector('.goc-front img').src = this.image;
      this.addDOMClassCard(' flipped');
      this.transitioning = true;

      return true;
    }

    return false;
  }

  /**
   * Flip a card face down
   *
   * @returns {boolean}
   */
  flipCardFaceDown() {
    this.currentEvent = 'flipCardFaceDown';

    if (this.visible) {
      this.setDOMClassCard('goc-card');
      this.transitioning = true;

      return true
    }

    return false;
  }

  /**
   * Handle transition end events
   *
   * @param evt {HTMLElement}
   */
  _afterTransition(evt) {
    // console.log('aftertran', this, evt)
    this.transitioning = false;

    if (this.currentEvent === 'flipCardFaceUp') {
      this.visible = true;
      this.onCardFaceUp(evt);
    }

    if (this.currentEvent === 'flipCardFaceDown') {
      this.visible = false;
      this.onCardFaceDown(evt);
      this.clearFrontFaceImg();
    }

    // @TODO allow adding of custom event after transition?
  }

  /**
   * Reset the src for front of the card
   *
   * @param img {string}
   */
  clearFrontFaceImg(img = this.imageDefault) {
    this.dom.querySelector('.goc-front img').src = `${img}`;
  }

  isTransitioning() {
    return this.transitioning === true;
  }
}

export default Card;
