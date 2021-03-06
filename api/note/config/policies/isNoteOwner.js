module.exports = async (ctx, next) => {

    // if(ctx.params.note_id) ctx.params._id = ctx.params.note_id; 

    const note = await strapi.services.note.fetch({
        "_id": ctx.params._id
    }); 

    if(!note) {
        ctx.response.notAcceptable('Invalid note id'); 
    }
    
    if(!note.user._id.equals(ctx.state.user._id)) {
        ctx.unauthorized(); 
    }

    await next();
};