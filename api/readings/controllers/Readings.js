'use strict';

/**
 * Readings.js controller
 *
 * @description: A set of functions called "actions" for managing `Readings`.
 */

module.exports = {


  /**
  * Count readings records.
  *
  * @return {Number}
  */
  count: async (ctx) => {
    return strapi.services.readings.count(ctx.query);
  },

  /**
   * Retrieve readings records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    return strapi.services.readings.fetchAll(ctx.query);
  },

  /**
   * Retrieve a readings record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.readings.fetch(ctx.params);
  },

  /**
   * Create a/an readings record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.readings.add(ctx.request.body);
  },

  /**
   * Update a/an readings record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.readings.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an readings record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.readings.remove(ctx.params);
  }
};
