const fs = require("node:fs");
const path = require("node:path");
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

const remove = (key, value) => {
  const itemIndex = findOne(key, value, true);
  if (itemIndex == -1) return false;

  db.splice(itemIndex, 1);

  fs.writeFileSync(
    path.join(__dirname, "mini_db.json"),
    JSON.stringify([...db])
  );
  return true;
};

const update = (chatId, key, value) => {
  const itemIndex = findOne("chatId", chatId, true);
  if (itemIndex == -1) return false;

  db[itemIndex][key] = value;

  fs.writeFileSync(
    path.join(__dirname, "mini_db.json"),
    JSON.stringify([...db])
  );
  return true;
};

const create = (chatId, action) => {
  const checkExist = findOne("chatId", chatId);
  if (checkExist) {
    update(checkExist.chatId, "action", action);
    return true;
  }

  const newData = {
    id: crypto.randomUUID(),
    chatId,
    createdAt: new Date(),
    action,
  };

  fs.writeFileSync(
    path.join(__dirname, "mini_db.json"),
    JSON.stringify([...db, newData])
  );
  return newData;
};

module.exports = { findOne, create, remove, update };

setInterval(() => {
  let currentTime = new Date.now();
  db.forEach((item) => {
    time = new Date.now(item.createdAt);
    if (time + 2 * 60 * 60 * 1000 < currentTime) {
      remove("id", item.id);
    }
  });
}, 2 * 60 * 60 * 1000);
