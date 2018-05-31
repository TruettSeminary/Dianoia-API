module.exports = async (ctx, next) => {
    // reject, because there must be a card associated with a note
    if(!ctx.request.body.card_id) {
      ctx.response.notAcceptable('No card for the note was provided'); 
    }
    
    const card_id = strapi.apiUtils.validateMongoID(ctx.request.body.card_id); 

    if(!card_id) {
        ctx.response.notAcceptable('Given card id is not formatted correctly'); 
    }
    // ensure the card number is valid
    const card = await strapi.services.card.fetch({
        "_id": ctx.request.body.card_id
    }); 

    if(!card) {
        ctx.response.notAcceptable('Given card id does not exist'); 
    }

    ctx.request.body.card = card; 

    // format request user
    ctx.request.body.user = {
        "_id": ctx.state.user._id.toHexString()
    }

    const note = await strapi.services.note.fetch({
        card: ctx.request.body.card, 
        user: ctx.request.body.user
    }); 

    // a note for this user and card already exists. Don't create it!
    if(note) {
        ctx.response.notAcceptable('A note for this user and card already exists!'); 
    }

    await next();
};
  