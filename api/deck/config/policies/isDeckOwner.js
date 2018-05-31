module.exports = async (ctx, next) => {

    const deck = await strapi.services.deck.fetch({
        "_id": ctx.params._id
    }); 

    if(!deck) {
        ctx.response.notAcceptable('Invalid deck id'); 
    }
    
    if(!deck.owner._id.equals(ctx.state.user._id)) {
        ctx.unauthorized(); 
    }

    await next();
};