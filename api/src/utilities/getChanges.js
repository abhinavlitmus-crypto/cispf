// returnChanges.js

function isPlainObject(v) {
  if (v === null || typeof v !== "object") return false;
  if (Array.isArray(v)) return false;
  // Only true for {} or Object.create(null)
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

function isDate(v) {
  return v instanceof Date;
}

function isObjectIdLike(v) {
  // mongoose ObjectId usually has toString() and _bsontype === 'ObjectID'
  return v && typeof v === "object" && (v._bsontype === "ObjectID" || typeof v.toHexString === "function");
}

function deepEqual(a, b) {
  if (a === b) return true;

  // handle NaN
  if (Number.isNaN(a) && Number.isNaN(b)) return true;

  // Dates
  if (isDate(a) || isDate(b)) {
    if (!isDate(a) || !isDate(b)) return false;
    return a.getTime() === b.getTime();
  }

  // ObjectId (mongoose / bson)
  if (isObjectIdLike(a) || isObjectIdLike(b)) {
    if (!isObjectIdLike(a) || !isObjectIdLike(b)) return false;
    return String(a) === String(b);
  }

  // different types (after Date/ObjectId handling)
  if (typeof a !== typeof b) return false;

  // arrays
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // plain objects only
  if (isPlainObject(a) || isPlainObject(b)) {
    if (!isPlainObject(a) || !isPlainObject(b)) return false;
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;

    for (const k of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }

  // fallback for other object types (Map/Set/Buffer/etc.)
  return String(a) === String(b);
}

/**
 * Compare two objects and return only changed fields.
 */
function getChanges(oldObj = {}, newObj = {}, options = {}) {
  const ignoreKeys = new Set(options.ignoreKeys || ["_id", "__v", "createdAt", "updatedAt"]);

  const oldData = {};
  const newData = {};

  const keys = new Set([
    ...Object.keys(oldObj || {}),
    ...Object.keys(newObj || {}),
  ]);

  for (const key of keys) {
    if (ignoreKeys.has(key)) continue;

    const oldVal = oldObj ? oldObj[key] : undefined;
    const newVal = newObj ? newObj[key] : undefined;

    if (!deepEqual(oldVal, newVal)) {
      oldData[key] = oldVal;
      newData[key] = newVal;
    }
  }

  return { oldData, newData };
}

module.exports = { getChanges };
