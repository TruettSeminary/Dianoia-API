'use strict';

/**
 * Deck.js controller
 *
 * @description: A set of functions called "actions" for managing `Deck`.
 */

module.exports = {

  /**
  * Count deck records.
  *
  * @return {Number}
  */

  count: async (ctx) => {
    return strapi.services.deck.count(ctx.query);
  },

  /**
   * Retrieve deck records.
   *
   * @return {Object|Array}
   */
  find: async (ctx) => {
    const  allDecks = await strapi.services.deck.fetchAll(ctx.query)

    // TODO: monitor this query as once the number of decks grows too larger it might be a bit harder
    return allDecks.reduce((decks, deck)=>{
      if(!deck.owner || deck.owner._id.equals(ctx.state.user._id)) {
        deck.users = null; 
        deck.cards = strapi.apiUtils.stripData(deck.cards); 
        deck.classes = strapi.apiUtils.stripData(deck.classes); 
        deck.translations = strapi.apiUtils.stripData(deck.translations); 
        
        decks.push(deck); 
      }

      return decks; 
    }, []);
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

  findOneOrCreate: async(ctx) => {
    const deck = await strapi.services.deck.fetchOrAdd(ctx.request.body); 
    if(deck) return deck; 
    
    return ctx.response.notAcceptable('A name or id is required for this method'); 
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
