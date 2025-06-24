const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./models');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use('/api/auth', authRoutes);

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('서버 실행 중 (포트 3000)');
  });
});

app.get('/', (req, res) => {
  res.send('✅ 서버 정상 작동 중입니다!');
});