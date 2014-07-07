function doubleInteger(i) {
    return i * 2;
}

function isNumberEven(i) {
    return i % 2 === 0 ? true : false;
}

function getFileExtension(i) {
    i = i.split('.');
    
    if(i.length === 1)
        return false;
    else
        return i[i.length-1];
    
}

function longestString(array) {
    var index = 0;
    for(var i=1 ; i<array.length; i++){
        if(array[index] && array[index].length < array[i].length && typeof(array[i]) === 'string' || typeof(array[index]) != 'string'){
                index = i;
        }
    }
    
    return array[index];
}

function arraySum(array) {
    var sum = 0;
    for(var i=0; i<array.length; i++){
        if(typeof(array[i]) === 'number')
            sum += array[i];
        else if(typeof(array[i]) === 'object')
            sum += arraySum(array[i]);
    }
    
    return sum;
}