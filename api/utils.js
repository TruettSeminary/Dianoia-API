// functions for general use

const csv = require('csvtojson'); 

module.exports = {

    validateMongoID: (_id) => {
        let toRe = _id.match(/^[0-9a-fA-F]{24}$/);
        if(!toRe) return null; 
        return toRe[0]; 
    }, 
    readCSV: async(data) => {
        return csv().fromString(data); 
    }, 

    // assumes data is an array of objects with object id; 
    // returns an array of the ids; 
    stripData: (data) => {
        return data.map((obj) => {
            return obj._id; 
        }); 
    }
};