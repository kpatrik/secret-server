const { expect } = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const moment = require('moment');

const Secret = require('../../../../src/lib/repository/secret');

describe('Secret repositroy', () => {
  describe('save', () => {
    let saveStub;
    before(() => {
      saveStub = sinon.stub(mongoose.Model.prototype, 'save');
    });

    it('should save the secret to mongoDb', async () => {
      const secretRepository = Secret.create();
      await secretRepository.save({ secret: 'testsecret', expireAfterViews: 1, expireAfter: 1 });
      expect(saveStub).to.be.calledOnce;
    });

    it('should provide a hash', async () => {
      const hashStub = sinon.stub().returns('random-test-hash');
      const stub = sinon.stub();
      const secretRepository = new Secret(hashStub, stub, stub);
      const response = await secretRepository.save({ secret: 'testsecret', expireAfterViews: 1, expireAfter: 1 });

      expect(response.hash).to.eql('random-test-hash');
    });

    it('should provide an encrypted version of the secret', async () => {
      const encryptStub = sinon.stub().returns('encrypted-secret');
      const stub = sinon.stub();
      const secretRepository = new Secret(stub, encryptStub, stub);
      const response = await secretRepository.save({ secret: 'testsecret', expireAfterViews: 1, expireAfter: 1 });

      expect(encryptStub).to.have.been.calledWith('testsecret');
      expect(response.secretText).to.eql('encrypted-secret');
    });

    it('should save the current time as createdAt', async () => {
      this.clock = sinon.useFakeTimers(moment.utc('2020-01-01 12:00:00').valueOf());
      const secretRepository = Secret.create();
      const response = await secretRepository.save({ secret: 'testsecret', expireAfterViews: 1, expireAfter: 1 });

      expect(response.createdAt).to.eql(new Date('2020-01-01 12:00:00Z'));
      this.clock.restore();
    });

    it('should save the current time + the given minutes as expiresAt ', async () => {
      this.clock = sinon.useFakeTimers(moment.utc('2020-01-01 12:00:00').valueOf());
      const secretRepository = Secret.create();
      const response = await secretRepository.save({ secret: 'testsecret', expireAfterViews: 1, expireAfter: 15 });

      expect(response.expiresAt).to.eql(new Date('2020-01-01 12:15:00Z'));
      this.clock.restore();
    });

    it('should save the remainingViews as it is ', async () => {
      const secretRepository = Secret.create();
      const response = await secretRepository.save({ secret: 'testsecret', expireAfterViews: 3, expireAfter: 15 });

      expect(response.remainingViews).to.eql(3);
    });
  });

  describe('get', () => {
    let getStub;

    before(() => {
      const execStub = sinon.stub().returns({ secret: 'valami' });
      getStub = sinon.stub(mongoose.Model, 'findOneAndUpdate').returns({ exec: execStub });
    });

    // the query logic should be tested in an integration test
    it('should get the secret from the db with the right logic', async () => {
      this.clock = sinon.useFakeTimers(moment.utc('2020-01-01 12:00:00').valueOf());
      const decryptStub = sinon.stub().returns('decrypted-secret');
      const stub = sinon.stub();

      const secretRepository = new Secret(stub, stub, decryptStub);
      await secretRepository.get('testhash');
      expect(getStub).to.be.calledWith({
        hash: 'testhash',
        remainingViews: { $gt: 0 },
        expiresAt: { $gt: moment().toString() },
      },
      { $inc: { remainingViews: -1 } },
      { new: true });

      this.clock.restore();
    });

    it('should decrypt the secret', async () => {
      const decryptStub = sinon.stub().returns('decrypted-secret');
      const stub = sinon.stub();

      const secretRepository = new Secret(stub, stub, decryptStub);
      const response = await secretRepository.get('testhash');
      expect(response.secretText).to.eql('decrypted-secret');
    });
  });
});
