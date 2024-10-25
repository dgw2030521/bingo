/**
 * 登录之后操作
 */

import { AccountRO } from '@CodeDefine/customer/AccountRO';
import { RPCCode } from '../../RPC/RPCResult';
import { token_name } from './constant';

/**
 * 统一在本地写入用户信息
 * @param res
 */
const saveLoginUserInfo = (res: { code: RPCCode; result: AccountRO }) => {
  localStorage.setItem(token_name, res.result.Token);
  localStorage.setItem('tokenExpireTime', `${res.result.TokenExpireTime}`);
  localStorage.setItem('tokenUpdateCode', res.result.TokenUpdateCode);
  localStorage.setItem('ID', `${res.result.ID}`);
  localStorage.setItem('Name', `${res.result.Name}`);
  localStorage.setItem('UUKey', `${res.result.UUKey}`);
  localStorage.setItem('LoginScriptValue', `${res.result.LoginScriptValue}`);

  const webResource = res.result.ResourceList.filter(
    item => item.UUKey.indexOf('.Web.') > -1,
  );
  localStorage.setItem(
    'webResource',
    JSON.stringify(webResource.map(item => item.UUKey)),
  );
};
/**
 * 清空用户信息
 */
const logoutClearUserInfo = () => {
  localStorage.removeItem('token_name');
  localStorage.removeItem('tokenExpireTime');
  localStorage.removeItem('tokenUpdateCode');
  localStorage.removeItem('ID');
  localStorage.removeItem('Name');
  localStorage.removeItem('UUKey');
  localStorage.removeItem('LoginScriptValue');
  localStorage.removeItem('webResource');
};

export { saveLoginUserInfo, logoutClearUserInfo };
