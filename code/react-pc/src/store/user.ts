/**
 * 用户登录信息
 * token 0 为游客
 * 初始值来自与localStorage，初始化好之后就从hooks中读取user信息。每次刷新从localstorage中加载
 */
import constate from 'constate';

import useLogin from '@/hooks/useLogin';

const [LoginProvider, useLoginContext] = constate(useLogin);

export { LoginProvider, useLoginContext };
