class Card {
  constructor(options) {
    const defaultOptions = {
      name: '',
      suit: '',
      image: '',
      imageDefault: 'default-front',
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
        click: () => {},
        transitionend: () => {},
      },
      onClick: (evt) => {},
      onCardFaceUp: () => {},
      onCardFaceDown: () => {},
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
    this.suit = newOptions.suit || '';
    this.image = newOptions.image || '';
    this.imageDefault = newOptions.imageDefault;
    this.cardColor = newOptions.cardColor || '';
    this.visible = newOptions.visible || false;
    this.allowFlip = newOptions.allowFlip || true;
    this.clickable = newOptions.clickable ||true;
    this.movable = newOptions.movable || true;
    this.moving = newOptions.moving || false;
    this.droppable = newOptions.droppable || false;
    this.inArea = newOptions.inArea || null;
    this.transitioning = newOptions.transitioning || false;
    this.faceUp = newOptions.faceUp || false;
    this.faceDown = newOptions.faceDown || true;
    this.currentEvent = newOptions.currentEvent || null;
    this.events = newOptions.events || {};
    this.onClick = newOptions.onClick || ((evt) => {});
    this.onCardFaceUp = newOptions.onCardFaceUp || ((evt) => {});
    this.onCardFaceDown = newOptions.onCardFaceDown || ((evt) => {});
  }

  setDom(dom) {
    Object.defineProperty(this, 'dom', {
      value: dom,
      writable: false,
    });
  }

  addDOMClassContainer(val) {
    this.dom.className += ` ${val}`;
  }

  setDOMClassCard(val) {
    this.dom.children[0].className = val;
  }

  addDOMClassCard(val) {
    this.dom.children[0].className += ` ${val}`;
  }

  setClickEvent(onClick, activateListener = true) {
    this.onClick = onClick.bind(this);

    if (activateListener) {
      this.activateClickEventListener();
    }
  }

  setTransitionEvent({ onCardFaceUp , onCardFaceDown }, activateListener = true) {
    if (onCardFaceUp) {
      this.onCardFaceUp = onCardFaceUp;
    }

    if (onCardFaceDown) {
      this.onCardFaceDown = onCardFaceDown;
    }

    if (activateListener) {
      this.activateTransitionedEventListener();
    }
  }

  activateClickEventListener() {
    this.clearClickListener();
    this.events.click = this.onClick;
    this.dom.addEventListener('click', this.events.click);
  }

  activateTransitionedEventListener() {
    this.clearTransitionedListener();
    this.events.transitionend = this._afterTransition.bind(this);
    this.dom.addEventListener('transitionend', this.events.transitionend);
  }

  activateAllEventListeners() {
    console.log('core/Card activateAllEvents', this);
    this.removeAllEventListeners();

    this.activateClickEventListener();
    this.activateTransitionedEventListener();
  }

  removeAllEventListeners() {
    this.clearClickListener();
    this.clearTransitionedListener();
  }

  // Dynamically remove all events
  removeAllEvents() {
    console.log('core/Card removeAllEvents', this);
    const removed = [];

    for (let event in this.events) {
      if(this.clearEvent(event)) {
        removed.push(`${event} removed`);
        this.events[event] = () => {};
      } else {
        console.error(`${event }event not removed from card ${this._id}`);
      }
    }

    return removed;
  }

  /**
   * Remove the given event listener from the card
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
   */
  clearClickListener(event = this.events.click) {
    this.dom.removeEventListener('click', event);
  }

  /**
   * Remove the transitioned event from the card
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
      this.dom.querySelector('.front img').src = this.image;
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
      this.setDOMClassCard('card');
      this.transitioning = true;

      return true
    }

    return false;
  }

  /**
   * Handle transition end events
   *
   * @param evt
   */
  _afterTransition(evt) {
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
   * @param img
   */
  clearFrontFaceImg(img = this.imageDefault) {
    this.dom.querySelector('.front img').src = img;
  }

  isTransitioning() {
    return this.transitioning === true;
  }
}

export default Card;
