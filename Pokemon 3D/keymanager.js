class Keymanager {
    constructor(){
        this.teclas = [
            {
                code: 87,
                isPressed: false,
                timePressed: 0,
                keyName: 'up'
            },
            {
                code: 83,
                isPressed: false,
                timePressed: 0,
                keyName: 'down'
            },
            {
                code: 65,
                isPressed: false,
                timePressed: 0,
                keyName: 'left'
            },
            {
                code: 68,
                isPressed: false,
                timePressed: 0,
                keyName: 'right'
            },
            {
                code: 32,
                isPressed: false,
                timePressed: 0,
                keyName: 'space'
            },
        ];

        document.addEventListener("keydown", () => { this.onKeyDown(event) }, false);
        document.addEventListener("keyup", () => { this.onkeyUp(event) }, false);
    }

    isKeyPressed(keyName){
        let retorno = false;

        for(let key of this.teclas){
            if (keyName == key.keyName){
                retorno = key.isPressed;
                break;
            }
        };

        return retorno;
    }

    onKeyDown(event) {
        const keyCode = event.which;
        // console.log('tecla ',keyCode);
        this.teclas.map((key, i, arr) => {
            if (keyCode == key.code){
                arr[i].isPressed = true;
            }
        });
    }

    onkeyUp(event) {
        const keyCode = event.which;
        this.teclas.map((key, i, arr) => {
            if (keyCode == key.code){
                arr[i].isPressed = false;
            }
        });
    }
}