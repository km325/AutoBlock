class Mouse  {
    constructor() {
        this.x = 0; this.y = 0; this.oldX = 0; this.oldY = 0;
        this.button = -1; this.buttons = -1; 
        this.movementX = 0; this.movementY = 0; 
        this.timeStamp = 0; this.type = ""; 
        this.lbDown = 0; this.rbDown = 0; this.mbDown = 0;
        this.deltaX = 0; this.deltaY = 0; this.deltaZ = 0; this.deltaMode = 0;
        this.lbDownTime = 0; this.lbUpTime = 0; 
        this.rbDownTime = 0; this.rbUpTime = 0; 
        this.mbDownTime = 0; this.mbUpTime = 0;
        this.lbDragTime = 0; this.rbDragTime = 0; this.mbDragTime = 0; 
        this.lbDrag = 0;
        this.lbDownPos = {x:0, y:0}; this.lbUpPos = {x:0, y:0};
        this.rbDownPos = {x:0, y:0}; this.rbUpPos = {x:0, y:0};
        this.doubleClickDuration = 300;
        this.dragDuration = 100;  
        // dragDropDuration: ? je potreba? nebo je d&d v pripade, ze drzime tlacitko dele nez doubleClickDuration?
        this.lbClick = 0; this.rbClick = 0; this.mbClick = 0; 
        this.unreadEvents = 0;
        // Note(MGT): prejmenovat spise na attachEvent() ? umoznisti "odpojeni"?
        // this.init();
    } 

    init() {
        document.body.addEventListener("mousedown", (e) => { this.mouseEvent(e); });
        document.body.addEventListener("mouseup", (e) => { this.mouseEvent(e); });
        document.body.addEventListener("mousemove", (e) => { this.mouseEvent(e); });
        document.body.addEventListener("wheel", (e) => { this.mouseEvent(e); });
        // canvas.onmousedown=mouse;
        // canvas.onmouseup=mouse;
        // canvas.onmousemove=mouse;
    }

    mouseEvent(e) {
        this.unreadEvents++;
        this.oldX = this.x;
        this.x = e.offsetX;
        this.oldY = this.y;
        this.y = e.offsetY;
        this.button = e.button;
        this.buttons = e.buttons;
        this.movementX = e.movementX;
        this.movementY = e.movementY;
        this.type = e.type;
        this.timeStamp = e.timeStamp;
        if (e.type == 'wheel') {
            this.deltaX = Math.round(e.deltaX);
            this.deltaY = Math.round(e.deltaY);
            this.deltaZ = Math.round(e.deltaZ);
            this.deltaMode = e.deltaMode;
        }
        this.e = e;
    
        // po vyzkouseni dat switch na vsechny mozne tlacitka
        switch (e.button) {
            case 0: { // left mouse button
                switch (e.type) {
                    case "mousedown": {
                        this.lbDown = 1;
                        this.lbDrag = 1;
                        if (e.timeStamp - this.lbDownTime <= this.doubleClickDuration) {
                            this.lbClick = 2;
                        } else {
                            this.lbClick = 0;
                        }
                        this.lbDownTime = e.timeStamp;
                        this.lbDownPos.x = e.offsetX;
                        this.lbDownPos.y = e.offsetY;
                        break;
                    }
                    case "mouseup": {
                        this.lbDown = 0;
                        this.lbDrag = 0;
                        if (e.timeStamp - this.lbUpTime <= this.doubleClickDuration) {
                            this.lbClick = 2;
                        } else {
                            this.lbClick = 1;
                        }
                        this.lbUpTime = e.timeStamp;
                        this.lbUpPos.x = e.offsetX;
                        this.lbUpPos.y = e.offsetY;
                        break;                                
                    }
                }
                break;
            }
            case 2: { // right mouse button
                switch (e.type) {
                    case "mousedown": {
                        this.rbDown = 1;
                        this.rbDrag = 1;
                        if (e.timeStamp - this.rbDownTime <= this.doubleClickDuration) {
                            this.rbClick = 2;
                        } else {
                            this.rbClick = 0;
                        }
                        this.rbDownTime = e.timeStamp;
                        this.rbDownPos.x = e.offsetX;
                        this.rbDownPos.y = e.offsetY;
                        break;
                    }
                    case "mouseup": {
                        this.rbDown = 0;
                        this.rbDrag = 0;
                        if (e.timeStamp - this.rbUpTime <= this.doubleClickDuration) {
                            this.rbClick = 2;
                        } else {
                            this.rbClick = 1;
                        }
                        this.rbUpTime = e.timeStamp;
                        this.rbUpPos.x = e.offsetX;
                        this.rbUpPos.y = e.offsetY;
                        break;                                
                    }
                }
                break;
            }
            default: {
                console.log('Nezname tlacitko : '+e.button);
                break;
            }
        }
    }

    readMouse(time) {
        if (this.lbDown ) { //&& time-this.lbDownTime>this.dragDuration
            this.lbDragTime = this.timeStamp;
        } else {
            this.lbDragTime = 0;
        }
        if (this.rbDown ) {
            this.rbDragTime = this.timeStamp;
        } else {
            this.rbDragTime = 0;
        }
        if (this.deltaX > 0) {
            this.deltaX--;
        } else if (this.deltaX < 0) {
            this.deltaX++;
        }
        if (this.deltaY > 0) {
            this.deltaY--;
        } else if (this.deltaY < 0) {
            this.deltaY++;
        }
        if (this.deltaZ > 0) {
            this.deltaZ--;
        } else if (this.deltaZ < 0) {
            this.deltaZ++;
        }
        
        if (this.unreadEvents > 0) this.unreadEvents--;
    }
    
    inRegion(x1, y1, x2, y2) {
        let pom;
        if ( x1 > x2) {
            pom = x1;
            x1 = x2;
            x2 = pom;
        }
        if ( y1 > y2) {
            pom = y1;
            y1 = y2;
            y2 = pom;
        }
        if (this.x < x1 || this.x > x2 ||
            this.y < y1 || this.y > y2) {
                return false;
            } else {
                return true;
            }
    }
}

class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener('keydown', e => {
            if ((e.key === 'ArrowDown' || 
                e.key === 'ArrowUp' || 
                e.key === 'ArrowLeft' || 
                e.key === 'ArrowRight' || 
                e.key === 'Enter' ||
                e.key === 'Control') 
                && this.keys.indexOf(e.key) === -1) 
                {
                this.keys.push(e.key);
            } else if (e.key === 'd') debug = !debug;
        });
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowDown' || 
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' || 
                e.key === 'ArrowRight' || 
                e.key === 'Enter' ||
                e.key === 'Control') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
            // console.log(this.keys);
        });
    }
}

class UIElement {
    constructor(x=10, y=10, width=50, height=50) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.name = '';
        this.strokeStyle = 'red';
        this.fillStyle = 'lightblue';
    }

    draw() {}
}

class CheckBox extends UIElement {
    constructor(x=10, y=10, size=30, checked=false) {
        super(x, y, size, size);
        this.checked = checked;
        // predpokladam ctvercovy pomer stran
        this.width = size;
        this.height = size;
        this.type = 'CHECKBOX';
        this.mouseOver = false;
    }

    draw(ctx) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        if (this.mouseOver) {
            ctx.lineWidth = 2;
        } else {
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        if (this.checked) {
            ctx.moveTo(this.x+this.width/10, this.y+this.height/10);
            ctx.lineTo(this.x+this.width-this.width/10, this.y+this.height-this.height/10);
            ctx.moveTo(this.x+this.width/10, this.y+this.height-this.height/10);
            ctx.lineTo(this.x+this.width-this.width/10, this.y+this.height/10);
        }
        ctx.fill();
        ctx.stroke();
    }

    click() {
        this.checked = !this.checked;
    }

    mMouseOver() {

    }
}

class UIManager {
    constructor(ctx) {
        // ctx - context on which will draw
        this.objects = [];
        this.mWasDown = false;
        this.mLbDown = false;
        this.mLClick = false;
        this.ctx = ctx;
    }

    addObject(object) {
        //object.ctx = this.ctx;
        this.objects.push(object);
    }

    update(mouse) {
        this.mLbDown = mouse.lbDown;
        if (this.mLbDown && !this.mWasDown) this.mLClick = true;
        for (let i=0;i<this.objects.length;i++) {
            let obj = this.objects[i];
            obj.mouseOver = false;
            if (mouse.inRegion(obj.x, obj.y, obj.x+obj.width, obj.y+obj.height)) {
                obj.mouseOver = true;
                obj.mMouseOver();
                if (this.mLClick) obj.click();
            }
            obj.draw(this.ctx);
        }
        this.mLClick = false;
        this.mWasDown = this.mLbDown;
    }
}