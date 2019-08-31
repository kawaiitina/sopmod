const BLOCK_ELEMENTS = [
    // 8 4
    // 2 1
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

function Board(rows, columns){
    const arr = multidimensionalArray(rows, columns);
    arr.forEach(row => {
        row.forEach((cell, i) => {
            // topLeft, topRight, bottomLeft, bottomRight 순서
            row[i] = [false, false, false ,false]
        })
    })
    return arr
}


const app = new Vue({
    el: "#app",
    data: {
        title: "ID카드에 자기 소개를 그려보자!",
        mousedown: false,
        mousedownOnCheckedCell: false,

        row: 3,
        column: 14,
        board: Board(3, 14),

        row_input: 3, 
        column_input: 14,
        includeLineBreak: true,

        resultTable: multidimensionalArray(3, 14)
    },
    computed: {
        result: {
            get(){
                let str = ""
                const array = multidimensionalArray(this.row, this.column);
                for(let i = 0; i < this.row; i++){
                    for(let j = 0; j < this.column; j++){
                        const cell = this.board[i][j];
                        const blockElement = BLOCK_ELEMENTS[
                            (cell[0] ? 8 : 0) +
                            (cell[1] ? 4 : 0) +
                            (cell[2] ? 2 : 0) +
                            (cell[3] ? 1 : 0)
                        ];
                        str += blockElement
                        array[i][j] = blockElement
                    }
                    if(this.includeLineBreak){
                        str += LINE_BREAK;
                    }
                }
                return {
                    toString(){return str;},
                    array
                };
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
            this.drawPreview();
        },
        subCellMouseOver(cell, subCellIndex){
            if(this.mousedown){
                cell.splice(subCellIndex, 1, !this.mousedownOnCheckedCell);
            }
            this.drawPreview();
        },
        resetBoard(){
            const {row, column} = this;
            if(window.confirm("초기화할까요?")){
                this.board = Board(row, column);
                this.drawPreview();
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
            this.drawPreview();
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
            this.drawPreview();
        },
        copyBoardToClipboard(){
            document.getElementById('result').select()
            document.execCommand("copy");
            window.alert("복사되었습니다.")
        },
        selectAll($event){
            $event.target.setSelectionRange(0, $event.target.value.length)
        },
        drawPreview(){
            const {row, column, board} = this;
            const canvas = document.getElementById("preview");
            const ctx = canvas.getContext("2d");
            const cellWidth = 30;
            const cellHeight = 30;
            const subCellWidth = cellWidth / 2;
            const subCellHeight = cellHeight / 2;
            const rowDistance = 5;
            const drawStartX = 160;
            const drawStartY = 90;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "rgb(255, 255, 255)";
            for(let i = 0; i < row; i++){
                for(let j = 0; j < column; j++){
                    const cell = board[i][j];
                    if(cell[0]){ // top left
                        ctx.fillRect(
                            drawStartX + j * cellWidth,
                            drawStartY + i * (cellHeight + rowDistance), 
                            subCellWidth,
                            subCellHeight
                        )
                    }
                    if(cell[1]){ // top right
                        ctx.fillRect(
                            drawStartX + j * cellWidth + subCellWidth,
                            drawStartY + i * (cellHeight + rowDistance), 
                            subCellWidth,
                            subCellHeight
                        )
                    }
                    if(cell[2]){ // bottom left
                        ctx.fillRect(
                            drawStartX + j * cellWidth,
                            drawStartY + i * (cellHeight + rowDistance) + subCellHeight, 
                            subCellWidth,
                            subCellHeight
                        )
                    }
                    if(cell[3]){ // bottom right
                        ctx.fillRect(
                            drawStartX + j * cellWidth + subCellWidth,
                            drawStartY + i * (cellHeight + rowDistance) + subCellHeight, 
                            subCellWidth,
                            subCellHeight
                        )
                    }
                }
            }
        },
        copyToResultTable(){
            if(window.confirm("불러올까요?")){
                this.resultTable = this.result.array;
            }
        },
        copyResultTableToClipBoard(){
            const {row, column, includeLineBreak} = this;
            let str = ""
            const elems = document.getElementsByClassName("result-table-data");
            for(let rowIndex = 0; rowIndex < row; rowIndex += 1){
                for(let columnIndex = 0; columnIndex < column; columnIndex += 1){
                    str += elems[rowIndex * column + columnIndex].innerHTML;
                }
                if(includeLineBreak){
                    str += LINE_BREAK;
                }
            }
            const $textarea_temp = document.getElementById("textarea-temp");
            $textarea_temp.innerHTML = str;
            $textarea_temp.style.display = "block";
            $textarea_temp.select()
            document.execCommand("copy");
            $textarea_temp.style.display = "none";
            window.alert("복사되었습니다.")
        }
    }
})
window.onbeforeunload = function (){return "솦"}