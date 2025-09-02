import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form"; //검증관리, 폼관리
import { Eye, EyeOff, Lock, User, Mail, UserCheck } from "lucide-react";
import { authAPI } from "../services/api";
import Button from "../Components/Button";
import Input from "../Components/Input";
import toast from "react-hot-toast"; //알림
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register, //입력 필드 폼에 등록
    handleSubmit, //제출 관리
    watch, //실시간 감지
    formState: { errors }, //검증 객체
  } = useForm();

  const password = watch("password"); //비번 확인

  //폼 제출 핸들러
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authAPI.signUp(data); //암호화후 회원가입
      toast.success("회원가입에 성공했습니다! 로그인해주세요.");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message || "회원가입에 실패했습니다.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 반응형 패딩
    <div className="page page--signup">
      {/* 반응형 너비 */}
      <div className="signup__container">
        <div className="text-center">
          {/* 반응형 텍스트 */}
          <h2 onClick={() => navigate("/")}  className="signup__brand">🛍️ workmates</h2>
          <p className="signup__subtitle">새로운 계정을 만드세요</p>
        </div>
      </div>
      {/* 반응형 간격 */}
      <div className="signup__container signup__container--spaced">
        <div className="signup__card">
          <form className="signup__form" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="아이디"
                type="text"
                placeholder="아이디를 입력하세요"
                {...register("id", {
                  // ✅ username → id 로 변경
                  required: "아이디를 입력해주세요.",
                  minLength: {
                    value: 3,
                    message: "아이디는 최소 3자 이상이어야 합니다.",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.",
                  },
                })}
                error={errors.id?.message}
                icon={<User className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                label="이메일"
                type="email"
                placeholder="이메일을 입력하세요"
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "올바른 이메일 형식을 입력해주세요.",
                  },
                })}
                error={errors.email?.message}
                icon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                label="닉네임"
                type="text"
                placeholder="닉네임을 입력하세요"
                {...register("nickname", {
                  required: "닉네임을 입력해주세요.",
                  minLength: {
                    value: 2,
                    message: "닉네임은 최소 2자 이상이어야 합니다.",
                  },
                })}
                error={errors.nickname?.message}
                icon={<UserCheck className="w-4 h-4" />}
              />
            </div>

            <div>
              <div className="signup__field-box">
                <Input
                  label="비밀번호"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  {...register("password", {
                    required: "비밀번호를 입력해주세요.",
                    minLength: {
                      value: 8,
                      message: "비밀번호는 최소 8자 이상이어야 합니다.",
                    },
                  })}
                  error={errors.password?.message}
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  className="signup__toggle"
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
              <div className="signup__field-box">
                <Input
                  label="비밀번호 확인"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력하세요"
                  {...register("confirmPassword", {
                    required: "비밀번호 확인을 입력해주세요.",
                    validate: (value) =>
                      value === password || "비밀번호가 일치하지 않습니다.",
                  })}
                  error={errors.confirmPassword?.message}
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  className="signup__toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "회원가입 중..." : "회원가입"}
              </Button>
            </div>
          </form>

          <div className="signup__hr">
            <div className="signup__hr-box">
              <div className="signup__hr-rail">
                <div className="signup__hr-line" />
              </div>
              <div className="signup__hr-label">
                <span className="signup__hr-chip">
                  이미 계정이 있으신가요?
                </span>
              </div>
            </div>

            <div className="signup__actions">
              <Link
                to="/login"
                className="signup__alt-link"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
