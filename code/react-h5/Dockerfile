FROM registry.cn-zhangjiakou.aliyuncs.com/dip/nginx:latest

COPY ./dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/server.conf /etc/nginx/conf.d/server.conf

EXPOSE 7777

#CMD 运行以下命令
CMD sed -i "s/ZCZDGATEWAY/$CONF_GW/g" /etc/nginx/conf.d/server.conf && exec nginx -g 'daemon off;'