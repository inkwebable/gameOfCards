import Player from './Player';

/**
 * @class
 */
export default class AiPlayer extends Player {
  constructor({ id, name, options }) {
    super(id, name, options);

    Object.defineProperty(this, 'dealer', {
      value: options.dealer,
      writable: false
    });
  }
}
