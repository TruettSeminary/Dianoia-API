'use strict';

/**
 * Adminapi.js controller
 *
 * @description: A set of functions called "actions" for managing `Adminapi`.
 */

module.exports = {


  findCard: async (ctx) => {
    return strapi.services.card.fetchAll(ctx.query); 
  },

  findDeck: async (ctx) => {
    return strapi.services.deck.fetchAll(ctx.query); 
  },


  findTranslation: async (ctx) => {
    const translations = await strapi.services.translation.fetchAll(ctx.query);

    return translations.reduce((translations, translation) => {
      translation.decks = strapi.apiUtils.stripData(translation.decks);
      translations.push(translation); 
      
      return translations; 
    }, []); 
  },

  createTranslation: async (ctx) => {
    const translation =  await strapi.services.translation.add(ctx.request.body);

    translation.decks = strapi.apiUtils.stripData(translation.decks); 

    return translation; 
  },


  updateTranslation: async (ctx, next) => {
    const translation = await strapi.services.translation.edit(ctx.params, ctx.request.body) ;

    translation.decks = strapi.apiUtils.stripData(translation.decks); 

    return translation; 
  },


  destroyTranslation: async (ctx, next) => {
    return strapi.services.translation.remove(ctx.params);
  } 
};
