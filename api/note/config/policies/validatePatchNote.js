module.exports = async (ctx, next) => {
    // reject, because there must be a card associated with a note
    if(!ctx.request.body._id) {
        // creating a new note
        const potential_card_id = ctx.request.body.card_id || ctx.request.body.card; 

        if(!potential_card_id) {
          ctx.response.notAcceptable('Valid card or note was not provided'); 
        }
        
        const card_id = strapi.apiUtils.validateMongoID(potential_card_id); 
    
        if(!card_id) {
            ctx.response.notAcceptable('Given card id is not formatted correctly'); 
        }
    
        // ensure the card number is valid
        const card = await strapi.services.card.fetch({
            "_id": card_id
        }); 
    
        if(!card) {
            ctx.response.notAcceptable('Given card id does not exist'); 
        }
    
        ctx.request.body.card = card; 

        // format request user
        if(ctx.request.body.user === undefined) {
            ctx.request.body.user = {
                "_id": ctx.state.user._id.toHexString()
            }
        }
    }
    else {
        const note = await strapi.services.note.fetch({
            "_id": ctx.request.body._id
        }); 
    
        if(!note) {
            ctx.response.notAcceptable('Invalid note id'); 
        }
        
        if(!note.user._id.equals(ctx.state.user._id)) {
            ctx.unauthorized(); 
        }
    }

    await next();
};
  