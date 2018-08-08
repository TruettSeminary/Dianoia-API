'use strict';

/**
 * Translation.js controller
 *
 * @description: A set of functions called "actions" for managing `Translation`.
 */

module.exports = {

  /**
   * Retrieve translation records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.translation.search(ctx.query);
    } else {
      return strapi.services.translation.fetchAll(ctx.query);
    }
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
   * Count translation records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.translation.count(ctx.query);
  },

  /**
   * Create a/an translation record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.translation.add(ctx.request.body);
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
