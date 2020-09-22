const moment = require('moment');
const SecretModel = require('../model/secret');
const ValidationError = require('../errors/validationError');
const { createRandomHash } = require('../hash');
const { encrypt, decrypt } = require('../crypto');

class Secret {
  static async save({ secret, expireAfterViews, expireAfter }) {
    this._validateParams(secret, expireAfterViews, expireAfter);
    const now = moment();
    const secretText = encrypt(secret);
    const document = new SecretModel({
      hash: createRandomHash(now),
      secretText,
      createdAt: now.toDate(),
      expiresAt: expireAfter === 0 ? null : now.add(expireAfter, 'm').toDate(),
      remainingViews: expireAfterViews,
    });

    await document.save();

    return this._createResponse(document);
  }

  static async get(hash) {
    const document = await SecretModel.findOne({ hash }).exec();
    document.secretText = decrypt(document.secretText);

    return this._createResponse(document);
  }

  static _validateParams(secret, expireAfterViews, expireAfter) {
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

  static _createResponse({
    hash, secretText, createdAt, expiresAt, remainingViews,
  }) {
    return {
      hash, secretText, createdAt, expiresAt, remainingViews,
    };
  }
}

module.exports = Secret;
