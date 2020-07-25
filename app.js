const UIexpression = document.getElementById('expression');
const UIprogress = document.getElementById('progress');
const UIgame = document.getElementById('game-field');
const UIscore = document.getElementById('score');
const UIlose = document.getElementById('lose');
document.addEventListener('DOMContentLoaded', startGame);

const state = {
    expression: "",
    operation: "",
    operations: ['+', '-'],
    min: -100,
    max: 100,
    a: 0,
    b: 0,
    answer: 0,
    user_answer: 0,
    score: 0,
    bestScore: 0,
    timerId: undefined,
    update: function(isRight = false) {
        if (isRight) {
            this.score++;
            if (this.score > 5) {
                this.min = -150;
                this.max = 150;
            }
            if (this.score > 10) {
                this.min = -200;
                this.max = 200;
            }
            if (this.score > 15) {
                this.min = -250;
                this.max = 250;
            }
            if (this.score > 20) {
                this.min = -300;
                this.max = 300;
            }
            if (this.score > 25) {
                this.min = -500;
                this.max = 500;
            }
        } else {
            this.score = 0;
            this.min = -100;
            this.max = 100;
        }
        this.a = random_number(this.min, this.max);
        this.b = random_number(this.min, this.max);
        this.operation = this.operations[random_number(0, this.operation.length - 1)];
        this.expression = this.a + ' ' + this.operation + ' ' + this.b;
        this.answer = eval(this.expression);
        display();
        startProgressBar();
    }
}

function startGame() {
    state.update();
    UIgame.addEventListener('click', checkUserAnswer);
}

function random_number(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function display() {
    for (let i = 0; i < UIgame.children.length; i++)
        UIgame.children[i].textContent = random_number(state.min, state.max);
    UIgame.children[random_number(0, UIgame.children.length - 1)].textContent = state.answer;
    UIexpression.textContent = state.expression;
    UIscore.textContent = state.score;
}

function setBestScore() {
    if (localStorage.getItem('bestScore') == null) {
        state.bestScore = state.score;
    } else {
        state.bestScore = JSON.parse(localStorage.getItem('bestScore'));
        if (state.bestScore < state.score)
            state.bestScore = state.score;
    }
    localStorage.setItem('bestScore', JSON.stringify(state.bestScore));
}

function checkUserAnswer(e) {
    if (e.target.classList.contains('number')) {
        let value = Number(e.target.textContent);
        if (value == state.answer) state.update(true); 
        else lose();
    }
}

function lose() {
    setBestScore();
    UIlose.style.display = 'flex';
    document.getElementById('end-score').textContent = state.score; 
    document.getElementById('best-score').textContent = state.bestScore;
    document.getElementById('reset').addEventListener('click', function() {
        state.update();
        UIlose.style.display = 'none';
    });
}

function startProgressBar() {
    clearInterval(this.timerId);
    UIprogress.style.width = '100%';
    let value = 100;
    const delay = 1000;
    this.timerId = setInterval(function reduceProgressBar() {
        if (value > 0) {
            value -= 10;
            UIprogress.style.width = value + '%';
        } 
        else {
            clearInterval(this.timerId);
            lose();
        }
    }, delay);
}