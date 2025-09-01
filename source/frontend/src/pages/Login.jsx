import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { authAPI } from '../services/api';
import Button from '../Components/Button';
import Input from '../Components/Input';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.login(data);
      
      // 토큰과 사용자 정보 저장
      localStorage.setItem('token', response.data.token); //인증용
      localStorage.setItem('user', JSON.stringify({ //사용자 정보 (문자열)
        id: response.data.id,
        email: response.data.email,
        nickname: response.data.nickname,
      }));
      
      toast.success('로그인에 성공했습니다!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--login">
      <div className="login__container">
        <div className="text-center">
          <h2 onClick={() => navigate("/")}  className="login__brand">
            🛍️ Workmates
          </h2>
          <p className="login__subtitle">
            계정에 로그인하세요
          </p>
        </div>
      </div>

      <div className="login__container login__container--spaced">
        <div className="login__card">
          <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="사용자명"
                type="text"
                placeholder="사용자명을 입력하세요"
                {...register('id', {
                  required: '사용자명을 입력해주세요.',
                })}
                error={errors.id?.message}
                icon={<User className="w-4 h-4" />}
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  label="비밀번호"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  {...register('password', {
                    required: '비밀번호를 입력해주세요.',
                    minLength: {
                      value: 6,
                      message: '비밀번호는 최소 6자 이상이어야 합니다.',
                    },
                  })}
                  error={errors.password?.message}
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  className="login__toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </div>
          </form>

          <div className="login__hr">
            <div className="login__hr-box">
              <div className="login__hr-rail">
                <div className="login__hr-line" />
              </div>
              <div className="login__hr-label">
                <span className="login__hr-chip">
                  계정이 없으신가요?
                </span>
              </div>
            </div>

            <div className="login__actions">
              <Link
                to="/signup"
                className="login__alt-link"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 