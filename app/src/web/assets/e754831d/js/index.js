/*init app v7*/
window.onload = function(){
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }
    const app = new App();
};
