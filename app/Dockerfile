FROM ubuntu:20.04

RUN apt-get update && \
    apt-get install -y software-properties-common && \
    dpkg -l | grep php | tee packages.txt && \
    add-apt-repository -y ppa:ondrej/php
RUN apt-get update && \
    apt-get install -y php8.2-fpm && \
    apt-get install -y php8.2-curl && \
    apt-get install -y php8.2-mysql
RUN apt-get install -y php8.2-dom && \
    apt-get install -y php8.2-imagick && \
    apt-get install -y php8.2-mbstring && \
    apt-get install -y php8.2-zip && \
    apt-get install -y php8.2-gd && \
    apt-get install -y php8.2-intl

#Install composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
php -r "unlink('composer-setup.php');" && \
chmod a+x /usr/local/bin/composer


WORKDIR /var/www/html
COPY ./src .
COPY ./conf/php.ini /etc/php/8.2/fpm/php.ini
ENTRYPOINT /usr/sbin/php-fpm8.2 --nodaemonize --fpm-config /etc/php/8.2/fpm/php-fpm.conf

