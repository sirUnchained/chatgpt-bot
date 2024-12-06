// const { Redis } = require("ioredis");

// const redis = new Redis(process.env.REDIS_URI);

// module.exports = redis;

const fs = require("node:fs");
const db = require("./mini_db.json");

const findOne = (key, value, index = false) => {
  if (index) {
    const result = db.findIndex((item) => {
      return item[key] === value;
    });
    return result;
  }
  const result = db.find((item) => {
    return item[key] === value;
  });
  return result !== undefined ? result : false;
};

const create = (chatId, action) => {
  const checkExist = findOne("chatId", chatId);
  if (checkExist) return false;
  const newData = {
    id: crypto.randomUUID(),
    chatId,
    createdAt: new Date(),
    action,
  };

  fs.writeFileSync("./mini_db.json", JSON.stringify([...db, newData]));
  return newData;
};

const remove = (key, value) => {
  const itemIndex = findOne(key, value, true);
  if (itemIndex == -1) return false;

  db.splice(itemIndex, 1);

  fs.writeFileSync("./mini_db.json", JSON.stringify([...db]));
  return true;
};

const update = (chatId, key, value) => {
  const itemIndex = findOne("chatId", chatId, true);
  if (itemIndex == -1) return false;

  db[itemIndex][key] = value;

  fs.writeFileSync("./mini_db.json", JSON.stringify([...db]));
  return true;
};

// console.log(update(12345, "action", "gpt40"));

module.exports = { findOne, create, remove, update };
