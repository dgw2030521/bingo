export const token_name = 'customer-h5-token';

// h5，智能客服
export const servicer_robot_url =
  'https://172.43.60.42:8082/tbapp/sccd_qa/mobile';

// 单点登录地址
export const uam_login_url =
  'http://172.43.60.109:8901/login?appId=02d4fb0b-556e-4558-9d1f-902f6c12f7b9&redirect_uri=http://172.43.60.108:31766/zczd/customerh5/uam_login&state=123456&response_type=code';

// 企查查字段映射
export const codeNameMap = {
  city: 'meta_company#zhucedizhucedi',
  industry: 'meta_company#hangy',
  patentNum: 'meta_company#zhuanlishu',
  actualCapital: 'meta_company#zhucezijin',
  isMicroEnt: 'meta_company#xiaowi',
  socialStaffNum: 'meta_company#canbao',
};

export const transformCodeName = obj => {
  return Object.keys(obj).reduce((acc, cur) => {
    const code = obj[cur];
    const name = codeNameMap[cur];
    if (name) {
      acc[name] = code;
    }
    return acc;
  }, {});
};
