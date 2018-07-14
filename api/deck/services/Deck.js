'use strict';

/**
 * Deck.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {


  /**
  * Promise to count decks.
  *
  * @return {Promise}
  */

  count: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('deck', params);

    return Deck
      .count()
      .where(filters.where);
  },

  /**
   * Promise to fetch all decks.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    const convertedParams = strapi.utils.models.convertParams('deck', params);

    return Deck
      .find()
      .where(convertedParams.where)
      .sort(convertedParams.sort)
      .skip(convertedParams.start)
      .limit(convertedParams.limit)
      .populate(_.keys(_.groupBy(_.reject(strapi.models.deck.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to fetch a/an deck.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    return Deck
      .findOne(_.pick(params, _.keys(Deck.schema.paths)))
      .populate(_.keys(_.groupBy(_.reject(strapi.models.deck.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  fetchOrAdd: async(values) => {
    if(values._id) {
      return await strapi.services.deck.fetch(values); 
    }
    else if(values.name) {
      let decks = await strapi.services.deck.fetchAll(values); 
      
      // Deck with name exists
      if(decks.length) return decks[0]; 

      // Deck with name does not exist --> create it
      else return await strapi.services.deck.add(values);
    }
    else return null; 
  },

  /**
   * Promise to add a/an deck.
   *
   * @return {Promise}
   */
  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Deck.associations.map(ast => ast.alias));
    const data = _.omit(values, Deck.associations.map(ast => ast.alias));
  
    // Create entry with no-relational data.
    const entry = await Deck.create(data);
  
    // Create relational data and return the entry.
    return Deck.updateRelations({ id: entry.id, values: relations });
  },
  /**
   * Promise to edit a/an deck.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Deck.associations.map(a => a.alias));
    const data = _.omit(values, Deck.associations.map(a => a.alias));
  
    // Update entry with no-relational data.
    const entry = await Deck.update(params, data, { multi: true });
  
    // Update relational data and return the entry.
    return Deck.updateRelations(Object.assign(params, { values: relations }));
  },
  /**
   * Promise to remove a/an deck.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Select field to populate.
    const populate = Deck.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');
  
    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Deck
      .findOneAndRemove(params, {})
      .populate(populate);
  
    if (!data) {
      return data;
    }
  
    await Promise.all(
      Deck.associations.map(async association => {
        const search = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
        const update = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: null } : { $pull: { [association.via]: data._id } };
  
        // Retrieve model.
        const model = association.plugin ?
          strapi.plugins[association.plugin].models[association.model || association.collection] :
          strapi.models[association.model || association.collection];
  
        return model.update(search, update, { multi: true });
      })
    );
  
    return data;
  }
};
