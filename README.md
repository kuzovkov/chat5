### webrtc chat with php backend and rooms feature


#### Install

```bash
git clone https://github.com/kuzovkov/chat4
cd chat4
sudo docker-compose build
sudo docker-compose up -d
```

#### Install Yii2
```bash
docker-compose exec app bash
composer --ignore-platform-reqs create-project yiisoft/yii2-app-basic basic
exit
```

```bash
sudo chown -R $USER:$USER app/src
mv app/src/basic/* app/src/
rm -rf app/src/basic
```

#### Get SSl certificates
rename nginx/conf.d/default-ssl.conf -> nginx/conf.d/default-ssl.conf.bak

```bash
mv nginx/conf.d/default-ssl.conf nginx/conf.d/default-ssl.conf.bak
mv nginx/conf.d/default.conf.bak nginx/conf.d/default.conf

./certbot.sh <domain-name>

mv nginx/conf.d/default-ssl.conf.bak nginx/conf.d/default-ssl.conf 
mv nginx/conf.d/default.conf nginx/conf.d/default.conf.bak
 
docker-compose restart nginx
```
Go to https://domain-name/info.php

