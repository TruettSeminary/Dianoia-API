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
    }
};