require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const mini_db_controller = require("./mini_db.controller");
const { sendStartMsg } = require("./actions/actions");
const { userModel } = require("./db");
let waitList = new Set();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  await sendStartMsg(ctx);
});

const sayHello = [
  "سلام عزیزم چه کمکی از من ساخته است؟",
  "درود برتو کاربر گرامی چطور کمکت کنم؟",
  "وقت بخیر چطور میتونم کمکت کنم؟",
  "سلام امیدوارم حالت عالی باشه چه کمکی از من بر میاد؟",
  "Hello user, how can i help you?",
  "Howdy doody, how can i help you?",
  "سلام عزیزم چه کمکی از من ساخته است؟",
  "سلام عزیزم چه کمکی از من ساخته است؟",
  "سلام عزیزم چه کمکی از من ساخته است؟",
  "سلام عزیزم چه کمکی از من ساخته است؟",
];
bot.action("turbo", async (ctx) => {
  mini_db_controller.create(ctx.chat.id, "gpt3.5-turbo");

  try {
    await ctx.editMessageText(sayHello[Math.floor(Math.random() * 10)]);
  } catch (error) {
    await ctx.reply(sayHello[Math.floor(Math.random() * 10)]);
  }
});
bot.action("gpt4o", async (ctx) => {
  mini_db_controller.create(ctx.chat.id, "gpt4o");

  try {
    await ctx.editMessageText(sayHello[Math.floor(Math.random() * 10)]);
  } catch (error) {
    await ctx.reply(sayHello[Math.floor(Math.random() * 10)]);
  }
});

bot.on("text", async (ctx) => {
  const userText = ctx.text;
  const chatId = ctx.chat.id;
  const user = await userModel.findOne({
    where: {
      chatId: chatId.toString(),
    },
  });

  if (user.used_count >= 20) {
    await ctx.reply("عزیزم شرمنده محدودیت ۲۰ درخواست در هفته شما فعلا پر شده.");
    return;
  }
  if (waitList.has(chatId)) {
    await ctx.reply("لطفا بعد از ده ثانیه دوباره پیام دهید.");
    return;
  }
  waitList.add(chatId);

  const pleasWaitMsg = await ctx.reply("لطفا کمی صبر کنید ...");

  const chosenAction = mini_db_controller.findOne("chatId", chatId);
  const response = await fetch(
    `https://api.one-api.ir/chatbot/v1/${chosenAction.action}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "one-api-token": process.env.API_TOKEN,
      },
      body: JSON.stringify([
        {
          role: "user",
          content: userText,
        },
      ]),
    }
  );
  const result = await response.json();
  const robotMsg = result.result[0]
    .replace(/\-/g, "\\-")
    .replace(/\_/g, "\\_")
    .replace(/\*/g, "\\*")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\~/g, "\\~")
    .replace(/\>/g, "\\>")
    .replace(/\#/g, "\\#")
    .replace(/\+/g, "\\+")
    .replace(/\=/g, "\\=")
    .replace(/\|/g, "\\|")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\./g, "\\.")
    .replace(/\!/g, "\\!");

  if (result.status === 200) {
    await ctx.deleteMessage(pleasWaitMsg.message_id);
    await ctx.replyWithMarkdownV2(robotMsg);
    user.used_count = user.used_count + 1;
    await user.save();
  } else {
    await ctx.deleteMessage(pleasWaitMsg.message_id);
    await ctx.reply("مشکلی از سمت سرویس پیش امده.");
  }

  setTimeout(() => {
    waitList.delete(chatId);
  }, 10 * 1000);
});

bot
  .launch()
  .then(() => {
    console.log("robot is running !");
  })
  .catch((err) => {
    console.log("error =>", err);
  });
