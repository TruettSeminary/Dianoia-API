'use strict';

/**
 * Translation.js controller
 *
 * @description: A set of functions called "actions" for managing `Translation`.
 */

module.exports = {

  /**
  * Count translation records.
  *
  * @return {Number}
  */

  count: async (ctx) => {
    return strapi.services.translation.count(ctx.query);
  },

  /**
   * Retrieve translation records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const translations = await strapi.services.translation.fetchAll(ctx.query);

    return translations.reduce((translations, translation) => {
      translation.decks = strapi.apiUtils.stripData(translation.decks);
      translations.push(translation); 
      
      return translations; 
    }, []); 
  },

  /**
   * Retrieve a translation record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.translation.fetch(ctx.params);
  },

  /**
   * Create a/an translation record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const translation =  strapi.services.translation.add(ctx.request.body);

    translation.decks = strapi.apiUtils.stripData(translation.decks); 

    return translation; 
  },

  /**
   * Update a/an translation record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.translation.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an translation record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.translation.remove(ctx.params);
  }
};
