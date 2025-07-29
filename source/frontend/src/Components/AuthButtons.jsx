// src/components/AuthButtons.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import toast from 'react-hot-toast';

const AuthButtons = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 로그인 여부 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    toast.success('로그아웃되었습니다.');
    navigate('/');
  };

  return (
    <div className="flex items-center space-x-4">
      {isLoggedIn ? (
        <>
          <Button variant="outline" onClick={handleLogout}>
            로그아웃
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={() => navigate('/login')}>
            로그인
          </Button>
          <Button onClick={() => navigate('/signup')}>
            회원가입
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
