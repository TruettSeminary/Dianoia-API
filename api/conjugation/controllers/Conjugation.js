'use strict';

/**
 * Conjugation.js controller
 *
 * @description: A set of functions called "actions" for managing `Conjugation`.
 */

module.exports = {

  /**
   * Retrieve conjugation records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    return strapi.services.conjugation.fetchAll(ctx.query);
  },

  /**
   * Retrieve a conjugation record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.conjugation.fetch(ctx.params);
  },

  /**
   * Create a/an conjugation record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.conjugation.add(ctx.request.body);
  },

  /**
   * Update a/an conjugation record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.conjugation.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an conjugation record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.conjugation.remove(ctx.params);
  }
};
