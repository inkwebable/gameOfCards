export const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

export const cardShuffle = async (cards = [], callback = () => {}, options = {}) => {
  let defaultOptions = { index: 0, delay: 500};
  let { index, delay} = Object.assign({}, defaultOptions, options);

  await wait(delay);

  while (index <= (cards.length - 2)) {
    let cardObj1 = cards[index]
    let cardObj2 = cards[index + 1]

    let card1 = cardObj1.dom
    let card2 = cardObj2.dom

    card1.className = 'card-container shuffle-left';
    // card1.style.zIndex =  (index + 1);

    if (card2) {
      // console.log('card2', card2);
      card2.className = 'card-container shuffle-right';
      // card2.style.zIndex = index;
    }

    await wait(100);

    card1.className = 'card-container shuffle-right';
    if (card2) {
      card2.className = 'card-container shuffle-left';
      swapDomElements(card1, card2);
      let temp = cardObj1;
      cards[index] = cardObj2
      cards[index + 1] = temp;
    }

    index += 2;
  }

  callback();
  // console.log('index', index);
  return Promise.resolve({ someVal: index });
}

export const swapDomElements = (obj1, obj2) => {
  // save the location of obj2
  var parent2 = obj2.parentNode;
  var next2 = obj2.nextSibling;
  // special case for obj1 is the next sibling of obj2
  if (next2 === obj1) {
    // just put obj1 before obj2
    parent2.insertBefore(obj1, obj2);
  } else {
    // insert obj2 right before obj1
    obj1.parentNode.insertBefore(obj2, obj1);

    // now insert obj1 where obj2 was
    if (next2) {
      // if there was an element after obj2, then insert obj1 right before that
      parent2.insertBefore(obj1, next2);
    } else {
      // otherwise, just append as last child
      parent2.appendChild(obj1);
    }
  }
}

export const deal = async (
  fromPlayer, toPlayer,
  {
    numberOfCards = 12, cardWidthOffset = 0, cardHeightOffset = 0, stackVertical = false, stackHorizontal = true, alwaysDealToTop = false, tilt = false, speed = 300
  }) => {
  // console.log('deal',fromPlayer, toPlayer);

  let dealLoop = null;
  let counter = 0;

  // get card width dynamically from card itself
  let cardWidth = 120;
  let cardHeight = 135;

  let fromHandCardCount = fromPlayer.hand.cards.length;

  // get the DOMDeck if cards were shuffled, else get from DOMCards
  // let fromCards = [];

  if (fromHandCardCount > 0) {
    cardWidth = fromPlayer.hand.cards[0].dom.clientWidth + 5;
    cardHeight = fromPlayer.hand.cards[0].dom.clientHeight - 50;
    // fromCards = fromPlayer.hand.cards;
    console.log('card dimes in hand', cardWidth, cardHeight);
  } else {
    return;
  }

  // await wait(speed + 50);

  console.log('start myLoop', counter);
  dealLoop = setInterval(() => {
    let toHandCardCount = toPlayer.hand.cards.length;
    console.log('in loop', counter, toPlayer.hand.cards.length);

    // if side by side is a number, increase it by 1 card width if we have dealt more than 1
    if (stackHorizontal !== false && counter > 0) {
      cardWidthOffset += cardWidth;
    }

    if (stackVertical !== false && counter > 0) {
      cardHeightOffset += cardHeight;
    }

    //  count cards in area or hand to add side by side offset - no good if dealing more than 1
    if (stackHorizontal === true) {
      cardWidthOffset = toHandCardCount * cardWidth;
    }

    if (stackVertical === true) {
      cardHeightOffset = toHandCardCount * cardHeight;
    }

    // grab last card from the hand
    let card = fromPlayer.hand.cards[fromPlayer.hand.cards.length - 1];

    if (alwaysDealToTop) {
      card.dom.style.zIndex = `${toHandCardCount};`
    }

    // console.log('card', card);

    if (card) {
      // console.log('moveCardToH', cardWidth, cardWidthOffset)
      moveCardToH({
        index: counter,
        card,
        cardWidth,
        cardHeight,
        fromObj: fromPlayer,
        toObj: toPlayer,
        animSpeed: speed,
        stackHorizontal,
        cardWidthOffset,
        cardHeightOffset,
        stackVertical,
        manual: false,
        tilt: tilt,
      });

      console.log('test')
    }

    counter++;

    if (counter >= numberOfCards) {
      counter = 0;
      clearInterval(dealLoop);
    }
  }, speed + 50)
};

export const moveCardToH = async (
  {
    index, card, fromObj, toObj, animSpeed, stackHorizontal, stackVertical, cardWidthOffset, cardHeightOffset, manual, tiltCard, cancelMove
  }) => {

  // console.log('toObj', toObj, 'fromObj', fromObj);
  // console.log('card style',card.dom.style);
  console.log('sbs', cardWidthOffset, 'stack', cardHeightOffset);

  // card dimes ignore margin & padding
  // let cardWidth = card.offsetWidth;
  // let cardHeight = card.offsetHeight;

  let toHandArea = toObj.hand.area;
  let fromHandArea = fromObj.hand.area;

  // card dimes
  let cardWidth = card.dom.clientWidth;
  let cardHeight = card.dom.clientHeight;

  // add tilt
  // let tiltRight = 'transform: rotate(90deg) scale(1) skew(1deg);';
  // let tiltLeft = 'transform: rotate(-90deg) scale(1) skew(-1deg);';

  // console.log('stack val', stackVertical);

  // set card style props
  if (!manual) {
    // console.log('not manual', manual);
    // this moves cards vertically
    if (stackHorizontal === false && stackVertical === false) {
      // console.log('no side by side');
      card.dom.style.transform = 'translate(0px,' + (toObj.hand.area.position.top - fromObj.hand.area.position.top) + 'px )';
      card.dom.style.transition = 'transform ' + animSpeed + 'ms';
      // card.dom.style.width = cardWidth + 'px';
    } else if (stackVertical) {
      // console.log('stackVertical', stackVertical, (toObj.hand.area.position.top - fromObj.hand.area.position.top) + stackVertical);
      card.dom.style.position = 'absolute';
      // get boxPosition to move to
      card.dom.style.transform = `translate(${(toObj.hand.area.position.left - fromObj.hand.area.position.left)}px,${(toObj.hand.area.position.top - fromObj.hand.area.position.top) + cardHeightOffset}px)`;
      card.dom.style.transition = 'transform ' + animSpeed + 'ms';
      // card.dom.style.transform += tiltLeft;
      card.dom.style.width = cardWidth + 'px';
    } else {
      card.dom.style.position = 'absolute';
      // get boxPosition to move to
      card.dom.style.transform = `translate(${(toObj.hand.area.position.left - fromObj.hand.area.position.left) + cardWidthOffset}px,${(toObj.hand.area.position.top - fromObj.hand.area.position.top)}px)`;
      card.dom.style.transition = 'transform ' + animSpeed + 'ms';
      // card.dom.style.transform += tiltLeft;
      card.dom.style.width = cardWidth + 'px';
    }

    card.dom.style.zIndex = index;
  }

  let toArea = document.getElementById(toObj.hand.area.id);

  // this moves cards horizontally
  let move = setTimeout(() => {
    // console.log('classList', card.dom.classList);
    // remove class name to prevent any previous card animations
    card.dom.className = "card-container";

    // remove it from the original div and set it into the toObj div, must be in set timeout
    toArea.appendChild(card.dom);

    // set the card into place and remove transition
    if (stackHorizontal != false && cardWidthOffset > 0) {
      card.dom.style.transform = 'translate(' + cardWidthOffset + 'px,0px )';
      card.dom.style.transition = 'transform 0ms';
    } else if (stackVertical != false && cardHeightOffset > 0) {
      card.dom.style.transform = `translate(0px,${cardHeightOffset}px )`;
      card.dom.style.transition = 'transform 0ms';
    } else {
      card.dom.style.transform = 'translate(0px,0px )';
      card.dom.style.transition = 'transform 0ms';
    }

    // card.dom.firstChild.className = 'card';

    // toObj.areas.self.onCardReceived(card);

    // TODO - may not want card to flip on move
    // if (toObj.hand.area.rules.cardsCanFlip === true) {
    // console.log(card.firstChild.getAttribute('id'));
    // console.log(theDeck);
    // this.doFlip(card, fromObj, toObj, 10, tiltCard);
    // }

    // remove card from fromObj hand into toObj hand
    fromObj.hand.cards.pop();
    toObj.hand.cards.push(card);
    console.log('add card toObj', toObj.hand.cards);

  }, animSpeed);

  // @TODO stop the card if some action
  if (cancelMove === true) {
    clearTimeout(move);
  }

}

// Just move one card
export const animateCardFromOneAreaToAnother = async ({ fromHand, toHand, card, speed = 300, moveCardObjects = true }) => {
  let cardWidth = card.dom.clientWidth;
  let cardHeight = card.dom.clientHeight;
  let cardWidthOffset = toHand.cards.length * (cardWidth + 5);
  let cardHeightOffset = toHand.cards.length * (cardHeight - (cardHeight / 2));
  let stackHorizontal = toHand.area.stackHorizontal;
  let stackVertical = toHand.area.stackVertical;
  let flexArea = toHand.area.flexArea;
  let autoStack = toHand.area.autoStack;
  let maxCardsInHorizontal = toHand.area.maxCardsInHorizontal;
  let row = 0;
  // console.log('cardHeight',cardHeight,'cardWidth',cardWidth);
  // console.log('area width', toHand.area.dom.offsetWidth, );

  // auto work out the amount of cards flex box can take
  if (flexArea && stackHorizontal && autoStack) {
    maxCardsInHorizontal = Math.floor(parseInt(toHand.area.dom.offsetWidth, 10) / parseInt(cardWidth, 10));
  }

  if (stackVertical) {
    // console.log('stackVertical', stackVertical);
    //@TODO set area to be vertical?
    // console.log('stackVertical', stackVertical, (toObj.hand.area.position.top - fromObj.hand.area.position.top) + stackVertical);
    card.dom.style.position = 'absolute';
    // get boxPosition to move to
    card.dom.style.transform = `translate(${(toHand.area.position.left - fromHand.area.position.left)}px,${(toHand.area.position.top - fromHand.area.position.top) + cardHeightOffset}px)`;
    card.dom.style.transition = 'transform ' + speed + 'ms';
    card.dom.style.width = cardWidth + 'px';
  } else if (stackHorizontal) {
    // console.log('stackHorizontal', toHand.area);
    // calculate row
    if (maxCardsInHorizontal > 0) {
      row = parseInt(toHand.cards.length / maxCardsInHorizontal, 10);
      cardWidthOffset = (cardWidth + 5) * (toHand.cards.length % maxCardsInHorizontal);
    }

    toHand.area.dom.style.display = flexArea ? 'flex' : 'relative';
    toHand.area.dom.style.flexWrap = flexArea ? 'wrap' : 'nowrap';
    card.dom.style.position = flexArea ? 'relative' : 'absolute';
    card.dom.style.transform = `translate(${(toHand.area.position.left - fromHand.area.position.left) + cardWidthOffset}px,${(toHand.area.position.top - fromHand.area.position.top) + (row * cardHeight)}px)`;
    card.dom.style.transition = 'transform ' + speed + 'ms';
    card.dom.style.width = cardWidth + 'px';
  } else {
    // console.log('no hori or vert');
    card.dom.style.transform = 'translate(0px,' + (toHand.area.position.top - fromHand.area.position.top) + 'px )';
    card.dom.style.transition = 'transform ' + speed + 'ms';
  }

  await wait(speed);

  // remove class name to prevent any previous card animations
  card.dom.className = "card-container";

  // remove it from the original div and set it into the toObj div, must be in set timeout
  toHand.area.dom.appendChild(card.dom);

  // set the card into place within the area now it has been appended and remove transition
  if (stackHorizontal) {

    // card.dom.style.position = flexArea ? 'relative' : 'absolute';
    card.dom.style.transform = flexArea ? `translate(0,0)` : `translate(${cardWidthOffset}px,${(row * (cardHeight + 5))}px )`;
    card.dom.style.transition = 'transform 0ms';
  } else if (stackVertical && cardHeightOffset > 0) {
    card.dom.style.transform = `translate(0px,${cardHeightOffset}px )`;
    card.dom.style.transition = 'transform 0ms';
  } else {
    card.dom.style.transform = 'translate(0px,0px )';
    card.dom.style.transition = 'transform 0ms';
  }

  // move cards in hand objects
  if(moveCardObjects) {
    fromHand.cards.removeCardFromHand(card);
    toHand.cards.addCardsToHand(card);
  }

  return Promise.resolve({ someVal: 'done' });
}

export const dealCards = async (dealer, toPlayers, options = {}) => {
  let defaultOptions = { totalCardsToDeal: 0, perPlayer: 0, speed: 300, sequential: false, delay: 1000 };
  let { totalCardsToDeal, perPlayer, speed, sequential, delay } = Object.assign({}, defaultOptions, options);

  let dealerHandLen = dealer.hand.cards.length;
  // check the dealer has cards
  if (!dealerHandLen > 0) {
    return Promise.reject({ error: 'no cards' });
  }

  await wait(delay);

  let playerLen = toPlayers.length;
  let count = 0;
  let playerIndex = 0;
  let noError = true;
  let counts = Array(playerLen).fill(0);

  if (perPlayer !== 0) {
    totalCardsToDeal = perPlayer > 0 ? perPlayer * playerLen : totalCardsToDeal;
  } else {
    perPlayer = totalCardsToDeal / playerLen;
  }

  while (count < totalCardsToDeal && dealerHandLen !== 0 && noError) {
    // get a ref to a card from the dealer
    let card = dealer.hand.getLastCard();
    // console.log('card', card);
    await animateCardFromOneAreaToAnother({
      fromHand: dealer.hand,
      toHand: toPlayers[playerIndex].hand,
      card: card,
      speed,
      moveCardObjects: false,
    });

    console.log('adding and poping card in deal')
    // remove after moving card in dom
    await dealer.hand.removeCardFromHand(card);
    // add after moving card in dom
    await toPlayers[playerIndex].hand.addCardToHand(card);

    counts[playerIndex] += 1;

    if (sequential) {
      if (toPlayers[playerIndex]) {
        playerIndex = playerIndex >= (playerLen - 1) ? 0 : (playerIndex + 1);
      }
    } else {
      if (counts[playerIndex] === perPlayer) {
        // console.log('player has enough cards, move index');
        playerIndex = playerIndex >= (playerLen - 1) ? 0 : (playerIndex + 1);
      }
    }

    count++;
    // console.log('card no.', count);
    // console.log('cards dealt to each player', counts);
  }

  // how do we add events to cards, specially when there are multiple hands (let the hands deal with events)
  return Promise.resolve({ someVal: 'done' });
}

// @TODO integrate or delete
export const detectArea = (mouseX, mouseY, playerPos, OpponentPos, arena, deck) => {

  var allareas = [playerPos, OpponentPos, arena, deck];
  var holder = null;

  for (var i = 0; i < allareas.length; i++) {

    if (mouseX <= allareas[i].right && mouseX >= allareas[i].left && mouseY >= allareas[i].top && mouseY <= allareas[i].bottom) {
//                    console.log('in area ' + allareas[i].name);

      holder = allareas[i].name;
      break;
    } else {
      holder = null;
    }

  }

  return holder;
}

export const addDomEvent = (object, type, fn) => {
  object.events[type] = fn;
  object.events[type] = object[type].bind(object);
  object.dom.addEventListener(type, object.events[type])
}

export const removeDomEvent = (object, type) => {
  object.dom.removeEventListener(type, object.events[type])
}

// export const cardJiggle = (cards = [], callback = () => {}, index = 0) => {
// export const cardShuffleOld = (cards = [], callback = () => {}, index = 0) => {
//
//   let cardObj1 = cards[index]
//   let cardObj2 = cards[index + 1]
//
//   let card1 = cardObj1.dom
//   let card2 = cardObj2.dom
//
//   card1.className = 'card-container shuffle-left';
//   // card1.style.zIndex =  (index + 1);
//
//   if(card2) {
//     // console.log('card2', card2);
//     card2.className = 'card-container shuffle-right';
//     // card2.style.zIndex = index;
//   }
//
//   setTimeout(() => {
//     card1.className = 'card-container shuffle-right';
//     if(card2) {
//       card2.className = 'card-container shuffle-left';
//       // @TODO switch elements in the deck.cards and deck._DOMCards props
//       swapDomElements(card1, card2);
//       let temp = cardObj1;
//       cards[index] = cardObj2
//       cards[index+1] = temp;
//     }
//
//     index +=2;
//     if (index <= (cards.length - 2)) {
//       cardShuffle(cards, callback, index);
//     } else {
//       // let index = 0;
//       // for (let card of cards) {
//       //     card.dom.style.zIndex = index;
//       //     index++;
//       // }
//       callback();
//     }
//
//   }, 50);
// }
