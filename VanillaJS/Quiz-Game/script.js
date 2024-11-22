"use strict"
import {utils, QuestionLabelHandler, TimerComponent, ProgressBar, getQuizAnswerFragment, getDataProvider} from './helper.js';

const cssSelectors = {
    container: '.container',
    quizSection: '.js-quiz-section',
    question: '.js-question-label',
    timer: '.js-timer',
    progress: 'header',
    nxtButton: '.js-btn-nxt'
}

class QuizGameHeader {
    constructor(containerEl, selectors, noOfQuestions, timeoutSecs) {
        utils.validation.quizGameHeader(containerEl, selectors);
        this.containerEl = containerEl;
        this.selectors = selectors;
        this.totalQuestions = noOfQuestions;        
        this.timeoutSecs = timeoutSecs;
        this.render();
    }     
    render() {
        const questionLabelEl = this.containerEl.querySelector(this.selectors.question);
        this.questionLabelHandler = new QuestionLabelHandler(questionLabelEl, this.totalQuestions);
        const timerEl = this.containerEl.querySelector(this.selectors.timer);
        this.timer = new TimerComponent(timerEl, this.timeoutSecs);
        const progressBarContainerEl = document.querySelector(this.selectors.progress);
        this.progressBar = new ProgressBar(progressBarContainerEl,10);                
        this.updateState = this.updateState.bind(this);              
    }
    startTimer() {
        this.timer.start();
    }
    stopTimer() {
        this.timer.stop();
    }
    addTimerCallBackFn(func) {
        this.timer.addNotifier(func);
    }
    updateState() {
        this.questionLabelHandler.nextUpdateEl();
        this.progressBar.goToNextStep();
        this.timer.restart();
    }
}


class QuizLayout{
    constructor(containerEl, question, answersList, rightAnswer) {
        this.containerEl = containerEl;
        this.questionTxt = question;
        this.answersList = answersList;
        this.rightAnswer = rightAnswer;        
        this.render();
    }
    getQuestionEl() {
        const questionEl = document.createElement('div');
        questionEl.textContent = this.questionTxt;
        questionEl.classList.add('question-txt');
        return questionEl;
    }    
    render() {                
        if(this.answersList.length === 0) return;
        const docFragment = document.createDocumentFragment();
        const questionEl = this.getQuestionEl();
        docFragment.append(questionEl);

        this.answersList.forEach(answer => {
            const answerFragment = getQuizAnswerFragment(answer);
            if(this.rightAnswer === answer) this.righAnswerEl = answerFragment;
            docFragment.append(answerFragment);
        });     
        this.containerEl.innerHTML = '';
        this.containerEl.append(docFragment);
    }
    validateAndShowAnswer(answerEl) {
        this.righAnswerEl.classList.add('right');
        if(this.righAnswerEl !== answerEl) {
            console.warn('Answer selected did NOT match');
            answerEl.classList.add('wrong');
        }        
    }
    disableOptions() {
        const elems = Array.from(this.containerEl.children);
        elems.forEach(elem => elem.classList.add('done'))
    }

}


class QuizManager {
    constructor(containerEl, selectors, questionsCount, timeoutInSecs) {
        this.containerEl = containerEl;
        this.selectors = selectors;
        this.questionsCount = questionsCount;
        this.timeoutInSecs = timeoutInSecs;        
        this.quizLayoutSection = this.containerEl.querySelector(this.selectors.quizSection);
        this.nextQuizBtn = this.containerEl.querySelector(this.selectors.nxtButton);
        this.execute = this.execute.bind(this);
        this.loadDataPromise = this.loadData();                
    } 
    async loadData() {        
        this.dataProvider = await getDataProvider();                        
    } 
    async start() {                
        await this.loadDataPromise;
        this.quizGameHeader = new QuizGameHeader(this.containerEl, this.selectors, this.questionsCount, this.timeoutInSecs); 
        this.currentQuestionNumber = 1;                
        this.quizGameHeader.addTimerCallBackFn(this.execute);      
        this.quizGameHeader.startTimer();
        this.doNxtQuizLayout();
        this.enableLayoutListener();
    }
    doNxtQuizLayout() {        
        const data = this.dataProvider.getNextData(); 
        this.quizLayout = new QuizLayout(this.quizLayoutSection,data.question,data.options,data.correct);        
    }
    execute() {
        if(this.currentQuestionNumber >= this.questionsCount)  {
            console.log('All questions are done');
            return;
        }
        this.doNxtQuizLayout();
        this.currentQuestionNumber++;
        this.quizGameHeader.updateState();
    }
    enableLayoutListener() {
        this.quizLayoutSection.addEventListener('click', (event) => {
            if(event.target?.tagName !== 'P' || event.target.classList.contains('done')) return;
            console.log('answer clicked, stopping the timer');        
            this.quizGameHeader.stopTimer();    
            this.quizLayout.validateAndShowAnswer(event.target);
            this.quizLayout.disableOptions()
        });

        this.nextQuizBtn.addEventListener('click', _ => this.execute());
    }
}

const questionsCount = 10
const timeoutInSecs = 4;
const containerEl = document.querySelector(cssSelectors.container);

const quizManager = new QuizManager(containerEl, cssSelectors, questionsCount, timeoutInSecs);
quizManager.start();
