module.exports = {
  // Custom functions for Artillery tests
  randomString: () => {
    return Math.random().toString(36).substring(2, 15);
  },
  
  randomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  pick: (array) => {
    return array[Math.floor(Math.random() * array.length)];
  }
};