'use strict';

/**
 * Class.js controller
 *
 * @description: A set of functions called "actions" for managing `Class`.
 */

module.exports = {

  /**
   * Retrieve class records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const classes = await strapi.services.class.fetchAll(ctx.query);
    // return classes; 
    return classes.map((clazz) => {
      const decks = clazz.decks.filter((deck) => {
        if(!deck.owner) return true; 
        if(deck.owner.id.equals(ctx.state.user._id.id)) return true; 
        return false; 
      }); 
      clazz.decks = decks; 
      return clazz; 
    }); 
  },

  /**
   * Retrieve a class record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.class.fetch(ctx.params);
  },

  /**
   * Create a/an class record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.class.add(ctx.request.body);
  },

  /**
   * Update a/an class record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.class.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an class record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.class.remove(ctx.params);
  }
};
