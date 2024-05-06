export default function compareObjects(obj1: { [key: string]: any }, obj2: { [key: string]: any }): boolean {
    let obj1Keys = Object.keys(obj1);
    let obj2Keys = Object.keys(obj2);
    if (!obj1Keys.equals(obj2Keys)) {
        return false;
    }
    let result = true;

    obj1Keys.forEach(key => {
        if (obj1[key] instanceof Array && obj2[key] instanceof Array) {
            if (!obj1[key].equals(obj2[key]))
                result = false;
        } else if (obj1[key] !== obj2[key]) {
            if (obj1[key] instanceof Object && obj2[key] instanceof Object) {
                if (!compareObjects(obj1[key], obj2[key]))
                    result = false;
            } else {
                result = false;
            }
        }
    })
    return result;
}