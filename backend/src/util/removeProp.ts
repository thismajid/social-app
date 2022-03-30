export function removeProp(obj, propToDelete) {
  for (const property in obj) {
    if (typeof obj[property] == 'object') {
      delete obj.property;
      let newJsonData = removeProp(obj[property], propToDelete);
      obj[property] = newJsonData;
    } else {
      if (property === propToDelete) {
        delete obj[property];
      }
    }
  }
  return obj;
}
