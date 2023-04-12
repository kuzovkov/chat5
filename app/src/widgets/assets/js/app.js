'use strict';
class App {
    nicname = null;
    selected_user = null;
    options = null;
    socket = null;
    filesp2p = null;

    constructor(){
        this.options = videochatOptions;
        this.nicname = this.options.username;
        this.socket = new Socket(this);
        this.socket.connect();
        this.setEventHandlers();
        this.filesp2p = Fp2p;
        // this.files = F;
        // this.files.init(A);
        // this.filesp2p = Fp2p;
        // this.filesp2p.init(A);
        //this.wrtc = new WRTC();
        // this.wrtc.init(A);

        // this.iface = I;
        // this.iface.init(A);
        // this.au = AU;
        // this.au.init(A);
    }

    setEventHandlers(){
        this.socket.setEventHandler('connect', this.connect);
        this.socket.setEventHandler('disconnect', this.disconnect);
        this.socket.setEventHandler('new_message', this.newMessage);
        this.socket.setEventHandler('new_user', this.newUser);
        this.socket.setEventHandler('user_disconnected', this.userLost);
        this.socket.setEventHandler('users_online', this.refreshUsersOnline);
        this.socket.setEventHandler('last_messages', this.lastMessages);
        this.socket.setEventHandler('have_file', this.haveFile);
        this.socket.setEventHandler('file_accepted', this.fileAccepted);
        this.socket.setEventHandler('you_files', this.incomingFiles);
        this.socket.setEventHandler('wrtc_message', this.gotWRTCMessage);
        this.socket.setEventHandler('upload_error', this.uploadError);
    }

    connect(data){
        this.nicname = data.nicname
        this.socket.send('user_connect', {nicname: this.nicname, room: this.options.room});
    }

    disconnect(){
        window.location.reload(true);
    }

    sendUserMessage(message){
        if (this.selected_user == null) return;
        /**если сообщение пользователю с которым на созвоне посылаем сообщение через p2p иначе через сервер**/
        if (this.wrtc.chat_datachannel != null && this.selected_user == this.wrtc.selected_user){
            var timestamp = (new Date()).getTime();
            var messageObject = {created: timestamp, from: WRTC.app.nicname, to: WRTC.selected_user, message:message};
            //this.iface.addMessage(messageObject);
            //this.wrtc.chat_datachannel.send(message);
            console.log('send message p2p');
        }else{
            this.socket.send('user_message', {message: message, to:this.selected_user});
            console.log('send message across server');
        }
    }

    /**
     * обработка приема нового сообщения чата
     * @param data
     */
    newMessage(data){
        //this.iface.addMessage(data.message);
    }

    /**
     * обработка события присоединения нового пользователя к чату
     * @param data
     */
    newUser(data){
        var mess = 'New user ' + data.user + ' was connected!';
        this.serverMessage(mess);
    }

    /**
     * обработка события отключения пользователя от чата
     * @param data
     */
    userLost(data){
        // var mess = 'User ' + data.user + ' was disconnected!';
        // if (this.wrtc.selected_user === data.user){
        //     this.wrtc.hangup();
        // }
        // this.serverMessage(mess);
    }

    /**
     * обновление списка пользователей online
     * @param data
     */
    refreshUsersOnline(data){
        console.log('refreshUsersOnline');
        console.log(data.users_online);
        console.log(data.ice);
        // if (data.ice){
        //     this.wrtc.pc_config = JSON.parse(window.atob(data.ice));
        // }
        //this.iface.refreshUsersOnline(data.users_online);
    }

    /**
     * показ заметки с сообщением сервера
     */
    serverMessage(mess){
        // this.iface.hideNote();
        // this.iface.showNote(mess);
    }

    /**
     * запрос истории сообщений у сервера
     */
    requestMessagesHistory(){
       // this.socket.send('message_history', {user1:this.nicname, user2:this.selected_user, lefttime: this.iface.HISTORY_LEFTTIME});
    };

    /**
     * отображение полученной истории сообщений
     * @param data
     */
    lastMessages(data){
        // this.iface.refreshMessages(data.messages);
        // this.requestFiles();
    }

    /**
     * отправка файла на сервер
     * @param f
     * @param progressbar
     */
    sendFile(f, progressbar){
        if (this.wrtc.file_datachannel != null && this.selected_user == this.wrtc.selected_user){
            console.log('send file p2p');
            //Fp2p.sendFile(f, this.wrtc.file_datachannel, progressbar);
        }else{
            /*отключение поддержки отправки файлов через сервер (не p2p)*/
            var note = 'Sending files is possible only to user which you have active call';
            //this.iface.showNote(note);
            //this.iface.clearSelectedFiles();
            // console.log('send file to server');
            // F.sendFile(f, '/upload', this.selected_user, this.nicname, progressbar);
        }
    }

    /**
     * обработка сообщения от сервера что нам передали файлы
     * @param data
     */
    haveFile(data){
        // var note = ['User ', data.from, ' send for you file ', data.fname, ' size: ', data.fsize].join('');
        // this.iface.showNote(note);
        // this.requestFiles();
    }

    /**
     * обработка сообщения от сервера что отправленный файл принят
     */
    fileAccepted(data){
        //this.files.fileAccepted(data.fname);
    }

    /**
     * обработка сообщения от сервера что при отправке файла произошла ошибка
     */
    uploadError(data){
        //this.files.uploadError(data.fname);
    }

    /**
     * запрос имеющихся присланных файлов
     */
    requestFiles(){
        this.socket.send('request_files');
    }


    /**
     * обработка данных от сервера об имеющихся файлах
     * @param data
     */
    incomingFiles = function(data){
        //this.iface.refreshFilesLinks(data);
    }

    /**
     * обработка получения сообщения для сигналлинга в WebRTC
     * @param data
     */
    gotWRTCMessage(data){
        //this.wrtc.gotMessage(data);
    }

    get options (){
        return this.options;
    }

    get socket (){
        return this.socket;
    }

    get filesp2p (){
        return this.filesp2p
    }

}



