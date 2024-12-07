const { Markup } = require("telegraf");
const { userModel } = require("./../db");
const path = require("node:path");
const fs = require("node:fs");

const sendStartMsg = async (ctx) => {
  const user = await userModel.findOne({
    where: {
      chatId: ctx.chat.id.toString(),
    },
  });
  if (user) {
    if (user.name !== ctx.update.message.from.first_name) {
      user.name = ctx.update.message.from.first_name;
      await user.save();
    }
    await ctx.reply(
      `خوش برگشتی کاربر ${user.name} !`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback("gpt4o", "gpt4o"),
          Markup.button.callback("gpt3-turbo", "turbo"),
        ],
      ])
    );
    return;
  }

  await userModel.create({
    chatId: ctx.chat.id,
    name: ctx.update.message.from.first_name,
  });

  const welcomVidPath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "welcome",
    "so_welcome_new_user.mp4"
  );
  if (fs.existsSync(welcomVidPath)) {
    await ctx.sendVideo(
      {
        source: welcomVidPath,
      },
      {
        caption: "کاربر جدید ؟؟ خوش اومدی !!",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "gpt4o", callback_data: "gpt4o" },
              { text: "gpt3-turbo", callback_data: "turbo" },
            ],
          ],
        },
      }
    );
    return;
  }

  await ctx.reply(
    "خوش اومدی کاربر جدید.",
    Markup.inlineKeyboard([
      [
        Markup.button.callback("gpt4o", "gpt4o"),
        Markup.button.callback("gpt3-turbo", "turbo"),
      ],
    ])
  );
};

const setDataInRedis = async (pattern, data) => {
  await ctx.editedMessage(sayHello[Math.floor(Math.random() * 10)]);
};

module.exports = { sendStartMsg };
