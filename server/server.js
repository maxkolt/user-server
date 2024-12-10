const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const md5 = require('md5');
require('dotenv').config();
const cors = require('cors');

// Создаем экземпляр приложения Express
const app = express();

// Настраиваем middleware для обработки JSON и CORS
app.use(bodyParser.json());
app.use(cors());

// Подключаемся к базе данных MongoDB
mongoose.connect('mongodb+srv://12345kolt:LakzDpIV8TuxkIvz@cluster0.t0v74.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
  console.log("Подключено к базе данных");
}).catch(err => {
  console.error("Ошибка подключения к базе данных:", err);
});

// Определение схемы и модели пользователя
const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  about: String,
});

const User = mongoose.model('User', userSchema);


// Маршрут для создания пользователя
app.post('/user/create', async (req, res) => {
  try {
    const { userId, name, about } = req.body;

    // Проверяем, существует ли уже такой userId
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).send({ error: 'Пользователь с таким userId уже существует' });
    }

    // Сохраняем нового пользователя
    const newUser = new User({
      userId,
      name,
      about,
    });
    await newUser.save();

    // Отправляем хэш userId в качестве ответа
    res.send({ hash: md5(userId) });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Ошибка при создании пользователя' });
  }
});

// Маршрут для получения информации о пользователе
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    if (!user) {
      return res.status(404).send({ error: 'Пользователь не найден' });
    }
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Ошибка при получении информации о пользователе' });
  }
});

// Маршрут для редактирования имени пользователя
app.put('/user/edit/:id', async (req, res) => {
  try {
    const updatedName = req.body.name;
    const user = await User.findOneAndUpdate(
      { userId: req.params.id },
      { $set: { name: updatedName } },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ error: 'Пользователь не найден' });
    }
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Ошибка при обновлении имени пользователя' });
  }
});

// Запускаем сервер
const port = 3000;
app.listen(port, () => {})