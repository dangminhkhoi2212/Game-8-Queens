
var broad=document.querySelector(".broad");
var bestCore = document.querySelector(".bestCore");
var timeMessage = document.querySelector(".timeMessage");
var addSeconds = document.querySelector(".addSeconds");
var time = '00:00:00';
var minutes = 0, seconds = 0, miniseconds = 0;
var interval;
var individual = [];
for (let i = 0; i < 8; i++) {
    individual[i] = 0;
}
var solutions = [];

function createBroad(){
    var temp=[];
    for(var i=1; i<=8; i++){
        var row =`<div class="column" >`;
        var column=''
        for(var j=1; j<=8; j++){
            column += `<div class="square" data-row="${j}" data-column="${i}" onclick="chooseQueen(this)"><i class="fa-regular fa-chess-queen"></i></div>`
        }
        row+=column
        row+=`</div>`
        temp.push(row)
    }
    broad.innerHTML=temp.join('');
}
createBroad()
var columns=broad.querySelectorAll(".column");
var blue1 = "#307ea8";
var blue2 = "#002B5B"

function printCaro(){
    for (let i = 0; i < columns.length; i++) {
        var rows = columns[i].querySelectorAll(".square");
        for (let j = 0; j < rows.length; j++) {
            rows[j].style.backgroundColor = blue1;
            if ((i + 1) % 2 != 0 && (j + 1) % 2 != 0) {
                rows[j].style.backgroundColor = blue2;
            }
            if ((i + 1) % 2 == 0 && (j + 1) % 2 == 0) {
                rows[j].style.backgroundColor = blue2;
            }
        }
    }
}
printCaro();
solve(92, solutions);
// console.log("solution", solutions)
function showQueen(columns, solution){
    for(let i=0; i<columns.length; i++){
        var rows = columns[i].querySelectorAll(".square");
        for(let j=0; j<rows.length; j++){
            if(parseInt(rows[j].dataset.row)==parseInt(solution[i])){
                rows[j].firstChild.style.display="inline"
            }
        }
    }
}
function clock() {
    minutes = 0, seconds = 0, miniseconds = 0;
    interval = setInterval(function () {
        miniseconds++;
        if (miniseconds == 100) {
            miniseconds = 0;
            seconds += 1;
        }
        if (seconds == 60) {
            seconds = 0;
            minutes += 1;
        }
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        miniseconds = miniseconds < 10 ? '0' + miniseconds : miniseconds;
        time = `${minutes} : ${seconds} : ${miniseconds}`;
        timeMessage.textContent = time;
        minutes = parseInt(minutes);
        seconds = parseInt(seconds);
        miniseconds = parseInt(miniseconds);

    }, 10)
}
var mark_help=0;
var stopTime=true;
function start(){
    if(stopTime==true){
        stopTime=false;
        clock();
        console.log("start",stopTime)
    }

}
function help(){
    seconds+=5;
    addSeconds.classList.add("fiveSeconds");
    setTimeout(function(){
        addSeconds.classList.remove("fiveSeconds");
    }, 2000);
    if(mark_help==1)
        showQueen(columns, solutions[0]);
    else showQueen(columns, [0,0,0,0,0,0,0,0]);
}
function reset(){
    if (stopTime == false) {
        stopTime=true
        time = '00:00:00';
        timeMessage.textContent = time;
        clearInterval(interval);
    }
    for (let i = 0; i < columns.length; i++) {
        var rows = columns[i].querySelectorAll(".square");
        for (let j = 0; j < rows.length; j++) {
            rows[j].firstChild.style.display = "none";
        }
        individual[i]=0;
    }
    printCaro();
}
function alertWin(time) {
    clearInterval(interval);
    bestCore.innerHTML = time;
    timeMessage.innerHTML = "You Win 🎉";
}

function isContrains(row, column){
    var rows = columns[column-1].querySelectorAll(".square");
    // kiểm tra hàng dọc
    for (let i = 0; i < rows.length; i++) {
        if (individual[i] !=0 && individual[i]!=row && i+1==column)
            return true;
    }
    //kiểm tra hàng ngang
    for (let i = 0; i < individual.length; i++) {
        if (individual[i] ==row && i+1!=column)
            return true;
    }
    //kiểm tra đường chéo
    for (let i = 0; i < individual.length-1; i++) 
        for(let j=i+1; j<individual.length; j++)
            if (individual[i] != 0 && individual[j]!=0 && Math.abs(individual[i]-individual[j])==Math.abs(i-j))
                return true;
    return false;
}
function chooseQueen(square){
    var index_row = parseInt(square.dataset.row);
    var index_column = parseInt(square.dataset.column);
    console.log(index_row,index_column)
    console.log(getComputedStyle(square.firstChild).display)
    if (getComputedStyle(square.firstChild).display=="none"){
        square.firstChild.style.display = "inline";
        if (individual[index_column - 1]==0)
            individual[index_column - 1] = index_row;
        if(isContrains(index_row, index_column)==true){
            square.style.backgroundColor = "red";
        }
    }
    else{
        square.firstChild.style.display = "none";
        for(let i=0; i<individual.length; i++){
            if(individual[i]==index_row && i+1==index_column)
                individual[index_column - 1] = 0;
        }
        if(index_row%2!=0 && index_column%2!=0 || index_row%2==0 && index_column%2==0)
            square.style.backgroundColor = blue2;
        else square.style.backgroundColor = blue1;

    }
    if(goal(getFitness(individual))==true){
        alertWin(time);
    }
    console.log(individual)
    console.log(findBestindividual(individual, solutions))
}
function findBestindividual(individual1, solutions){
    var result=solutions[0];
    var max=-1;
    for(let i=0; i<solutions.length; i++){
        var count=0;
        for(let j=0; j<individual1.length; j++){
            if(individual1[j]== solutions[i][j])
                count++;
        }
        if(max< count){
            result=solutions[i];
            max = count;
        }
    }
    return result;
}