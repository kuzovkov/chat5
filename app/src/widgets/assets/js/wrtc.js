const PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
const IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
const SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

class WRTC {
    pc_config = null;
    app = null;
    pc = null; // PeerConnection
    localStream = null;
    screenStream = null;
    online = false;
    chat_datachannel = null; /*RTCDataChannel для чата*/
    file_datachannel = null; /*RTCDataChannel для файлов*/
    hang_up = true; /*повешена ли трубка*/
    mediaOptions = { audio: true, video: true };
    selected_user = null; /*абонент для видеочата*/

    constructor(app){
        this.app = app;
        this.pc = null; // PeerConnection
        this.localStream = null;
        this.screenStream = null;
        this.online = false;
        this.chat_datachannel = null; /*RTCDataChannel для чата*/
        this.file_datachannel = null; /*RTCDataChannel для файлов*/
        this.hang_up = true; /*повешена ли трубка*/
        this.mediaOptions = { audio: true, video: true };
        this.selected_user = username; /*абонент для видеочата*/
    }

    setOptions(options){
        Object.keys(options).forEach(key => {
            this.key = options[key];
        })
    }

    /**
     * инициация вызова вызывающим абонентом,
     * отправка вызываемому абоненту приглашения к связи
     */
    call(){
        console.log(Date.now(), 'call', 'pc_config', this.pc_config);
        if (!this.hang_up) return;
        this.setSelectedUser(this.app.selected_user);
        this.setHangUp(true);
        this.sendMessage({type:'intent_call'});
    }

    /**
     * начало звонка при получении согласия вызываемого абонента
     */
    beginConnect(){
        if (!this.hang_up) this.getUserMedia(this.gotStreamCaller);
    }

    /**
     * получение медиапотоков с камеры и микрофона
     * @param callback функция обратного вызова в которую передается stream
     */
    getUserMedia(callback){
        console.log(Date.now(), 'getUserMedia');
        navigator.getUserMedia(
          this.mediaOptions,
          callback,
          function(error) { this.getUserMedia = function(callback){
              console.log(Date.now(), 'getUserMedia');
              navigator.getUserMedia(
                { audio: true, video: false },
                callback,
                function(error) { console.log(error) }
              );
            };
          }
        );
    }

    /**
     * инициация ответа вызывающему абоненту
     */
    answer(){
        console.log(Date.now(), 'answer');
        this.getUserMedia(this.gotStreamCalle);
    }

    /**
     * обработчик получения медиапотока вызывающим абонентом
     * @param stream медиапоток
     */
    gotStreamCaller(stream) {
        this.sendMessage({type:'call'});
        this.attachStream(document.getElementById("localVideo"), stream);
        this.localStream = stream;
        console.log(Date.now(), 'gotStream:', stream);
        this.pc = new PeerConnection(this.pc_config);
        this.addStreamToRTCPeerConnection(stream);
        this.pc.onicecandidate = this.gotIceCandidate;
        this.pc.onaddstream = this.gotRemoteStream;
        this.chat_datachannel = this.pc.createDataChannel("chat", {negotiated: true, id: 0, ordered: true});
        this.file_datachannel = this.pc.createDataChannel("file", {negotiated: true, id: 1, ordered: true});
        this.chat_datachannel.onopen = this.chatDataChannelOnOpen;
        this.chat_datachannel.onmessage = this.chatDataChannelOnMessage;
        this.file_datachannel.onopen = this.fileDataChannelOnOpen;
        this.file_datachannel.onmessage = this.fileDataChannelOnMessage;
    }

    /**
     * присоединение потока к объекту video для проигрывания
     * @param el елемент DOM video
     * @param stream медиапоток
     */
    attachStream(el, stream) {
        console.log('attachStream', stream);
        var myURL = window.URL || window.webkitURL;
        if (!myURL) {
            el.src = stream;
        } else {
            //el.src = myURL.createObjectURL(stream);
            el.srcObject = stream;
        }
    }

    /**
     * обработчик получения медиапотока вызываемым абонентом (в соотв. с протоколом WebRTC)
     * @param stream медиапоток
     */
    gotStreamCalle(stream) {
        this.attachStream(document.getElementById("localVideo"), stream);
        this.localStream = stream;
        this.pc = new PeerConnection(this.pc_config);
        this.addStreamToRTCPeerConnection(stream);
        this.pc.onicecandidate = this.gotIceCandidate;
        this.pc.onaddstream = this.gotRemoteStream;
        this.pc.ontrack = this.gotRemoteTracks;
        this.sendMessage({type:'offer_ready'});
        this.chat_datachannel = this.pc.createDataChannel("chat", {negotiated: true, id: 0, ordered: true});
        this.file_datachannel = this.pc.createDataChannel("file", {negotiated: true, id: 1, ordered: true});
        this.chat_datachannel.onopen = this.chatDataChannelOnOpen;
        this.chat_datachannel.onmessage = this.chatDataChannelOnMessage;
        this.file_datachannel.onopen = this.fileDataChannelOnOpen;
        this.file_datachannel.onmessage = this.fileDataChannelOnMessage;
    }


    /**
     * создание Offer для инициации связи (в соотв. с протоколом WebRTC)
     */
    createOffer() {
        console.log(Date.now(), 'createOffer');
        document.getElementById("hangupButton").style.display = 'inline-block';
        this.pc.createOffer(
          this.gotLocalDescription,
          function(error) { console.log(error) },
          { 'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } }
        );
    }


    /**
     * создание Answer для инициации связи (в соотв. с протоколом WebRTC)
     */
    createAnswer() {
        console.log(Date.now(), 'createAnswer');
        console.log(Date.now(), 'signalingState', this.pc.signalingState);
        this.pc.createAnswer(
          this.gotLocalDescription,
          function(error) { console.log(error) },
          { 'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } }
        );
    }

    /**
     * обработчик получения локального SDP (в соотв. с протоколом WebRTC)
     * @param description SDP
     */
    gotLocalDescription(description){
        console.log(Date.now(), 'gotLocalDescription:', description);
        this.pc.setLocalDescription(description);
        this.sendMessage(description);
    }

    /**
     * обработчик получения ICE Candidate объектом RTCPeerConnection (в соотв. с протоколом WebRTC)
     * @param event
     */
    gotIceCandidate(event){
        console.log(Date.now(), 'gotIceCandidate: ', event.candidate);
        if (event.candidate) {
            this.sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        }
    }

    /**
     * обработчик получения объектом RTCPeerConnection
     * удаленного медиапотока
     * @param event объект события
     */
    gotRemoteStream(event){
        console.log(Date.now(), 'gotRemoteStream: ', event.stream);
        console.log(Date.now(), 'gotRemoteStream(audio tracks): ', event.stream.getAudioTracks());
        this.attachStream(document.getElementById("remoteVideo"), event.stream);
        this.online = true;
        this.setHangUp(true);
        document.getElementById("screenshareButton").style.display = 'inline-block';
        document.getElementById("videoOff").style.display = 'inline-block';
        document.getElementById("audioOff").style.display = 'inline-block';
    }

    /**
     * обработчик получения объектом RTCPeerConnection
     * удаленного трека медиапотока
     * На событие "track", вместо обработчика устаревшего события "addstream"
     * @param event объект события
     */
    gotRemoteTracks(event){
        console.log(Date.now(), 'gotRemoteStream: ', event.streams);
        console.log(Date.now(), 'gotRemoteStream(audio tracks): ', event.streams[0].getAudioTracks());
        this.attachStream(document.getElementById("remoteVideo"), event.streams[0]);
        this.online = true;
        this.setHangUp(true);
        document.getElementById("screenshareButton").style.display = 'inline-block';
        document.getElementById("videoOff").style.display = 'inline-block';
        document.getElementById("audioOff").style.display = 'inline-block';
    }

    /**
     * отправка сообщений абоненту через socket.io
     * для обеспечения сигналлинга
     * @param message
     */
    sendMessage(message, to){
        console.log(Date.now(), 'send_message: ', message);
        if (to === undefined){
            this.app.socket.send('wrtc_message', {message: message, to: this.selected_user});
        }else{
            this.app.socket.send('wrtc_message', {message: message, to: to});
        }
    }

    /**
     * завершение сеанса связи
     */
    hangup(){
        this.sendMessage({type:'hangup'});
        this.disconnect();
        this.setHangUp(false);
        document.getElementById("screenshareButton").style.display = 'none';
        document.getElementById("videoOff").style.display = 'none';
        document.getElementById("videoOn").style.display = 'none';
    }

    /**
     * установка статуса "трубки (поднята/положена)" и видимости кнопок
     * @param up
     */
    setHangUp(up){
        if (up){
            this.hang_up = false;
            document.getElementById("hangupButton").style.display = 'inline-block';
            document.getElementById("callButton").style.display = 'none';
        }else{
            this.hang_up = true;
            document.getElementById("hangupButton").style.display = 'none';
            document.getElementById("callButton").style.display = 'inline-block';
        }
    }

    /**
     * завершение сеанса связи
     */
    disconnect(){
        this.hang_up = true;
        if (this.online){
            this.online = false;
        }
        if(this.pc != null){
            this.pc.close();
            this.pc = null;
        }
        if(this.chat_datachannel != null){
            this.chat_datachannel.close();
            this.chat_datachannel = null;
        }
        if(this.file_datachannel != null){
            this.file_datachannel.close();
            this.file_datachannel = null;
        }
        if (this.localStream != null){

            this.localStream.getVideoTracks().forEach(function (track) {
                track.stop();
            });

            this.localStream.getAudioTracks().forEach(function (track) {
                track.stop();
            });
            this.localStream = null;
        }
        document.getElementById("localVideo").src = '';
        document.getElementById("remoteVideo").src = '';
        document.getElementById("screenshareButton").style.display = 'none';
        document.getElementById("videoOff").style.display = 'none';
        document.getElementById("videoOn").style.display = 'none';
        document.getElementById("audioOff").style.display = 'none';
        document.getElementById("audioOn").style.display = 'none';
        this.setSelectedUser(null);
    }


    /**
     * обработка сообщений от абонента
     * для обеспечения сигналлинга
     */
    gotMessage(data){
        var message  = data.message;
        var from = data.from;
        console.log(Date.now(), 'recive_message: ', message);
        if (this.pc != null && message.type === 'offer') {
            this.pc.setRemoteDescription(new SessionDescription(message));
            this.createAnswer();
        }
        else if (this.pc != null && message.type === 'answer') {
            this.pc.setRemoteDescription(new SessionDescription(message));
        }
        else if (this.pc != null && message.type === 'candidate') {
            //var candidate = new IceCandidate({sdpMLineIndex: message.label, candidate: message.candidate});
            var candidate=null;
            try{
                candidate = new IceCandidate(message);
                this.pc.addIceCandidate(candidate);
            }catch (e){
                try{
                    candidate = new IceCandidate({sdpMLineIndex: message.label, candidate: message.candidate});
                    this.pc.addIceCandidate(candidate);
                }catch (e){
                    console.log(e);
                }
            }
        }else if (message.type === 'hangup'){
            this.disconnect();
            this.setHangUp(false);
        }else if(message.type === 'call'){
            this.answer();
        }else if(message.type === 'offer_ready'){
            this.createOffer();
        }else if (message.type === 'intent_call'){
            this.hangup();
            this.sendMessage({type:'ready_call'});
        }else if (message.type === 'ready_call'){
            this.beginConnect();
        }else if (message.type === 'reject_call'){
            this.setSelectedUser(null);
            this.setHangUp(false);
        }
    }

    /**
     * установка пользователя для видеочата
     * @param user
     */
    setSelectedUser(user){
        this.selected_user = user;
        this.app.iface.user_for_videochat.innerHTML = user;
        if (window.localStorage)
            if (user !== null){
                window.localStorage.setItem('videochat_user', user);
            }else{
                window.localStorage.removeItem('videochat_user');
            }
    }

    /**
     * Обработчик кнопки расшаривания экрана
     */
    screenShare(){
        if(navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
            if(navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({video: true}).then(function (stream) {
                    this.onGettingScreenSteam(stream);
                }, this.getDisplayMediaError).catch(this.getDisplayMediaError);
            } else if(navigator.getDisplayMedia) {
                navigator.getDisplayMedia({video: true}).then(function (stream) {
                    this.onGettingScreenSteam(stream);
                }, this.getDisplayMediaError).catch(this.getDisplayMediaError);
            }
        } else {
            if (DetectRTC.browser.name === 'Chrome') {
                if (DetectRTC.browser.version == 71) {
                    dialogMessage('Please enable "Experimental WebPlatform" flag via chrome://flags.');
                } else if (DetectRTC.browser.version < 71) {
                    dialogMessage('Please upgrade your Chrome browser.');
                } else {
                    dialogMessage('Please make sure that you are not using Chrome on iOS.');
                }
            }

            if (DetectRTC.browser.name === 'Firefox') {
                dialogMessage('Please upgrade your Firefox browser.');
            }

            if (DetectRTC.browser.name === 'Edge') {
                dialogMessage('Please upgrade your Edge browser.');
            }

            if (DetectRTC.browser.name === 'Safari') {
                dialogMessage('Safari does NOT supports getDisplayMedia API yet.');
            }
        }
    }

    /**
     * Обработка ошибок получения медия потока с экрана
     * @param error
     */
    getDisplayMediaError(error){
        if (location.protocol === 'http:') {
            console.log('Please test this WebRTC experiment on HTTPS.');
        } else {
            console.log(error);
            console.log(error.toString());
        }
    }

    /**
     * Обработка получения потока с экрана
     * @param stream
     */
    onGettingScreenSteam(stream){
        this.screenStream = stream;
        this.addStreamStopListener(stream, this.onScreenShareEnded);
        document.getElementById("screenshareButton").style.display = 'none';
        this.removeStreamFromRTCPeerConnection(this.localStream);
        var audiotracks = this.localStream.getAudioTracks();
        console.log('audio tracks', audiotracks);
        if (audiotracks.length > 0){
            console.log('add audio track', audiotracks[0]);
            this.screenStream.addTrack(audiotracks[0]);
        }
        this.addStreamToRTCPeerConnection(this.screenStream);
        this.createOffer();
    }

    /**
     * Установка обработчика прекращения расшаривания экрана
     * @param stream
     * @param callback
     */
    addStreamStopListener(stream, callback) {
        stream.addEventListener('ended', function() {
            callback();
            callback = function() {};
        }, false);
        stream.addEventListener('inactive', function() {
            callback();
            callback = function() {};
        }, false);
        stream.getTracks().forEach(function(track) {
            track.addEventListener('ended', function() {
                callback();
                callback = function() {};
            }, false);
            track.addEventListener('inactive', function() {
                callback();
                callback = function() {};
            }, false);
        });
    }

    /**
     * Обработка прекращения расшаривания экрана
     */
    onScreenShareEnded(){
        console.log('Screen share stopped');
        document.getElementById("screenshareButton").style.display = 'inline-block';
        this.removeStreamFromRTCPeerConnection(this.screenStream);
        this.addStreamToRTCPeerConnection(this.localStream);
        this.screenStream = null;
        this.createOffer();
    }

    /**
     * Wrap over ToRTCPeerConnection.addStream to avoid
     * deprecated issues
     * @param stream
     */
    addStreamToRTCPeerConnection(stream){
        try{
            this.pc.addStream(stream);
        }catch (e){
            stream.getTracks().forEach(function(track) {
                this.pc.addTrack(track, stream);
            });
        }
    }

    /**
     * Wrap over ToRTCPeerConnection.removeStream to avoid
     * deprecated issues
     * @param stream
     */
    removeStreamFromRTCPeerConnection(stream){
        try{
            this.pc.removeStream(stream);
        }catch (e){
            this.pc.getSenders().forEach(function(sender){
                stream.getTracks().forEach(function(track){
                    if(track == sender.track){
                        this.pc.removeTrack(sender);
                    }
                })
            });
        }
    }

    /**
     * Обработчик кнопки выключения видео
     */
    videoOff(){
        this.localStream.getVideoTracks().forEach(function(track){
            track.enabled = false;
        });
        document.getElementById("videoOn").style.display = 'inline-block';
        document.getElementById("videoOff").style.display = 'none';
        this.createOffer();
    }

    /**
     * Обработчик кнопки включения видео
     */
    videoOn(){
        this.localStream.getVideoTracks().forEach(function(track){
            track.enabled = true;
        });
        document.getElementById("videoOff").style.display = 'inline-block';
        document.getElementById("videoOn").style.display = 'none';
        this.createOffer();
    }

    /**
     * Обработчик кнопки выключения звука
     */
    audioOff(){
        this.localStream.getAudioTracks().forEach(function(track){
            track.enabled = false;
        });
        document.getElementById("audioOn").style.display = 'inline-block';
        document.getElementById("audioOff").style.display = 'none';
        this.createOffer();
    }

    /**
     * Обработчик кнопки включения звука
     */
    audioOn(){
        this.localStream.getAudioTracks().forEach(function(track){
            track.enabled = true;
        });
        document.getElementById("audioOff").style.display = 'inline-block';
        document.getElementById("audioOn").style.display = 'none';
        this.createOffer();
    }

    /**
     * Обработчик создания chat datachannel
     * @param event
     */
    chatDataChannelOnOpen(event) {
        this.chat_datachannel.send(['Hi ', this.selected_user, '!'].join(' '));
    }

    /**
     * Обработчик приема данных через chat datachannel
     * @param event
     */
    chatDataChannelOnMessage(event) {
        var timestamp = (new Date()).getTime();
        var message = {created: timestamp, from:this.selected_user, to: this.app.nicname, message:event.data};
        console.log(message);
    }

    /**
     * Обработчик создания file datachannel
     * @param event
     */
    fileDataChannelOnOpen(event) {
        console.log('file datachannel open');
    }

    /**
     * Обработчик приема данных через file datachannel
     * @param event
     */
    fileDataChannelOnMessage(event) {
        if( typeof event.data === 'string') {
            this.app.filesp2p.startDownload(event.data);
        } else {
            this.app.filesp2p.progressDownload(event.data);
        }
    }

}


