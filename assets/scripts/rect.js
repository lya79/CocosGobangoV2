// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        main:{
            default :null,
            visible: false,
        },
        clicked:{
            default: false,
            visible: false,
        },
        row: {
            default: false,
            visible: false,
        },
        col: {
            default: false,
            visible: false,
        },
    },

    onLoad(){
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.mouseenter, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.mouseleave, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
    },

    onDestroy(){
        if (this.clicked) {
            return;
        }
        this.unRegister();
    },

    init(main, col, row, opacity, width, height){
        this.main = main;
        this.col = col;
        this.row = row;

        this.node.width = width;
        this.node.height = height;
        this.node.opacity = opacity;
    },

    isClicked(){
        return this.clicked;
    },

    onClick(){
        if (this.clicked){
            return;
        }
        this.clicked = true;
        this.unRegister();
        this.main.onRectClick(
            this.node.x, this.node.y, 
            this,
            this.row, this.col,
        );
    },

    mouseenter(){
        this.node.color = new cc.color(100,200,100);
    },

    mouseleave() {
        this.node.color = new cc.color(255, 255, 255);
    },

    unRegister(){
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this.mouseenter, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.mouseleave, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.onClick, this);
    },

    setBG(player1){
        this.node.color = player1 ? new cc.color(117, 40, 141) : new cc.color(40, 141, 100);
        this.node.opacity = 255;
    },

    setBGBingo() {
        this.node.color = new cc.color(255, 255, 255);
        this.node.opacity = 255;
    },

    lock(){
        this.clicked = true;
        this.unRegister();
    },
});
