async function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, delay);
    });
}

class Login {
    nicname = null;
    users_online = [];
    socket = null;
    form = null;
    options = {};
    listReceived = false;

    constructor(){
        this.form = document.getElementById('login-form');
        this.form.addEventListener('submit', this.login.bind(this));
    }

    fillUsersOnline(data){
        console.log('fillUsersOnline:', data);
        if (data.users_online && Array.isArray(data.users_online)){
            this.users_online = data.users_online;
        }
        this.listReceived = true;
        console.log('users_online:', this.users_online, 'listReceived:', this.listReceived);
    }

    async login(e){
        console.log('e.target:', e.target);
        console.log('e:', e);
        e.preventDefault();
        console.log('event.defaultPrevented', e.defaultPrevented);
        document.querySelector('div[class="error"]').innerHTML='';
        const username = document.querySelector('input[name="username"]').value;
        this.options.username = null;
        this.options.room = document.querySelector('input[name="room"]').value;
        this.socket = null;
        this.socket = new Socket(this);
        console.log('this.socket:', this.socket)
        this.socket.setHandler('users_online', this.fillUsersOnline.bind(this))
        this.socket.connect();
        console.log('this.listReceived:', this.listReceived)
        while (!this.listReceived){ await sleep(1000); console.log('sleep ');};
        console.log('this.users_online:', this.users_online, this.options.username)
        if (this.users_online.indexOf(username) === -1){
            e.target.submit();
        } else {
            document.querySelector('div[class="error"]').innerHTML='This NicName already busy! Choose another';
        }
        this.listReceived = false
    }

}

const login = new Login();



