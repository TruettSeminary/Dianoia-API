module.exports = async (ctx, next) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }

    // either the _id param was not given, or the given _id is not the same as the current user
    else if(!ctx.request.params._id || ctx.state.user._id.toHexString() !== ctx.request.params._id) {
        return ctx.unauthorized(); 
    }

    await next();
};
  