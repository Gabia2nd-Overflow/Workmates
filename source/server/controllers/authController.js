const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Email } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  try {
    const { nickname, password, email } = req.body;
    const user_id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ user_id, nickname, password: hashedPassword });
    await Email.create({ user_id, email });

    res.status(201).json({ message: '회원가입 성공' });
  } catch (error) {
    res.status(500).json({ error: '회원가입 실패', details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailRecord = await Email.findOne({ where: { email }, include: 'User' });
    if (!emailRecord) return res.status(404).json({ error: '사용자 없음' });

    const user = emailRecord.User;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: '비밀번호 틀림' });

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: '로그인 성공', token });
  } catch (error) {
    res.status(500).json({ error: '로그인 실패', details: error.message });
  }
};