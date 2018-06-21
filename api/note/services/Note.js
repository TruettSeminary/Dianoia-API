'use strict';

/**
 * Note.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
  * Promise to count articles.
  *
  * @return {Promise}
  */

  count: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('note', params);

    return Notes
      .count()
      .where(filters.where);
  },

  /**
   * Promise to fetch all notes.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    const convertedParams = strapi.utils.models.convertParams('note', params);

    return Note
      .find()
      .where(convertedParams.where)
      .sort(convertedParams.sort)
      .skip(convertedParams.start)
      .limit(convertedParams.limit)
      .populate(_.keys(_.groupBy(_.reject(strapi.models.note.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to fetch a/an note.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    return Note
      .findOne(_.pick(params, _.keys(Note.schema.paths)))
      .populate(_.keys(_.groupBy(_.reject(strapi.models.note.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to add a/an note.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Note.associations.map(ast => ast.alias));
    const data = _.omit(values, Note.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Note.create(data);

    // Create relational data and return the entry.
    const newNote =  Note.updateRelations({ id: entry.id, values: relations });
    if(values.card && !newNote.card) {
      if(values.card._id) newNote.card = values.card._id; 
      else newNote.card = card; 
    }
    else if(values.card_id && !newNote.card) {
      newNote.card = values.card_id; 
    }

    return newNote;
  },

  /**
   * Promise to edit a/an note.
   *
   * @return {Promise}
   */
  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Note.associations.map(a => a.alias));
    const data = _.omit(values, Note.associations.map(a => a.alias));
  
    // Update entry with no-relational data.
    const entry = await Note.update(params, data, { multi: true });
  
    // Update relational data and return the entry.
    const newNote = await Note.updateRelations(Object.assign(params, { values: relations }));
    if(newNote.user && newNote.user._id) {
      newNote.user = newNote.user._id; 
    } 

    if(newNote.card && newNote.card._id) {
      newNote.card = newNote.card._id
    }

    return newNote; 
  },

  /**
   * Promise to remove a/an note.
   *
   * @return {Promise}
   */
  remove: async params => {
    // Select field to populate.
    const populate = Note.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');
  
    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Note
      .findOneAndRemove(params, {})
      .populate(populate);
  
    if (!data) {
      return data;
    }
  
    await Promise.all(
      Note.associations.map(async association => {
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
