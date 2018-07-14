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
  },

  /**
   * Bulk create cards
   * 
   * @return {Object}
   */
  bulkCreate: async (ctx) => {
    // if file is csv, convert to json

    const importedCards = ctx.request.body.data; 
    
    if(ctx.request.body.type !== 'json') {
      return ctx.response.notAcceptable('Data for bulk upload must be JSON'); 
    }

    // find all decks that need to be created
    const deckNames = importedCards.reduce((deckNames, card) => {

      card.decks.forEach((cardDeck) => {
        if(!deckNames.includes(cardDeck)) deckNames.push(cardDeck); 
      }); 

      return deckNames; 
    }, []); 

    const deckMap = (await Promise.all(deckNames.map((deckName) => {
      return strapi.services.deck.fetchOrAdd({
        name: deckName
      }); 
    }))).reduce((decks, deck) => {
      decks[deck.name] = deck.id; // string id
      return decks; 
    }, {});

    const cards = await Promise.all(importedCards.map((card) => {
      const decks = card.decks.map((deckName) => {
        return deckMap[deckName];
      });
      return strapi.services.card.add({
        ...card, 
        decks
      })
    })); 

    return cards; 
  }
};
