const { Markup } = require("telegraf");

const sendStartMsg = async (ctx) => {
  // const user
  await ctx.reply(
    "کاربر جدید؟؟؟ خوش اومدی !!!!!!",
    Markup.inlineKeyboard([
      [
        Markup.button.callback("gpt4o", "gpt4o"),
        Markup.button.callback("gpt3-turbo", "turbo"),
      ],
    ])
  );
};

const setDataInRedis = async (pattern, data) => {
  await redis.set(pattern, data);

  await ctx.editedMessage(sayHello[Math.floor(Math.random() * 10)]);
};

module.exports = { sendStartMsg };
