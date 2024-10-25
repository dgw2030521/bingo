interface UseLoginProps {
  initUserInfo: Partial<any>;
}

export default function useLogin(initProps?: UseLoginProps) {
  return {
    isLogin: true,
    login: () => {},
    logout: () => {},
  };
}
