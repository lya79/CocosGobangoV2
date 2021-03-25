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
            default: null,
            type: cc.Object,
            visible: false,
        },
    },

    onLoad() {
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.mouseenter, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.mouseleave, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
    },

    init(main) {
        this.main = main;
    },

    onClick() {
        this.main.onRestartClick();
    },

    onDestroy() {
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.mouseenter, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.mouseleave, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
    },

    mouseenter() {
        this.node.color = new cc.color(100, 200, 100);
    },

    mouseleave() {
        this.node.color = new cc.color(255, 255, 255);
    },
});
