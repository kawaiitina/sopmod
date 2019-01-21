const BLOCK_ELEMENTS = [
    "　", // U+3000, BLANK
    "▗", // U+2597, QUADRANT_LOWER_RIGHT
    "▖", // U+2596, QUADRANT_LOWER_LEFT
    "▄", // U+2584, LOWER_HALF
    "▝", // U+259D, QUADRANT_UPPER_RIGHT
    "▐", // U+2590, RIGHT_HALF
    "▞", // U+259E, QUADRANT_UPPER_RIGHT_AND_LOWER_LEFT
    "▟", // U+259F, QUADRANT_UPPER_RIGHT_AND_LOWER_LEFT_AND_LOWER_RIGHT
    "▘", // U+2598, QUADRANT_UPPER_LEFT
    "▚", // U+259A, QUADRANT_UPPER_LEFT_AND_LOWER_RIGHT
    "▌", // U+258C, LEFT_HALF
    "▙", // U+2599, QUADRANT_UPPER_LEFT_AND_LOWER_LEFT_AND_LOWER_RIGHT
    "▀", // U+2580, UPPER_HALF
    "▜", // U+259C, QUADRANT_UPPER_LEFT_AND_UPPER_RIGHT_AND_LOWER_RIGHT
    "▛", // U+259B, QUADRANT_UPPER_LEFT_AND_UPPER_RIGHT_AND_LOWER_LEFT
    "█" // U+2588, FULL_BLOCK
]

function multidimensionalArray(){
    let result = [];
    if(arguments.length === 1){
        return new Array(arguments[0]).fill(null)
    } else {
        const args = Array.from(arguments);
        args.shift()
        return new Array(arguments[0]).fill(null).map(el => multidimensionalArray(...args));
    }
}

function Board(rows, columns){ // rows*columns인 2차원 행렬을 만들고, [false, false, false, false]으로 채움
    const arr = multidimensionalArray(ROW, COLUMN);
    arr.forEach(row => {
        row.forEach((cell, i) => {
            row[i] = [false, false, false, false]
        })
    })
    return arr
}
const ROW = 3;
const COLUMN = 15;
const BOARD_LENGTH = 45;

const app = new Vue({
    el: "#app",
    data: {
        title: "ID카드에 소개를 써보자!",
        mousedown: false,
        mousedownOnCheckedCell: false,
        ROW, 
        COLUMN,
        BOARD_LENGTH,
        board: Board(ROW, COLUMN),
        input: "",
        data_board_text: multidimensionalArray(ROW, COLUMN)
    },
    computed: {
        result: {
            get(){
                let str = ""
                for(let i = 0; i < ROW; i++){
                    for(let j = 0; j < COLUMN; j++){
                        const cell = this.board[i][j];
                        str += BLOCK_ELEMENTS[
                            cell[0] * 8 +
                            cell[1] * 4 +
                            cell[2] * 2 +
                            cell[3]
                        ]
                    }
                }
                return str;
            },
            set(input){
                this.input = input;
            }
        },
        board_text: {
            get(){
                return this.data_board_text
            },
            set(input){
                this.data_board_text = input;
                console.log(input);
            }
        }
    },
    methods:{
        appMouseDown(){
            this.mousedown = true;
        },
        appMouseUp(){
            this.mousedown = false;
        },
        subCellMouseDown(cell, subCellIndex, value){
            this.mousedownOnCheckedCell = value
            cell.splice(subCellIndex, 1, !value);
        },
        subCellMouseOver(cell, subCellIndex){
            if(this.mousedown){
                cell.splice(subCellIndex, 1, !this.mousedownOnCheckedCell);
            }
        },
        resetBoard(){
            if(window.confirm("초기화할까요?")){
                this.board = Board(ROW, COLUMN);
            }
        },
        invertBoard(){
            for(let i = 0; i < ROW; i++){
                for(let j = 0; j < COLUMN; j++){
                    for(let k = 0; k < 4; k++){
                        this.board[i][j].splice(k, 1, !this.board[i][j][k])
                    }
                }
            }
        },
        load(){
            if(this.input == "솦" || this.input == "솦모" || this.input == "솦모챠"){
                this.title = "초진화! 크리스마스트리!";
                this.input = "▞▚▗▀▖▛▚▐▖▟▗▀▖▛▚▝▖▐　▌▛▘▐▚▜▐　▌▌▐▚▞▝▄▘▌　▐▝▐▝▄▘▙▞"
            }
            if(this.input){
                const newBoard = Board(ROW, COLUMN)
                for(let i = 0; i < BOARD_LENGTH; i++){
                    const idx = BLOCK_ELEMENTS.findIndex(el => el === this.input.charAt(i));
                    if(idx != -1){
                        const bin = idx.toString(2);
                        const paddedBin = "0000".substr(bin.length) + bin;
                        for(let j = 0; j < 4; j++){
                            newBoard[Math.floor(i / COLUMN)][i % COLUMN][j] = !!Number(paddedBin.charAt(j))
                        }

                    } else {
                        window.alert("잘못된 입력입니다.")
                        return
                    }
                }
                this.board = newBoard;
            }
        },
        copyToClipboard(id){
            document.getElementById(id).select()
            document.execCommand("copy");
        },
        selectAll($event){
            $event.target.setSelectionRange(0, $event.target.value.length)
        },
        copyBoard(){
            if(window.confirm("복사합니다.")){
                const board_text = multidimensionalArray(ROW, COLUMN)
                const {result} = this;
                for(let i = 0; i < ROW; i++){
                    for(let j = 0; j < COLUMN; j++){
                        board_text[i][j] = result.substr(i * COLUMN).charAt(j)
                    }
                }
                this.board_text = board_text;
            }
        },
        copyBoardTextToClipboard(){
            const {board_text} = this;
            let str = "";
            for(let i = 0; i < ROW; i++){
                for(let j = 0; j < COLUMN; j++){
                    str += board_text[i][j];
                }
            }
            const tempElem = document.getElementById("result-diy");
            tempElem.value = str;
            tempElem.select();
            document.execCommand("copy");
            return str;
        }
    }
})