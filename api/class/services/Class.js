'use strict';

/**
 * Class.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
  * Promise to count classes.
  *
  * @return {Promise}
  */
  count: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('class', params);

    return Class
      .count()
      .where(filters.where);
  },

  /**
   * Promise to fetch all classes.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    const convertedParams = strapi.utils.models.convertParams('class', params);

    return Class
      .find()
      .where(convertedParams.where)
      .sort(convertedParams.sort)
      .skip(convertedParams.start)
      .limit(convertedParams.limit)
      .populate(_.keys(_.groupBy(_.reject(strapi.models.class.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to fetch a/an class.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    return Class
      .findOne(_.pick(params, _.keys(Class.schema.paths)))
      .populate(_.keys(_.groupBy(_.reject(strapi.models.class.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to add a/an class.
   *
   * @return {Promise}
   */
  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Class.associations.map(ast => ast.alias));
    const data = _.omit(values, Class.associations.map(ast => ast.alias));
  
    // Create entry with no-relational data.
    const entry = await Class.create(data);
  
    // Create relational data and return the entry.
    return Class.updateRelations({ _id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an class.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Class.associations.map(a => a.alias));
    const data = _.omit(values, Class.associations.map(a => a.alias));
  
    // Update entry with no-relational data.
    const entry = await Class.update(params, data, { multi: true });
  
    // Update relational data and return the entry.
    return Class.updateRelations(Object.assign(params, { values: relations }));
  },
  /**
   * Promise to remove a/an class.
   *
   * @return {Promise}
   */
  remove: async params => {
    // Select field to populate.
    const populate = Class.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');
  
    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Class
      .findOneAndRemove(params, {})
      .populate(populate);
  
    if (!data) {
      return data;
    }
  
    await Promise.all(
      Class.associations.map(async association => {
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
