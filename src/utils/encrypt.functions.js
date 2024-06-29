const boom = require("@hapi/boom");
const crypto = require("crypto");
const { Buffer } = require("buffer");

const encryptSymmetric = (key, data) => {
  if (typeof data !== "string") throw new boom.badData();

  const iv = crypto.randomBytes(12).toString("base64");
  const cipherObject = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );
  let ciphertext = cipherObject.update(data, "utf-8", "base64");
  ciphertext += cipherObject.final("base64");

  const tag = cipherObject.getAuthTag();

  return {
    tag,
    iv,
    ciphertext,
  };
};

const decryptSymmetric = (key, ciphertext, iv, tag) => {
  if (typeof ciphertext !== "string")
    throw new boom.badData("The encrypted data must be a string");

  if (Buffer.isEncoding(Buffer.from(ciphertext, "base64")))
    throw new boom.badData("The encrypted data must be a base64 encoding");

  if (!Buffer.isBuffer(tag))
    throw new boom.badData("Tag must be a blob or a Buffer type");

  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(key, "base64"),
      Buffer.from(iv, "base64")
    );

    decipher.setAuthTag(tag);

    let text = decipher.update(ciphertext, "base64", "utf-8");
    text += decipher.final("utf-8");

    return text;
  } catch (err) {
    throw new boom.internal();
  }
};

/** Function that adds aditional data to a new object and convert it to base64, due to data loss, we should transform the encrypted base64 to hex and add it as a field on the object, then transform everything to JSON and finally base64 again
 * @param {string} base64Encrypted any text converted to base64
 * @param {object} newAddon object internals which will be append to the resultant object
 * @returns {string}
 */

const transformToBase64 = (base64Encrypted, newAddon) => {
  if (typeof base64Encrypted !== "string") throw new boom.badData();
  if (Buffer.isEncoding(base64Encrypted)) throw new boom.badData();
  // we transform base64Encrypted text obtained from the symmetric encrypt function to hex
  const hex = Buffer.from(base64Encrypted, "base64").toString("hex");

  // we append to a new object and apply a JSON.strinfigy
  const obj = JSON.stringify({
    __ciphertext__: hex,
    ...newAddon,
  });

  // convert again to base64 with the new addon
  const final = Buffer.from(obj, "utf-8").toString("base64");

  return final;
};

const revertFromBase64 = (base64Encrypted) => {
  // we transform the recent conversion, from base64 to utf8 because it should be a json object in string format
  const utf8 = Buffer.from(base64Encrypted, "base64").toString("utf-8");

  // if not a json object string format we will throw an error due to a not acceptable data
  try {
    // parse the string json object
    const obj = JSON.parse(utf8);

    // add to a new object and transform the ciphertext from hex to base64 again
    const res = {
      ...obj,
      __ciphertext__: Buffer.from(obj.__ciphertext__, "hex").toString("base64"),
    };
    // and returns it

    return res;
  } catch (e) {
    throw new boom.notAcceptable();
  }
};

module.exports = {
  encryptSymmetric,
  decryptSymmetric,
  transformToBase64,
  revertFromBase64,
};
