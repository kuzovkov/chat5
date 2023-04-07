/*клиентский модуль обработчиков событий при взаимодействии клиента и сервера*/

var Socket = {};

Socket.url = null;
Socket.pathname = null;
Socket.socket = null;
Socket.hostname = null;
Socket.app = null;
Socket.handlers = {};

/**
 * инициализация модуля
 * @param app объект приложения
 **/
Socket.init = function(app){
    Socket.app = app;
    Socket.url = window.location.host;
    Socket.pathname = window.location.pathname;
    var socketurl = "wss://" + window.location.host + `/ws/`;
    if (NICNAME){
        socketurl = "wss://" + window.location.host + `/ws/?nicname=${NICNAME}`;
    }
    if (NICNAME && ROOM){
        socketurl = "wss://" + window.location.host + `/ws/?nicname=${NICNAME}&room=${ROOM}`;
    }
    Socket.socket = new WebSocket(socketurl);
    Socket.socket.keepalive = true;
    Socket.hostname = window.location.hostname;
    Socket.socket.onopen = function () {
        console.log('WS Connected!');
    };
    Socket.socket.onmessage = function (event) {
        //console.log(event);
        Socket.handleMessage(event.data);
    };
    Socket.socket.onerror = function (error) {
        console.log("Error ", error.message);
    };
};

/**
 * установка обработчиков событий
 * @param event строка с названием события
 * @param handler функция-обработчик события
 **/
Socket.setEventHandler = function(event, handler){ /*установка обработчиков*/
    Socket.handlers[event] = handler;
};

/**
 * отправка событий
 * @param event строка с названием события
 * @param object объект, содержащий посылаемые данные
 **/
Socket.send = function(event, object){
    //console.log(event+':'+object);
    var data = Object.assign({}, {type: event}, object);
    Socket.socket.send(JSON.stringify(data));
};

Socket.handleMessage = function(data){
    data = JSON.parse(data);
    //console.log(data);
    if (Socket.handlers[data.type] && typeof Socket.handlers[data.type] === 'function'){
        Socket.handlers[data.type](data);
    } else {
        console.log("Unknown ws event type");
    }
}

