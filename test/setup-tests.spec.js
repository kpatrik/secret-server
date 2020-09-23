const chai = require('chai');
const sinonChai = require('sinon-chai');

before(() => {
  global.expect = chai.expect;
  chai.use(sinonChai);
});
