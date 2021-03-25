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

        bingo: 0, // 多少顆旗子bingo
        row: 0, // 格子列數
        col: 0, // 格子欄數
        rect_opacity: 0, // 格子透明度
        rect_offset: 0, // 格子偏移量
        rect_width: 0, // 格子寬度
        rect_height: 0, // 格子高度
        player_witdh: 0, // 腳色寬度
        player_height: 0, // 腳色高度
        rect_spacing: 0, // 格子之間的間距


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

        menuPlayer1: { // 先攻
            default: null,
            type: cc.Node,
        },

        menuPlayer2: { // 後攻
            default: null,
            type: cc.Node,
        },

        /** prefab */

        prefab_rect: { // 棋盤格子
            default: null,
            type: cc.Prefab,
        },

        prefabPlayer1: { // 棋盤上的腳色1
            default: null,
            type: cc.Prefab,
        },

        prefabPlayer2: { // 棋盤上的腳色2
            default: null,
            type: cc.Prefab,
        },


        /** 遊戲內部參數 */

        first: { // true:先攻, false:後攻
            default: true,
            visible: false,
        },

        round: { // 目前第幾局
            default: 0,
            visible: false,
        },

        gameState: { // 目前遊戲階段 0:顯示目錄頁面, 1:遊戲進行中, 2:遊戲結束
            default: -1,
            visible: false,
        },

        rect_arr: { // 棋盤上的格子 // XXX 可以用 prefab pool
            default: null,
            visible: false,
        },

        player_arr: { // 棋盤上的腳色 // XXX 可以用 prefab pool
            default: null,
            visible: false,
        },

        selected_arr: { // 用來記錄目前棋盤上的變化, 0:還未下棋, 1:玩家1, 2:玩家2
            default: null,
            visible: false,
        },
    },

    onLoad() {
        this.init();
    },

    start() {
        this.reset();
        this.nextState();
    },

    init() {
        this.rect_arr = [];
        this.player_arr = [];
        this.selected_arr = new Array(this.row);
        for (var row = 0; row < this.row; row++) {
            this.selected_arr[row] = new Array(this.col);
        }

        this.menuPlayer1.getComponent('selectPlayer1').init(this);
        this.menuPlayer2.getComponent('selectPlayer2').init(this);
        this.restart.getComponent('restart').init(this);
    },

    reset() { // 重置內部參數
        this.gameState = -1;

        for (var i = 0; i < this.rect_arr.length; i++) {
            this.rect_arr[i].destroy();
        }
        this.rect_arr = [];

        for (var i = 0; i < this.player_arr.length; i++) {
            this.player_arr[i].destroy();
        }
        this.player_arr = [];

        for (var row = 0; row < this.row; row++) {
            this.selected_arr[row].fill(0);
        }

        this.round = 1;
    },

    computerRound() { // 電腦的回合, 隨機選一個地方下棋 
        var self = this;

        function getNode(row, col) {
            /**
             * 0 1 2  3
             * 4 5 6  7
             * 8 9 10 11
             */
            var idx = (row * self.col) + col;
            return self.rect_arr[idx];
        }

        // this.selected_arr

        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        var row2 = -1;
        var col2 = -1; {
            var startRow = getRandomInt(this.selected_arr.length);
            var row = startRow;
            var startCol = getRandomInt(this.selected_arr[0].length);
            var col = startCol;
            for (var count = 0; count < this.selected_arr.length; count++) {
                if (row2 > -1 && col2 > -1) {
                    break;
                }
                row += 1;
                if (row >= this.selected_arr.length) {
                    row = 0;
                }
                for (var count2 = 0; count2 < this.selected_arr[row].length; count2++) {
                    col += 1;
                    if (col >= this.selected_arr[row].length) {
                        col = 0;
                    }
                    if (this.selected_arr[row][col] == 0) {
                        row2 = row;
                        col2 = col;
                        break;
                    }
                }
            }
        }

        var idx = getNode(row2, col2);
        var rect = idx.getComponent('rect');
        rect.onClick();
    },

    onMenuPlayerClick(first) {
        this.first = first;
        this.nextState();
        this.updateInfo();
        this.drawGrid();

        if (!this.first) {
            this.computerRound(); // 電腦的回合, 隨機選一個地方下棋
        }
    },

    onRestartClick() {
        this.reset();
        this.nextState(0);
    },

    onRectClick(x, y, obj, row, col) {
        var player1 = this.isPlayer1();

        this.selected_arr[row][col] = player1 ? 1 : 2;
        obj.setBG(player1);
        this.updateRect(x, y);

        this.round += 1;
        this.updateInfo();

        var values = this.isGameOver(row, col, player1 ? 1 : 2);
        var tie = this.isTie(); // 檢查是否為平手
        if (values.gameOver || tie) {
            this.nextState();

            for (var i = 0; i < this.rect_arr.length; i++) {
                this.rect_arr[i].getComponent('rect').lock();
            }


            if (tie) {
                this.notify.getChildByName('title').getChildByName('player').getComponent(cc.Label).string = "";
                this.notify.getChildByName('title').getChildByName('winner').getComponent(cc.Label).string = "Drawn Game";
            } else {
                for (var i = 0; i < values.nodeArray.length; i++) { // 更新 bingo連線
                    values.nodeArray[i].getComponent('rect').setBGBingo();
                }

                // 更新遊戲結果訊息
                this.notify.getChildByName('title').getChildByName('player').getComponent(cc.Label).string = player1 ? "PLAYER 1" : "PLAYER 2";
                this.notify.getChildByName('title').getChildByName('winner').getComponent(cc.Label).string = "Winner";
            }


            return;
        }

        if (this.isComputerRound()) { // 檢查是否為電腦回合
            this.computerRound();
        }
    },

    isTie() { // 檢查是否為平手
        for (var row = 0; row < this.selected_arr.length; row++) {
            for (var col = 0; col < this.selected_arr[row].length; col++) {
                if (this.selected_arr[row][col] == 0) {
                    return false;
                }
            }
        }
        return true;
    },

    isGameOver(selectedRow, selectedCol, targetValue) {
        /**
         * 1 2 3
         * 4 x 6
         * 7 8 9
         */

        var self = this;

        var gameOver = false;
        var nodeArray = new Array();

        function checkValue(row, col) {
            if (row < 0 || col < 0 || row >= self.selected_arr.length || col >= self.selected_arr[row].length) {
                return false;
            }
            if (self.selected_arr[row][col] != targetValue) {
                return false;
            }
            return true;
        }

        function getNode(row, col) {
            /**
             * 0 1 2  3
             * 4 5 6  7
             * 8 9 10 11
             */
            var idx = (row * self.col) + col;
            return self.rect_arr[idx];
        }

        nodeArray.push(getNode(selectedRow, selectedCol));

        { // 檢查 2-x-8
            var count = 1;
            var tmpNodeArray = []; { // 2
                var row = selectedRow;
                var col = selectedCol;
                for (var i = 0;;) {
                    row += -1;
                    if (!checkValue(row, col)) {
                        break;
                    }
                    count += 1;
                    tmpNodeArray.push(getNode(row, col));
                }
            } { // 8
                var row = selectedRow;
                var col = selectedCol;
                for (var i = 0;;) {
                    row += +1;
                    if (!checkValue(row, col)) {
                        break;
                    }
                    count += 1;
                    tmpNodeArray.push(getNode(row, col));
                }
            }
            if (count >= this.bingo) {
                nodeArray = nodeArray.concat(tmpNodeArray);
            }
            gameOver = gameOver || count >= this.bingo;
        }

        { // 檢查 4-x-6
            var count = 1;
            var tmpNodeArray = []; { // 4
                var row = selectedRow;
                var col = selectedCol;
                for (var i = 0;;) {
                    col += -1;
                    if (!checkValue(row, col)) {
                        break;
                    }
                    count += 1;
                    tmpNodeArray.push(getNode(row, col));
                }
            } { // 6
                var row = selectedRow;
                var col = selectedCol;
                for (var i = 0;;) {
                    col += +1;
                    if (!checkValue(row, col)) {
                        break;
                    }
                    count += 1;
                    tmpNodeArray.push(getNode(row, col));
                }
            }
            if (count >= this.bingo) {
                nodeArray = nodeArray.concat(tmpNodeArray);
            }
            gameOver = gameOver || count >= this.bingo;
        }

        { // 檢查 1-x-9
            var count = 1;
            var tmpNodeArray = []; { // 1
                var row = selectedRow;
                var col = selectedCol;
                for (var i = 0;;) {
                    row += -1;
                    col += -1;
                    if (!checkValue(row, col)) {
                        break;
                    }
                    count += 1;
                    tmpNodeArray.push(getNode(row, col));
                }
            } { // 9
                var row = selectedRow;
                var col = selectedCol;
                for (var i = 0;;) {
                    row += +1;
                    col += +1;
                    if (!checkValue(row, col)) {
                        break;
                    }
                    count += 1;
                    tmpNodeArray.push(getNode(row, col));
                }
            }
            if (count >= this.bingo) {
                nodeArray = nodeArray.concat(tmpNodeArray);
            }
            gameOver = gameOver || count >= this.bingo;
        }

        { // 檢查 7-x-3
            var count = 1;
            var tmpNodeArray = []; { // 7
                var row = selectedRow;
                var col = selectedCol;
                for (var i = 0;;) {
                    row += +1;
                    col += -1;
                    if (!checkValue(row, col)) {
                        break;
                    }
                    count += 1;
                    tmpNodeArray.push(getNode(row, col));
                }
            } { // 3
                var row = selectedRow;
                var col = selectedCol;
                for (var i = 0;;) {
                    row += -1;
                    col += +1;
                    if (!checkValue(row, col)) {
                        break;
                    }
                    count += 1;
                    tmpNodeArray.push(getNode(row, col));
                }
            }
            if (count >= this.bingo) {
                nodeArray = nodeArray.concat(tmpNodeArray);
            }
            gameOver = gameOver || count >= this.bingo;
        }

        return {
            gameOver: gameOver,
            nodeArray: nodeArray, // 回傳中獎的 node
        };
    },

    isComputerRound() { // 檢查是否為電腦回合
        if (this.isPlayer1()) { // 奇數局
            if (this.first) { // 玩家先
                return false;
            } else { // 玩家後
                return true;
            }
        } else { // 偶數局
            if (this.first) { // 玩家先
                return true;
            } else { // 玩家後
                return false;
            }
        }
    },

    isPlayer1() {
        return (this.round % 2 == 1);
    },

    nextState(state) {
        var oldState = this.gameState;
        var newState

        if (state !== undefined) {
            newState = state
        } else {
            newState = oldState + 1;
            if (newState > 2) {
                newState = 0;
            }
        }

        this.gameState = newState

        this.update(oldState, newState);
    },

    update(oldState, newState) {
        switch (newState) {
            case 0: // 回到選單
                this.info.active = false;
                this.notify.active = false;
                this.restart.active = false;
                this.menu.active = true;
                break;
            case 1: // 開始遊戲
                this.info.active = true;
                this.notify.active = false;
                this.restart.active = true;
                this.menu.active = false;
                break;
            case 2: // 結束
                this.info.active = false;
                this.notify.active = true;
                this.restart.active = true;
                this.menu.active = false;
                this.notify.zIndex = cc.macro.MAX_ZINDEX; // 讓元件顯示在最上層
                break;
        }
    },

    drawGrid() { // 繪製棋盤
        var rectWidthMax = ((this.col * this.rect_width) + ((this.col - 1) * this.rect_spacing));
        var rectHeightMax = ((this.row * this.rect_height) + ((this.row - 1) * this.rect_spacing));

        var baseX = 0 - (rectWidthMax / 2) + (this.rect_width / 2); // 最左上 x座標
        var baseY = 0 + (rectHeightMax / 2) - (this.rect_height / 2) - this.rect_offset; // 最左上 y座標

        for (var row = 0; row < this.row; row++) {
            for (var col = 0; col < this.col; col++) {
                var x = baseX + (col * this.rect_width) + (col * this.rect_spacing);
                var y = baseY - (row * this.rect_height) - (row * this.rect_spacing);

                var rect = cc.instantiate(this.prefab_rect);
                rect.setPosition(cc.v2(x, y));
                rect.getComponent('rect').init(
                    this,
                    col, row,
                    this.rect_opacity,
                    this.rect_width, this.rect_height,
                );

                this.node.addChild(rect);

                this.rect_arr.push(rect)
            }
        }
    },

    updateRect(x, y) { // 放置角色到棋盤上
        var player1 = this.isPlayer1();

        var img = cc.instantiate(player1 ? this.prefabPlayer1 : this.prefabPlayer2);
        img.getChildByName(player1 ? 'PurpleMonster' : 'jelly').width = this.player_witdh;
        img.getChildByName(player1 ? 'PurpleMonster' : 'jelly').height = this.player_height;
        img.setPosition(cc.v2(x, y));

        var animState = img.getComponent(cc.Animation).play(player1 ? 'player1Clip' : 'player2Clip');
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;

        this.node.addChild(img);
        this.player_arr.push(img)
    },

    updateInfo() { // 更新遊戲進行中的訊息內容
        var player1 = this.isPlayer1();

        { // 更新腳色圖片
            if (this.info.childrenCount > 1) {
                var children = this.info.children;
                this.info.removeChild(children[1]);
            }

            var img = cc.instantiate(player1 ? this.prefabPlayer1 : this.prefabPlayer2);
            img.getChildByName(player1 ? 'PurpleMonster' : 'jelly').width = 50;
            img.getChildByName(player1 ? 'PurpleMonster' : 'jelly').height = 50;
            img.setPosition(cc.v2(0, 0));

            var animState = img.getComponent(cc.Animation).play(player1 ? 'player1Clip' : 'player2Clip');
            animState.wrapMode = cc.WrapMode.Loop;
            animState.repeatCount = Infinity;

            this.info.addChild(img);
        }

        { // 更新文字內容
            this.info.getChildByName('player').getComponent(cc.Label).string = player1 ? 'PLAYER 1' : 'PLAYER 2';
            var animState = this.info.getComponent(cc.Animation).play('infoClip');
            animState.wrapMode = cc.WrapMode.Loop;
            animState.repeatCount = Infinity;
        }
    }
});