'use strict';

/**
 * Translation.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
  * Promise to count translations.
  *
  * @return {Promise}
  */

  count: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('translation', params);

    return Translation
      .count()
      .where(filters.where);
  },
  /**
   * Promise to fetch all translations.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    const convertedParams = strapi.utils.models.convertParams('translation', params);

    return Translation
      .find()
      .where(convertedParams.where)
      .sort(convertedParams.sort)
      .skip(convertedParams.start)
      .limit(convertedParams.limit)
      .populate(_.keys(_.groupBy(_.reject(strapi.models.translation.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to fetch a/an translation.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    return Translation
      .findOne(_.pick(params, _.keys(Translation.schema.paths)))
      .populate(_.keys(_.groupBy(_.reject(strapi.models.translation.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to add a/an translation.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Translation.associations.map(ast => ast.alias));
    const data = _.omit(values, Translation.associations.map(ast => ast.alias));
  
    // Create entry with no-relational data.
    const entry = await Translation.create(data);
  
    // Create relational data and return the entry.
    return Translation.updateRelations({ id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an translation.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Translation.associations.map(a => a.alias));
    const data = _.omit(values, Translation.associations.map(a => a.alias));
  
    // Update entry with no-relational data.
    const entry = await Translation.update(params, data, { multi: true });
  
    // Update relational data and return the entry.
    return Translation.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an translation.
   *
   * @return {Promise}
   */
  remove: async params => {
    // Select field to populate.
    const populate = Translation.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');
  
    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Translation
      .findOneAndRemove(params, {})
      .populate(populate);
  
    if (!data) {
      return data;
    }
  
    await Promise.all(
      Translation.associations.map(async association => {
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
