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
        /** 遊戲參數 */

        bingo: 0, // 多少顆算 bingo
        row: 0, // 格子列數
        col: 0, // 格子欄數
        rect_witdh: 0, // 格子寬度
        rect_height: 0, // 格子高度
        player_witdh: 0, // 腳色寬度
        player_height: 0, // 腳色高度

        /** node */

        menu: { // 遊戲啟動後看到的 menu
            default: null,
            type: cc.Node,
        },

        restart: { // 遊戲進行中用來重玩遊戲
            default: null,
            type: cc.Node,
        },

        notify: { // 遊戲結束用來通知勝負
            default: null,
            type: cc.Node,
        },

        info: { // 遊戲進行中用來顯示換誰下棋
            default: null,
            type: cc.Node,
        },

        /** prefab */

        prefab_rect: { // 棋盤格子
            default: null,
            type: cc.Prefab,
        },

        prefab_player1: { // 棋盤上的腳色1
            default: null,
            type: cc.Prefab,
        },

        prefab_player2: { // 棋盤上的腳色2
            default: null,
            type: cc.Prefab,
        },


        /** 遊戲內部參數 */

        state_game: { // 0:顯示目錄頁面, 1:遊戲進行中, 2:遊戲結束
            default: 0,
            type: cc.Integer,
            visible: false,
        }, 

        rect_arr: { // 棋盤上的格子
            default: null,
            type: [cc.Node],
            visible: false,
        },

        player_arr: { // 棋盤上的腳色
            default: null,
            type: [cc.Node],
            visible: false,
        },

        selected_arr: { // 用來記錄目前棋盤上的變化, 0:還未下棋, 1:玩家1, 2:玩家2
            default: null,
            type: [cc.Integer],
            visible: false,
        },
    },

    onLoad () {
        this.reset();
        this.updateUI();
    },

    reset() { // 初始化內部參數

    },

    updateUI() {
        switch (this.state_game) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
        }
    },
});
