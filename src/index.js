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

function Board(rows, columns){ // rows*columns인 matrix를 만들고, [false, false, false, false]으로 채움
    return new Array(rows).fill(null).map(row =>
        new Array(columns).fill(null).map(cell => [false, false, false, false])
    )
}
const ROW = 3;
const COLUMN = 15;
const MAX_LENGTH = 45;

const app = new Vue({
    el: "#app",
    data: {
        title: "ID카드에 소개를 써보자!",
        mousedown: false,
        mousedownOnCheckedCell: false,
        board: Board(3, 15),
        input: ""
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
        resetCells(){
            this.board = Board(ROW, COLUMN)
        },
        toggleCells(){
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
                this.input = "▞▚▗▀▖▛▚▐▖▟▗▀▖▛▚▝▖▐　▌▛▘▐▐▐▐　▌▌▐▚▞▝▄▘▌　▐　▐▝▄▘▙▞"
            }
            if(this.input){
                const newBoard = Board(ROW, COLUMN)
                for(let i = 0; i < MAX_LENGTH; i++){
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
        selectAll($event){
            $event.target.setSelectionRange(0, $event.target.value.length)
        }
    }
})