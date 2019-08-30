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
const LINE_BREAK = "\n";
function multidimensionalArray(){
    if(arguments.length === 1){
        return new Array(arguments[0]).fill(null)
    } else {
        const args = Array.from(arguments);
        args.shift()
        return new Array(arguments[0]).fill(null).map(el => multidimensionalArray(...args));
    }
}

function Board(rows, columns){ // rows*columns인 2차원 행렬을 만들고, [false, false, false, false]으로 채움
    const arr = multidimensionalArray(rows, columns);
    arr.forEach(row => {
        row.forEach((cell, i) => {
            row[i] = [false, false, false, false]
        })
    })
    return arr
}
const ROW = 3;
const COLUMN = 14;
const BOARD_LENGTH = 45;

const app = new Vue({
    el: "#app",
    data: {
        title: "ID카드에 자기 소개를 그려보자!",
        mousedown: false,
        mousedownOnCheckedCell: false,
        row: 3,
        column: 14,
        row_input: 3, 
        column_input: 14,
        includeLineBreak: true,
        boardLength: 45,
        board: Board(3, 14),
        input: "",
        board_text: multidimensionalArray(3, 14)
    },
    computed: {
        result: {
            get(){
                let str = ""
                for(let i = 0; i < this.row; i++){
                    for(let j = 0; j < this.column; j++){
                        const cell = this.board[i][j];
                        str += BLOCK_ELEMENTS[
                            cell[0] * 8 +
                            cell[1] * 4 +
                            cell[2] * 2 +
                            cell[3]
                        ]
                    }
                    if(this.includeLineBreak){
                        str += LINE_BREAK;
                    }
                }
                return str;
            },
            set(input){
                this.input = input;
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
            const {row, column} = this;
            if(window.confirm("초기화할까요?")){
                this.board = Board(row, column);
            }
        },
        resizeBoard(){
            const {row_input, column_input} = this;
            if(!window.confirm("크기를 변경하면 작업 내용이 지워집니다.")){
                return;
            }
            this.row = Number(row_input);
            this.column = Number(column_input);
            this.board = Board(Number(row_input), Number(column_input));
        },
        invertBoard(){
            const {row, column, board} = this;
            for(let i = 0; i < row; i++){
                for(let j = 0; j < column; j++){
                    for(let k = 0; k < 4; k++){
                        this.board[i][j].splice(k, 1, !board[i][j][k])
                    }
                }
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
            const {row, column} = this;
            let {result} = this;
            while(result.includes(LINE_BREAK)){
                result = result.replace(LINE_BREAK, "");
            }
            if(window.confirm("복사합니다.")){
                const board_text = multidimensionalArray(row, column)
                for(let i = 0; i < row; i++){
                    for(let j = 0; j < column; j++){
                        const char = result.substr(i * column).charAt(j);
                        if(char === LINE_BREAK){
                            continue;
                        }
                        board_text[i][j] = char
                    }
                }
                this.board_text = board_text;
            }
        },
        copyBoardTextToClipboard(){
            const {board_text, row, column} = this;
            let str = "";
            for(let i = 0; i < row; i++){
                for(let j = 0; j < column; j++){
                    str += board_text[i][j];
                }
                if(this.includeLineBreak){
                    str += LINE_BREAK;
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

window.onbeforeunload = function (e){return "ㅁㄷㄷ?"}