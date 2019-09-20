module.exports = {
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  roots: ['tests'],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts?)$",
  moduleFileExtensions: [
    "ts",
    "js",
    "json",
    "node"
  ],
};
