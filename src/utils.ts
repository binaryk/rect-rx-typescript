/*
 * This file contains the class named 'Utils'.
 * This class is just a collection of utility static functions.
*/

class Utils{
	//Here we generate a new Universally Unique Identify(UUID), which is used ti identify each task.
	public static uuid():string{
		var i, random;
		var uuid = '';
		for (i = 0; i < 32; i++) {
        	random = Math.random() * 16 | 0;
        	if (i === 8 || i === 12 || i === 16 || i === 20) {
          		uuid += '-';
        	}
        	uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
		}
		return uuid;
	}
	
	//Here we add 's' tho the end of a given word when count >.
	public static pluralize(count, word){
		return count === 1 ? word : word + 's';
    }
	
    //Here we use the localStorage API to store the data.
    public static store(namespace, data?){
		if (data) {
			return localStorage.setItem(namespace, JSON.stringify(data));
      	}
		var store = localStorage.getItem(namespace);
      	return (store && JSON.parse(store)) || [];
	}
	
	//Here we create a function to help us with the inheritance.
	public static extend(...objs: any[]):any{
		var newObj = {};
		for(var i =0; i<objs.length; ++i){
			var obj = objs[i];
			for(var key in obj){
				if(obj.hasOwnProperty(key)){
					newObj[key] = obj[key];
				}
			}
		}
		return newObj;
	}
	
}

export default Utils;