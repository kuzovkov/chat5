FROM ubuntu:20.04

RUN apt-get update && \
    apt-get install -y php7.4-fpm && \
    apt-get install -y php7.4-curl && \
    apt-get install -y php-mysqli

RUN apt-get install -y software-properties-common && \
    add-apt-repository ppa:ondrej/php -y && \
    add-apt-repository ppa:openswoole/ppa -y && \
    apt-get update && apt-get install -y php7.4-openswoole

WORKDIR /var/www/html
COPY ./src .
COPY ./conf/php.ini /etc/php/7.4/fpm/php.ini
EXPOSE 9502
CMD ["php", "index.php"]
