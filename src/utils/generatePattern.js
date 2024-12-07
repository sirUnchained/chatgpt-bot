function generateRedisPattern(entity, chatId, action) {
  return `${entity}:${chatId}:${action}`;
}

module.exports = generateRedisPattern;
