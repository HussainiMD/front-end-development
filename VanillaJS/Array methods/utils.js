const utils ={};

utils.isValidString = function(str) {
    return (typeof str === 'string' && str.length > 0);
}

utils.toNumsArray = function(str) {
    if(!this.isValidString(str)) return;
    const charArray = str.split(',');
    return charArray.map(char => {
        char = char.trim();
        if(char.length == 0 || Number.isNaN(parseInt(char))) return 0;
        return parseInt(char);
    })
}

utils.toCameCase = function(str) {
    if(!this.isValidString(str)) return;
    return str[0].toUpperCase() + str.slice(1);     
}

export {utils}
