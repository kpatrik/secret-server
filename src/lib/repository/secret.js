const moment = require('moment');

const SecretModel = require('../model/secret');
const ValidationError = require('../errors/validationError');
const NotFoundError = require('../errors/notFoundError');
const { createRandomHash } = require('../hash');
const { encrypt, decrypt } = require('../crypto');

class Secret {
  constructor(hasher, encrypter, decrypter) {
    this.createRandomHash = hasher;
    this.encrypt = encrypter;
    this.decrypt = decrypter;
  }

  static create() {
    return new Secret(createRandomHash, encrypt, decrypt);
  }

  async save({ secret, expireAfterViews, expireAfter }) {
    this._validateParams(secret, expireAfterViews, expireAfter);
    const now = moment();
    const secretText = this.encrypt(secret);
    const document = new SecretModel({
      hash: this.createRandomHash(now),
      secretText,
      createdAt: now.toDate(),
      expiresAt: expireAfter === 0 ? null : now.add(expireAfter, 'm').toDate(),
      remainingViews: expireAfterViews,
    });

    await document.save();

    document.secretText = secret;

    return this._createResponse(document);
  }

  async get(hash) {
    const now = moment().toString();

    const document = await SecretModel.findOneAndUpdate(
      {
        hash,
        remainingViews: { $gt: 0 },
        expiresAt: { $gt: now },
      },
      { $inc: { remainingViews: -1 } },
      { new: true },
    ).exec();

    if (!document) {
      throw new NotFoundError();
    }

    document.secretText = this.decrypt(document.secretText);

    return this._createResponse(document);
  }

  _validateParams(secret, expireAfterViews, expireAfter) {
    if (typeof secret !== 'string') {
      throw new ValidationError('secret should be a string');
    }

    if (typeof expireAfterViews !== 'number') {
      throw new ValidationError('expireAfterViews should be a number');
    }

    if (typeof expireAfter !== 'number') {
      throw new ValidationError('expireAfter should be a number');
    }
  }

  _createResponse({
    hash, secretText, createdAt, expiresAt, remainingViews,
  }) {
    return {
      hash, secretText, createdAt, expiresAt, remainingViews,
    };
  }
}

module.exports = Secret;
