export class KeyController {
    constructor(){
        this.keys = {};

        window.addEventListener('keydown', e => {
            console.log(e.code + " 누름");
            this.keys[e.code] = true;
            console.log("keys: ", this.keys)
        });
        window.addEventListener('keyup', e => {
            console.log(e.code + " 땜");
            delete this.keys[e.code];
            console.log("keys: ", this.keys)
        });
    }
}