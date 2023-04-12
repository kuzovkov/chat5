/*client module of event handlers during client-server interaction*/
'use strict';
class Socket {
    url = null;
    pathname = null;
    socket = null;
    hostname = null;
    app = null;
    handlers = {};
    
    constructor(app){
        this.app = app;
        this.url = window.location.host;
        this.pathname = window.location.pathname;
    }

    connect(){
        var socketurl = "wss://" + window.location.host + `/ws/`;
        //console.log('app:', this.app);
        if (this.app.options.room){
            socketurl = "wss://" + window.location.host + `/ws/?room=${this.app.options.room}`;
        }
        if (this.app.options.username && this.app.options.room){
            socketurl = "wss://" + window.location.host + `/ws/?nicname=${this.app.options.username}&room=${this.app.options.room}`;
        }
        this.socket = new WebSocket(socketurl);
        this.socket.keepalive = true;
        this.hostname = window.location.hostname;
        this.socket.onopen = function () {
            console.log('WS Connected!');
        };
        this.socket.onmessage = (event) => {
            //console.log(event);
            this.handleMessage(event.data);
        };
        this.socket.onerror = (error) => {
            console.log("Error ", error.message);
        };
    }

    /**
     * установка обработчиков событий
     * @param event строка с названием события
     * @param handler функция-обработчик события
     **/
    setEventHandler(event, handler){ /*установка обработчиков*/
        this.handlers[event] = handler.bind(this.app);
    }

    /**
     * отправка событий
     * @param event строка с названием события
     * @param object объект, содержащий посылаемые данные
     **/
    send(event, object){
        //console.log(event+':'+object);
        var data = Object.assign({}, {type: event}, object);
        this.socket.send(JSON.stringify(data));
    }

    handleMessage(data){
        data = JSON.parse(data);
        //console.log(data);
        if (this.handlers[data.type] && typeof this.handlers[data.type] === 'function'){
            this.handlers[data.type](data);
        } else {
            console.log("Unknown ws event type");
        }
    }
}









