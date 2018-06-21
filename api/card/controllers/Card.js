'use strict';

/**
 * Card.js controller
 *
 * @description: A set of functions called "actions" for managing `Card`.
 */

module.exports = {

    /**
    * Count card records.
    *
    * @return {Number}
    */

  count: async (ctx) => {
    return strapi.services.card.count(ctx.query);
  },

  /**
   * Retrieve card records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    // TODO: watch this for performance issues (is there a way to do the filtering in mongo?)
    const cards = await strapi.services.card.fetchAll(ctx.query);

    const userHasDeck = (deck) => {
      return ctx.state.user.decks.reduce((curVal, userDeck) => {
        return curVal || userDeck._id.equals(deck._id); 
      }, false);
    }; 

    return cards.reduce((newCards, card) => {

      // filter cards that the user owns
      if(!card.owner || card.owner._id.equals(ctx.state.user._id)) {

        // filter card to decks the user belongs to
        card.decks = card.decks.reduce((newDecks, deck) => {
          if(userHasDeck(deck)) {
            newDecks.push(deck._id); 
          }
          return newDecks; 
        }, []); 

        if(card.decks.length) {
          
          card.notes = null; 
          card.translations = null; 

          newCards.push(card); 
        }
      }

      return newCards; 
    }, []) 
  },

  /**
   * Retrieve a card record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.card.fetch(ctx.params);
  },

  /**
   * Create a/an card record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.card.add(ctx.request.body);
  },

  /**
   * Update a/an card record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.card.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an card record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.card.remove(ctx.params);
  }
};
