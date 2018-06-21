function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = async (ctx, next) => {

    const {email, password} = ctx.request.body; 

    // check and ensure this is a valid email address
    if(!validateEmail(email)) {
        return ctx.response.notAcceptable('The email provided is not a valid address'); 
    }

    // TODO: make sure password meets criteria
    // TODO: put this on the front end! 


    await next();
};