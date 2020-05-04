//Função única de tornar uma String, um Array.
module.exports = function parseStringAsArray(arrayAsString) {
    return arrayAsString.split(',').map(tech => tech.trim());
  }