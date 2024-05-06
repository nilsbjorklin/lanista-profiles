import compareObjects from "./compareObjects";

Array.prototype.equals = function (array: any[]) {
    if (!array)
        return false;

    if (array === this)
        return true;

    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;

        } else if (this[i] != array[i]) {
            if (this[i] instanceof Object && array[i] instanceof Object) {
                if (!compareObjects(this[i], array[i]))
                    return false;
            } else {
                return false;
            }
        }
    }
    return true;
}

// Hide method from for-in loops
declare global {
    interface Array<T> {
        equals(array: T[]): boolean;
    }
}