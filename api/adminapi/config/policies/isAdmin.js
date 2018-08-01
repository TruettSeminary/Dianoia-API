module.exports = async (ctx, next) => {

    // TODO: validate that user has the admin role assigned

    await next();
};