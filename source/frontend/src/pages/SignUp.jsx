// src/pages/SignUp.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, User, Mail, UserCheck } from "lucide-react";
import { authAPI } from "../services/api";
import Button from "../Components/Button";
import Input from "../Components/Input";
import toast from "react-hot-toast";
import "./SignUp.css";

// ===== 정규식 (백엔드 규칙과 맞추기) =====
const ID_REGEX = /^[a-z0-9_]{4,20}$/;            // 소문자/숫자/_ 4~20
const PW_REGEX = /^[A-Za-z0-9]{8,20}$/;           // 영문/숫자 8~20
const NICK_REGEX = /^[가-힣A-Za-z0-9]{1,20}$/;    // 1~20
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function SignUp() {
  const navigate = useNavigate();

  // (A) 비밀번호 토글
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // (B) 서버 요청 로딩
  const [loading, setLoading] = useState(false);

  // (C) 상태머신
  // idState: idle | checking | ok | dup | invalid
  const [idState, setIdState] = useState("idle");
  // emailState: idle | sending | sent | confirming | confirmed
  const [emailState, setEmailState] = useState("idle");

  // (D) 이메일 재전송 쿨다운
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  // 폼 값
  const id = watch("id");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const nickname = watch("nickname");

  // 제출 가능 조건
  const canSubmit =
    idState === "ok" &&
    emailState === "confirmed" &&
    ID_REGEX.test(id || "") &&
    EMAIL_REGEX.test(email || "") &&
    PW_REGEX.test(password || "") &&
    password === confirmPassword &&
    NICK_REGEX.test(nickname || "");

  // ─── 아이디 입력 변화 → 상태 재설정 ───
  useEffect(() => {
    if (!id) return setIdState("idle");
    if (!ID_REGEX.test(id)) return setIdState("invalid");
    setIdState("idle");
  }, [id]);

  // ─── 아이디 중복확인 ───
  const handleCheckId = async () => {
    if (!ID_REGEX.test(id || "")) {
      setIdState("invalid");
      setError("id", { message: "소문자/숫자/_ 4~20자로 입력하세요." });
      return;
    }
    clearErrors("id");
    try {
      setIdState("checking");
      const res = await authAPI.checkId(id);
      if (res?.isOk) {
        setIdState("ok");
        toast.success("사용 가능한 아이디입니다.");
      } else {
        setIdState("dup");
        setError("id", { message: "이미 사용 중인 아이디입니다." });
      }
    } catch (e) {
      setIdState("idle");
      toast.error(e?.response?.data?.message || "중복확인 중 오류가 발생했습니다.");
      console.error(e);
    }
  };

  // ─── 이메일 인증코드 전송 ───
  const handleSendEmail = async () => {
    if (!EMAIL_REGEX.test(email || "")) {
      setError("email", { message: "올바른 이메일 형식을 입력하세요." });
      return;
    }
    clearErrors("email");
    if (cooldown > 0) return;

    try {
      setEmailState("sending");
      const res = await authAPI.verifyEmail(email);
      if (res?.isCodeSent) {
        setEmailState("sent");
        toast.success("인증코드를 전송했습니다. 메일함을 확인하세요.");

        // 60초 쿨다운
        setCooldown(60);
        timerRef.current = setInterval(() => {
          setCooldown((sec) => {
            if (sec <= 1) {
              clearInterval(timerRef.current);
              return 0;
            }
            return sec - 1;
          });
        }, 1000);
      } else {
        setEmailState("idle");
        toast.error("인증코드 전송 실패");
      }
    } catch (e) {
      setEmailState("idle");
      toast.error(e?.response?.data?.message || "인증코드 전송 중 오류가 발생했습니다.");
      console.error(e);
    }
  };

  // ─── 이메일 코드 확인 ───
  const [code, setCode] = useState("");
  const handleConfirmEmail = async () => {
    if (!code.trim()) {
      toast.error("인증코드를 입력하세요.");
      return;
    }
    try {
      setEmailState("confirming");
      const res = await authAPI.confirmEmail(email, code);
      if (res?.isConfirmed) {
        setEmailState("confirmed");
        toast.success("이메일 인증이 완료되었습니다.");
      } else {
        setEmailState("sent");
        toast.error("인증코드가 올바르지 않습니다.");
      }
    } catch (e) {
      setEmailState("sent");
      toast.error(e?.response?.data?.message || "인증 확인 중 오류가 발생했습니다.");
      console.error(e);
    }
  };

  // ─── 회원가입 제출 ───
  const onSubmit = async (data) => {
    if (!canSubmit) {
      toast.error("아이디 중복확인과 이메일 인증을 완료해주세요.");
      return;
    }
    const payload = {
      id: data.id,
      email: data.email,
      password: data.password,
      nickname: data.nickname,
    };

    try {
      setLoading(true);
      await authAPI.signUp(payload);
      toast.success("회원가입에 성공했습니다! 로그인해주세요.");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "회원가입에 실패했습니다.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 타이머 정리
  useEffect(() => () => timerRef.current && clearInterval(timerRef.current), []);

  return (
    <div className="page page--signup">
      <div className="signup__container">
        <div className="text-center">
          <h2 onClick={() => navigate("/")} className="signup__brand">🛍️ workmates</h2>
          <p className="signup__subtitle">새로운 계정을 만드세요</p>
        </div>
      </div>

      <div className="signup__container signup__container--spaced">
        <div className="signup__card">
          <form className="signup__form" onSubmit={handleSubmit(onSubmit)}>
            {/* 아이디 + 중복확인 (가로 배치) */}
            <div>
              <div className="signup__row">
                <div className="signup__input-grow">
                  <Input
                    label="아이디"
                    type="text"
                    placeholder="소문자/숫자/_ (4~20자)"
                    {...register("id", {
                      required: "아이디를 입력해주세요.",
                      pattern: { value: ID_REGEX, message: "소문자/숫자/_ 4~20자" },
                    })}
                    error={errors.id?.message}
                    icon={<User className="w-4 h-4" />}
                  />
                </div>
                <button
                  type="button"
                  className="signup__sidebtn"
                  onClick={handleCheckId}
                  disabled={!id || idState === "checking" || idState === "ok"}
                  title="아이디 중복확인"
                >
                  {idState === "checking" ? "확인중..." : idState === "ok" ? "확인완료" : "중복확인"}
                </button>
              </div>
              <p className="text-xs mt-1">
                {idState === "invalid" && "형식이 올바르지 않습니다."}
                {idState === "dup" && "이미 사용 중인 아이디입니다."}
                {idState === "ok" && "사용 가능한 아이디입니다."}
              </p>
            </div>

            {/* 이메일 + 인증코드 전송 (가로 배치) */}
            <div>
              <div className="signup__row">
                <div className="signup__input-grow">
                  <Input
                    label="이메일"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "이메일을 입력해주세요.",
                      pattern: { value: EMAIL_REGEX, message: "올바른 이메일 형식" },
                      onChange: () => {
                        if (emailState !== "confirmed") setEmailState("idle");
                      },
                    })}
                    error={errors.email?.message}
                    icon={<Mail className="w-4 h-4" />}
                  />
                </div>
                <button
                  type="button"
                  className="signup__sidebtn"
                  onClick={handleSendEmail}
                  disabled={
                    !EMAIL_REGEX.test(email || "") ||
                    emailState === "sending" ||
                    emailState === "confirmed" ||
                    cooldown > 0
                  }
                  title="인증코드 전송"
                >
                  {emailState === "sending"
                    ? "전송중..."
                    : emailState === "confirmed"
                    ? "인증완료"
                    : cooldown > 0
                    ? `재전송(${cooldown}s)`
                    : "인증코드 전송"}
                </button>
              </div>

              {/* 인증코드 + 코드확인 (가로 배치) */}
              {(emailState === "sent" || emailState === "confirming") && (
                <div className="mt-2 signup__row">
                  <div className="signup__input-grow">
                    <Input
                      label="인증코드"
                      type="text"
                      placeholder="이메일로 받은 6자리 코드"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="signup__sidebtn"
                    onClick={handleConfirmEmail}
                    disabled={emailState === "confirming" || !code.trim()}
                    title="코드 확인"
                  >
                    {emailState === "confirming" ? "확인중..." : "코드확인"}
                  </button>
                </div>
              )}

              {emailState === "confirmed" && (
                <p className="text-xs mt-1">이메일 인증이 완료되었습니다.</p>
              )}
            </div>

            {/* 닉네임 */}
            <div>
              <Input
                label="닉네임"
                type="text"
                placeholder="닉네임을 입력하세요(1~20자)"
                {...register("nickname", {
                  required: "닉네임을 입력해주세요.",
                  pattern: { value: NICK_REGEX, message: "닉네임 형식을 확인하세요." },
                })}
                error={errors.nickname?.message}
                icon={<UserCheck className="w-4 h-4" />}
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <div className="signup__field-box">
                <Input
                  label="비밀번호"
                  type={showPassword ? "text" : "password"}
                  placeholder="영문/숫자 8~20자"
                  {...register("password", {
                    required: "비밀번호를 입력해주세요.",
                    pattern: { value: PW_REGEX, message: "8~20자 영문/숫자" },
                  })}
                  error={errors.password?.message}
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  className="signup__toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <div className="signup__field-box">
                <Input
                  label="비밀번호 확인"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력하세요"
                  {...register("confirmPassword", {
                    required: "비밀번호 확인을 입력해주세요.",
                    validate: (value) => value === password || "비밀번호가 일치하지 않습니다.",
                  })}
                  error={errors.confirmPassword?.message}
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  className="signup__toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 제출 */}
            <div>
              <Button type="submit" className="w-full" disabled={loading || !canSubmit}>
                {loading ? "회원가입 중..." : "회원가입"}
              </Button>
              {!canSubmit && (
                <p className="text-xs mt-2">
                  아이디 중복확인 및 이메일 인증을 완료해야 회원가입 버튼이 활성화됩니다.
                </p>
              )}
            </div>
          </form>

          <div className="signup__hr">
            <div className="signup__hr-box">
              <div className="signup__hr-rail">
                <div className="signup__hr-line" />
              </div>
              <div className="signup__hr-label">
                <span className="signup__hr-chip">이미 계정이 있으신가요?</span>
              </div>
            </div>

            <div className="signup__actions">
              <Link to="/login" className="signup__alt-link">
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
