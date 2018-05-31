'use strict';

/**
 * Deck.js controller
 *
 * @description: A set of functions called "actions" for managing `Deck`.
 */

module.exports = {

  /**
   * Retrieve deck records.
   *
   * @return {Object|Array}
   */
  find: async (ctx) => {
    let decks = await strapi.services.deck.fetchAll(ctx.query)

    // TODO monitor this query as once the number of decks grows too larger it might be a bit harder
    return decks.filter((deck)=>{
      if(!deck.owner) return true; 
      if(deck.owner._id.equals(ctx.state.user._id)) return true; 
      return false; 
    });
  },

  /**
   * Retrieve a deck record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.deck.fetch(ctx.params);
  },

  /**
   * Create a/an deck record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.deck.add(ctx.request.body);
  },

  /**
   * Update a/an deck record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.deck.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an deck record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.deck.remove(ctx.params);
  }
};
