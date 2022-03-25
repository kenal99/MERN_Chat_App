const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).send("Invalid Data");
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.send(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.send(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, getAllMessages };
