const MAX_LENGTH =8;
var broad = document.querySelector(".broad");
var bestCore = document.querySelector(".bestCore");
var timeMessage = document.querySelector(".timeMessage");
var mesMinutes=document.querySelector(".minutes");
var mesSeconds = document.querySelector(".seconds");
var mesMiniSeconds = document.querySelector(".miniseconds");

var addSeconds = document.querySelector(".addSeconds");
var time = '00:00:00';
var minutes = 0, seconds = 0, miniseconds = 0;
var countTime1 =0;
var countTime2 = Number.MAX_VALUE;
var interval;



const individual = [];
for (let i = 0; i < 8; i++) {
    individual[i] = 0;
}
var solutions = [];

function createBroad() {
    var temp = [];
    for (var i = 1; i <= 8; i++) {
        var row = `<div class="column" >`;
        var column = ''
        for (var j = 1; j <= 8; j++) {
            column += `<div class="square" data-row="${j}" data-column="${i}" onclick="chooseQueen(this)"><i class="fa-regular fa-chess-queen"></i></div>`
        }
        row += column
        row += `</div>`
        temp.push(row)
    }
    broad.innerHTML = temp.join('');
}
createBroad()

const columns = broad.querySelectorAll(".column");
function getRows(column){
    return columns[column - 1].querySelectorAll(".square");
}


var blue1 = "#307ea8";
var blue2 = "#002B5B";
var green1 = "#38E54D";
function paintCaro(row,column){
    var rows = getRows(column);
    rows[row-1].style.backgroundColor = blue1;
    if (row % 2 != 0 && column % 2 != 0 || row % 2 == 0 && column % 2 == 0)
        rows[row - 1].style.backgroundColor = blue2;
    else rows[row - 1].style.backgroundColor = blue1;
}
function paintRed(row, column){
    var rows = getRows(column);
    rows[row - 1].style.backgroundColor = "red";
}
function printCaro() {
    for (let i = 0; i < columns.length; i++) {
        var rows = getRows(i+1);
        for (let j = 0; j < rows.length; j++) {
            paintCaro(j+1, i+1);
        }
    }
}
printCaro();


genetic(92, solutions);
function findBestindividual(individual1, solutions) {
    var result = solutions[0];
    var max = -1;
    for (let i = 0; i < solutions.length; i++) {
        var count = 0;
        for (let j = 0; j < individual1.length; j++) {
            if (individual1[j] == solutions[i][j])
                count++;
        }
        if (max < count) {
            result = solutions[i];
            max = count;
        }
    }
    return result;
}

//////////////////////////////// các hàm chức năng /////////////////////////////
function showQueen(columns, solution) {// show full queens
    for (let i = 0; i < columns.length; i++) {
        var rows = getRows(i + 1);
        for (let j = 0; j < rows.length; j++) {
            if (parseInt(rows[j].dataset.row) == parseInt(solution[i])) {
                rows[j].firstChild.style.display = "inline"
            }
        }
    }
}
function showOneQueen(index_row, index_column) {
    var row = getRows(index_column+1);
    console.log(index_row, index_column);
    row[index_row].classList.add("help");
}
function clock() {
    minutes = 0, seconds = 0, miniseconds = 0;
    countTime1=0;
    interval = setInterval(function () {
        miniseconds++;
        if (miniseconds >= 100) {
            miniseconds = 0;
            seconds += 1;
        }
        if (seconds >= 60) {
            seconds = 0;
            minutes += 1;
        }
        var m = minutes < 10 ? '0' + minutes : minutes;
        var s = seconds < 10 ? '0' + seconds : seconds;
        var ms = miniseconds < 10 ? '0' + miniseconds : miniseconds;
        time = `${m} : ${s} : ${ms}`;
        mesMinutes.textContent=m;
        mesSeconds.textContent=s;
        mesMiniSeconds.textContent=ms;
        countTime1++;
    }, 10)
}
var stopTime = true;
function start() {
    if(goal(getFitness(individual))==true){
        reset();
        stopTime = true;
    }
    if (stopTime == true) {
        stopTime = false;
        clock();
        console.log("start", stopTime)
    }
}
function help() {
    seconds += 5;
    addSeconds.classList.add("fiveSeconds");
    setTimeout(function () {
        addSeconds.classList.remove("fiveSeconds");
    }, 2000);
    var bestSolution = findBestindividual(individual, solutions);
    do {// kiểm tra lấy những ô chưa được chọn
        var index_column = random(0, 7);
        var index_row = bestSolution[index_column] - 1;
    } while (individual[index_column] != 0)
    showOneQueen(index_row, index_column);
}
function reset() {
    if (stopTime == false) {
        stopTime = true
        mesMinutes.textContent = '00';
        mesSeconds.textContent = '00';
        mesMiniSeconds.textContent = '00';
        clearInterval(interval);
    }
    for (let i = 0; i < columns.length; i++) {
        var rows = getRows(i+1);
        for (let j = 0; j < rows.length; j++) {
            rows[j].firstChild.style.display = "none";
        }
        individual[i] = 0;
    }
    for (let i = 0; i < columns.length; i++) {
        var rows = getRows(i+1);
        for (let j = 0; j < rows.length; j++) {
            if (rows[j].classList.contains("help"))
                rows[j].classList.remove("help");
        }
    }
    printCaro();
}
function alertWin(time) {
    clearInterval(interval);
    if(countTime1 < countTime2){
        countTime2=countTime1;
        bestCore.innerHTML = time;
    }
    mesMinutes.textContent = "You";
    mesSeconds.textContent = "Win";
    mesMiniSeconds.textContent = "🎉";
}
//////////////////// Tạo ràng buộc cho full broad ///////////////////

function isContrains(row, column) {
    var rows = getRows(column);
    // kiểm tra hàng dọc
    for (let i = 0; i < rows.length; i++) {
        if (individual[i] != 0 && individual[i] != row && i + 1 == column)
            return true;
    }
    //kiểm tra hàng ngang
    for (let i = 0; i < individual.length; i++) {
        if (individual[i] == row && i + 1 != column)
            return true;
    }
    //kiểm tra đường chéo
    for (let i = 0; i < individual.length ; i++){
        if(i!=(column-1) && individual[i]!=0 &&  Math.abs(individual[i]-row)== Math.abs(i-(column-1)))
            return true;
    }
    return false;
}
function coord(row, column){
    this.row=row;
    this.column=column;
}
function getConstrain(row, column){
    var constrainOfOneSquare=[];
    var r, c,temp;

    // hàng dọc
    for(r=1;r<=MAX_LENGTH; r++){
        if(r!=row){
            temp=new coord(r, column);
            if (constrainOfOneSquare.includes(temp) == false)
                constrainOfOneSquare.push(temp);
        }
    }
    // hàng ngang
    for (c = 1; c <= MAX_LENGTH; c++) {
        if (c != column) {
            temp = new coord(row, c);
            if (constrainOfOneSquare.includes(temp) == false)
                constrainOfOneSquare.push(temp);
        }
    }
    // chéo trên trái
    for (r = row - 1, c = column - 1; r >= 1 && c >= 1; r--, c--) {
        temp = new coord(r, c);
        if (constrainOfOneSquare.includes(temp) == false)
            constrainOfOneSquare.push(temp);
    }
    // chéo dưới trái
    for (r = row +1, c = column - 1; r<= MAX_LENGTH && c >= 1; r++, c--) {
        temp = new coord(r, c);
        if (constrainOfOneSquare.includes(temp) == false)
            constrainOfOneSquare.push(temp);
    }
    // chéo trên phải
    for (r = row - 1, c = column + 1; r >= 1 && c <=MAX_LENGTH; r--, c++) {
        temp = new coord(r, c);
        if(constrainOfOneSquare.includes(temp)==false)
            constrainOfOneSquare.push(temp); 
    }
    // chéo dưới phải
    for (r = row + 1, c = column + 1; r <=MAX_LENGTH && c <=MAX_LENGTH; r++, c++) {
        temp = new coord(r, c);
        if (constrainOfOneSquare.includes(temp) == false)
            constrainOfOneSquare.push(temp);
    }
    return constrainOfOneSquare;
}
console.log(getConstrain(1,2));
////////////////////////////////////////////////////////////////////////////////

function checkContrainsFullBroad(row, column){
    var constrains = getConstrain(row, column);
    var rows=getRows(column);
    var count=0;
    for(let i=0; i<constrains.length; i++){
        var coord=constrains[i];
        var square=getRows(coord.column)[coord.row-1];
        // console.log(square)
        if (getComputedStyle(square.firstChild).display != "none" && getComputedStyle(rows[row - 1].firstChild).display != "none"){
            paintRed(coord.row, coord.column);
            paintRed(row, column);
            count++;
        }
        else{
            paintCaro(coord.row, coord.column);
        } 
    }
    if(count==0)
        paintCaro(row, column);
}
function chooseQueen(square) {
    var index_row = parseInt(square.dataset.row);
    var index_column = parseInt(square.dataset.column);
    console.log(index_row, index_column)
    if (getComputedStyle(square.firstChild).display == "none") {
        square.firstChild.style.display = "inline";
        if (individual[index_column - 1] == 0)
            individual[index_column - 1] = index_row;
    }
    else {
        square.firstChild.style.display = "none";
        for (let i = 0; i < individual.length; i++) {
            if (individual[i] == index_row && i + 1 == index_column)
                individual[index_column - 1] = 0;
        }
    }
    console.log(individual,getFitness(individual))
    console.log(findBestindividual(individual, solutions))

    checkContrainsFullBroad(index_row, index_column);
    if (individual.includes(0)==false && goal(getFitness(individual)) == true) {
        alertWin(time);
    }
}
