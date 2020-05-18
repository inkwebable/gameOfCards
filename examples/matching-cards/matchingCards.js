import { Game } from '../../src';
import { cardShuffle, dealCards } from '../../src/helpers/utils';

export default (async() => {

  let game = new Game({
    name: 'Matching Cards',
    data: {
      clickCount: 0,
      foundPairs: 0,
      matched: [],
      flipped: {},
      timeToMemorise: 300,
      numberOfCards: 12,
    },
  });

  console.log('game', game);

  const deck1 = game.createStandardDeck(1, 'matching-pears', 'js-deck');

  // can pass deck ids to each of these methods
  game.shuffleDeckCards().makeDomMarkUp().addDeckToDom();
  game.assignCardDomToCardObj();

  game.createPlayer('dealer1', 'AI Dealer', {}, true)
    .createHand('dealer1')
    .createArea('js-deck','deck',{ owner: 'dealer', stackVertical: false });

  game.createPlayer('player1', 'Thien', {}, true)
    .createHand('hand1', {})
    .createArea('hand1', 'area1', {
      owner: 'player',
      flexArea: true,
      stackHorizontal: true,
      // stackVertical: false,
      // maxCardsInHorizontal: 3,
      autoStack: true
    })
    .setObserver();

  // area received a card, do something
  game.findPlayerById('player1').hand.area.onCardAdded = function(card) {
    const area = this;
    const hand = area.hand;
    console.log('hand.area.onCardAdded', card.querySelector('.card').id );
  }

  let handleCardClick = function onCardClick(evt) {
    // const onCardClick = (evt) => {

    console.log('onCardClick', this);

    // should allowflip be on the deck or the game or the hand?
    if (this.allowFlip === true && !this.transitioning) {

      if (Object.keys(game.data.flipped).length < 2) {

        if (!game.data.flipped.hasOwnProperty(this._id)) {
          // console.log('flippedCardFace',game.data.flipped,this);

          game.data.clickCount++;
          // console.log(game.data.clickCount);

          if (this.flipCardFaceUp()) {
            game.data.flipped[this._id] = this;
          } else {
            // this is surely redundant logic!!
            alert('flipCardFaceUp is false');
            this.flipCardFaceDown();
          }
        } else {
          // @TODO remove
          console.log('this already flipped', game.data.flipped.hasOwnProperty(this._id));
        }
      }

    } else {
      // @TODO remove
      console.log('card not flippable or is transitioning', this);
    }
  }

  let afterCardFlipUp = function onCardFlipUp(options) {
    console.log('afterCardFlipUp', this, options);
    return function (evt) {
      console.log('afterCardFlip ret', evt, options, game.data.flipped, game.findPlayerById('player1').hand.allCardsTransitioned());

      if (Object.keys(game.data.flipped).length >= 2 && game.findPlayerById('player1').hand.allCardsTransitioned()) {
        // console.log('2 cards in flipped', game.data.flipped, game.data.timeToMemorise);

        // @TODO consider getter and setter?
        game.findPlayerById('player1').hand.allowFlip = false;

        setTimeout(() => {

          if (cardsMatch()) {

            // @TODO would be clearer as game.cards.removeEvents??
            game.removeEvents(game.data.flipped);

            // remove events and add matched class name to cards
            for (let matchedCard in game.data.flipped) {
              game.data.flipped[matchedCard].addDOMClassContainer('matched');
              // game.data.flipped[matchedCard].clearClick();
              // game.data.flipped[matchedCard].clearTransition();
            }

            // update & reset game & deck values
            game.data.foundPairs += 1;

            game.data.flipped = {};
            game.findPlayerById('player1').hand.allowFlip = true;

            // check if player won the game @TODO make this = to the length of cards
            console.log('if won', game);
            if ((game.data.foundPairs === (game.findDeckById(1).cards.length / game.findDeckById(1).numberOfEachCard)) && (game.data.matched.length === game.findDeckById(1).cards.length)) {
              playerWon();
            }

          } else {
            // flip cards back (could be resetPropCards(prop))

            // game.deck.resetFlippedCards(() => {
            //   // allow flipping of cards (should be game values??)
            //   game.data.flipped = {};
            //   game.findPlayerById'player1.hand.allowFlip = true;
            // });

            for (let cardObjId in game.data.flipped) {
              console.log('flipped', game.data.flipped[cardObjId]);
              game.data.flipped[cardObjId].flipCardFaceDown();
            }

            game.data.flipped = {};
            game.findPlayerById('player1').hand.allowFlip = true;

          }

        }, game.deck.timeToMemorise);
      }
    }()

  }

  let afterCardFlipDown = function onCardFlipDown(evt) {
    // confusing to know which or what this to an end user
    console.log('deleting from deck.flipped ' + this._id);
    delete game.data.flipped[this._id];
  }

  function cardsMatch() {

    console.log('do cards match', game.data.flipped, game.data.matched);
    // right amount of cards to test against?
    if (Object.keys(game.data.flipped).length >= 2) {

      // check if cards are new matches
      if (game.data.matched.indexOf(game.data.flipped[Object.keys(game.data.flipped)[0]].name) === -1 && game.data.matched.indexOf(game.data.flipped[Object.keys(game.data.flipped)[1]].name) === -1) {

        // do they match?
        if (game.data.flipped[Object.keys(game.data.flipped)[0]].name === game.data.flipped[Object.keys(game.data.flipped)[1]].name) {

          // move card ids to winner array or object
          game.data.matched.push(game.data.flipped[Object.keys(game.data.flipped)[0]]._id);
          game.data.matched.push(game.data.flipped[Object.keys(game.data.flipped)[1]]._id);

          return true;
        }
      }
      // @TODO fix when id of flipped match is equal to the flipped object name ie. 6
      console.log('no match', game, game.data.flipped, game.data.flipped[Object.keys(game.data.flipped)[0]].name, game.data.flipped[Object.keys(game.data.flipped)[1]].name);
      return false;
    }
    alert('not enough cards flipped');
    return false;
  }

  function playerWon() {
    console.log('Called playerWon', game);
    // let removed = game.findPlayerById('player1').hand.removeCardEvents();
    // console.log('removed', removed);

    if (game.data.foundPairs === (game.data.numberOfCards / 2)) {
      let addToBoard = confirm(`You finished the game in ${game.data.clickCount} clicks, add to score board?`);

      if (addToBoard === true) {
        let player = prompt('Please enter your name');
        if (player === '') {
          player = "Unknown Player";
        }

        let xhr;
        if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
        } else {
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        let url = "matching-pairs/add-score";
        let params = `score=${game.data.clickCount}&name=${player}&pair_amount=${game.data.foundPairs}`;

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("success");
            // setTimeout(function () {
            //     location.reload();
            // }, 1000);

          } else {
            console.log("failed to send request");
            // options
            // give player button to try again
            // add score to storage and allow player to try again ( player can cheat )
            // store score in session
            // send score, name etc to a google docs sheet?
          }
        };
        xhr.send(params);

      } else {
        // @TODO reset game?
      }
    }
  }

  // add event when card is added to hand
  game.findPlayerById('player1').hand.handleCardAdded = (card, hand) => {
    // card.setClickEvent(() => {
    //   console.log('card', card, 'hand',hand, 'this', this);
    // });
    card.setClickEvent(handleCardClick);
    card.setTransitionEvent({ onCardFaceUp: afterCardFlipUp, onCardFaceDown: afterCardFlipDown});
  };

  game.findPlayerById('dealer1').hand.addCardsToHand(game.findDeckById(1).cards);

  await cardShuffle(game.findPlayerByName('AI Dealer').hand.cards, () => {
    console.log('cardShuffle cb')
  }).then((data) => {
    console.log('cardShuffle then', data);
  });

  let totalCards = game.findPlayerByName('AI Dealer').hand.cards.length;

  let dealerTest = await dealCards(
    game.findPlayerByName('AI Dealer'),
    [
      game.findPlayerByName('Thien'),
      // game.findPlayerByName('Thien2')
    ], {
      totalCardsToDeal: totalCards, // ignored if perPlayer is set
      // perPlayer: 3, // overrides totalCardsToDeal
      sequential: false, // deal sequentially
    });
  console.log('dealerTest', dealerTest);

  // add card events to hand after dealing
  // game.findPlayerByName('Thien').hand.setCardClick(onCardClick);
  // game.findPlayerByName('Thien').hand.setAfterCardFaceUp(afterCardFlipUp);
  // game.findPlayerByName('Thien').hand.setAfterCardFaceDown(afterCardFlipDown);
  // game.findPlayerByName('Thien').hand.setUpCardEvents();

  console.log('async deal');
  //place cards next to each other
  // deal(
  //   game.findPlayerByName('AI Dealer'),
  //   game.findPlayerByName('Thien'), {
  //     numberOfCards: 12,
  //     stackHorizontal: true,
  //     speed: 3000
  //   });
})()
