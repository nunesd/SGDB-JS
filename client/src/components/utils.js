export const utils = {
    findElemWithIndex: (array, column, value) => {
        let finded = null;
        array.forEach((elem, index) => {
            if(elem[column] === value) {
                finded = {index, data: elem}
            }
        });
        return finded
    }
}