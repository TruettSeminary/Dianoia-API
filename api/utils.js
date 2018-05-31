// functions for general use

module.exports = {

    validateMongoID: (_id) => {
        let toRe = _id.match(/^[0-9a-fA-F]{24}$/);
        if(!toRe) return null; 
        return toRe[0]; 
    }
};