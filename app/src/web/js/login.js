var A = {};
A.nicname = null;
A.users_online = [];

/**
 * инициализация приложения
 **/
A.init = function(){
    A.socket = Socket;
    A.socket.init(A);
    A.setEventHandlers();
    A.form = document.getElementById('login-form');
    A.form.addEventListener('submit', A.login);
};

/**
 * Установка обработчиков на события рассылаемые сервером
 **/
A.setEventHandlers = function(){
    A.socket.setEventHandler('users_online', A.fillUsersOnline);
};

A.fillUsersOnline = function(data){
    if (data.users_online && Array.isArray(data.users_online)){
        data.users_online.forEach(user => {
            if (A.users_online.indexOf(user) === -1){
                A.users_online.push(user);
            }
        })
    }
    console.log('users_online:', A.users_online);
}

A.login = function(e){
    //console.log('e:', e.target);
    e.preventDefault();
    document.querySelector('div[class="error"]').innerHTML='';
    var nicname = document.querySelector('input[name="nicname"]').value;
    if (A.users_online.indexOf(nicname) === -1){
        e.target.submit();
    } else {
        document.querySelector('div[class="error"]').innerHTML='This NicName already busy! Choose another';
    }
}

