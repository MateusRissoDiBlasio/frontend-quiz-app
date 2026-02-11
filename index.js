fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        createQuizzSubject(data);
        createQuizzQuestions(data);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

var actualindex = 0;
var correctsCount = 0;
var quizSelected = '';
var screenWidth = 0;

const header = document.querySelector('header');
const themeToggle = document.getElementById('themeToggle');
const quizMenu = document.getElementById('quizMenu');
const subjectsContainer = document.getElementById('subjectsContainer');
const quizQuestions = document.getElementById('quizQuestions');
const answersContainer = document.getElementById('answersContainer');
const resultContainer = document.getElementById('resultContainer');
const optionsLetters = ['A', 'B', 'C', 'D'];

function updateScreenWidth(){
    screenWidth = window.innerWidth;
        if(screenWidth < 1440 && quizMenu.style.display !== 'none'){
            quizMenu.style.display = 'initial';
        }else if(screenWidth > 1439 && quizMenu.style.display === 'initial'){
            quizMenu.style.display = 'flex';
        }
}

function createQuizzSubject(quizzesData) {
    quizzesData.quizzes.forEach(quiz => {
        const subjectBtn = document.createElement('button');
        subjectBtn.id = quiz.title;
        subjectsContainer.appendChild(subjectBtn);
        const subjectIcon = document.createElement('img');
        subjectIcon.src = quiz.icon;
        subjectIcon.id = quiz.title + 'Icon';
        subjectIcon.alt = quiz.title + 'Icon';
        subjectBtn.innerText = quiz.title;
        subjectBtn.prepend(subjectIcon);
    });    
}

function createQuizzQuestions(quizzesData){
    function reloadQuiz(){
        actualindex = -1;
        updateQuestion();
    }

    function firstStep(){
        window.addEventListener('resize', updateScreenWidth);
        const quizSubjectSelected = quizzesData.quizzes.find(quiz => quiz.title === quizSelected);    
        const questionsContainer = document.createElement('div');
        const questionNumber = document.createElement('p');
        const question = document.createElement('h1');
        questionNumber.innerText = 'Question ' + (actualindex + 1) + ' of '+ quizSubjectSelected.questions.length;
        question.innerText = quizSubjectSelected.questions[actualindex].question;
        questionNumber.id = 'questionNumber';
        question.id = 'question';
        
        const progressContainer = document.createElement('div');
        const progressBar = document.createElement('progress');
        progressBar.setAttribute('value', actualindex);
        progressBar.setAttribute('max', quizSubjectSelected.questions.length);
        progressContainer.appendChild(progressBar);
        progressContainer.id = 'progressContainer';
        questionsContainer.appendChild(questionNumber);
        questionsContainer.appendChild(question);
        quizQuestions.appendChild(questionsContainer);
        questionsContainer.appendChild(progressContainer);

        const answersContainer = document.getElementById('answersContainer');
        var o = 0;
        var l = 0
        quizSubjectSelected.questions[actualindex].options.forEach( option => {
            const optionsBtns = document.createElement('button');
            const optionLetter = document.createElement('h1');
            const optionText = document.createElement('span');
            optionLetter.innerText = optionsLetters[o++];
            optionText.innerText = option;
            optionText.id = 'Letter' + optionsLetters[l++];
            optionsBtns.prepend(optionLetter);
            optionsBtns.appendChild(optionText);
            answersContainer.appendChild(optionsBtns);
            optionsBtns.classList.add('optionsBtns');
        });
        
        const confirmAnswer = document.createElement('button');
        confirmAnswer.textContent = 'Submit Answer';
        confirmAnswer.classList.add('submitAnswer');
        answersContainer.appendChild(confirmAnswer);
        
        quizQuestions.classList.add('animateFadeIn');
        answersContainer.classList.add('animateFadeIn');

        const emptyAnswerErrorMsg = document.createElement('span');
        emptyAnswerErrorMsg.textContent = 'Please select an answer';
        emptyAnswerErrorMsg.classList.add('emptyAnswerErrorMsg');
        const emptyAnswerErrorMsgImg = document.createElement('img');
        emptyAnswerErrorMsgImg.src = './assets/images/icon-error.svg';
        answersContainer.appendChild(emptyAnswerErrorMsg);
        emptyAnswerErrorMsg.prepend(emptyAnswerErrorMsgImg);

        quizAnswers();
    }

    function clearOptions(){
        const correctIcon = document.getElementById('correctIcon');
        const incorrectIcon = document.getElementById('incorrectIcon');
        if(incorrectIcon !== null){
            incorrectIcon.remove();
        }
        if(correctIcon !== null){
            correctIcon.remove();
        }
        const submittedAnswer = document.querySelector('.answerSelected');
        submittedAnswer.classList.remove('answerCorrect', 'answerIncorrect');
        submittedAnswer.classList.remove('answerSelected');
    }

    function QuizAgain(){
        resultContainer.style.opacity = 1;
        resultContainer.classList.add('animateFadeOut');
        subjectSelected.classList.add('animateFadeOut');
        updateScreenWidth();
        setTimeout(() => {
            resultContainer.style.display = 'none';
            if(screenWidth < 1440){
                quizMenu.style.display = 'initial';
            }else{
                quizMenu.style.display = 'flex';
            }
            quizMenu.style.opacity = 0;
            quizMenu.classList.add('animateFadeIn');
            }, 300);
        actualindex = 0;
        correctsCount = 0;
        quizSelected = '';
    }

    function viewResults(){
        const quizSubjectSelected = quizzesData.quizzes.find(quiz => quiz.title === quizSelected); 
        if (resultContainer.style.display === 'none'){
            quizQuestions.classList.add('animateFadeOut');
            answersContainer.classList.add('animateFadeOut');
            setTimeout(() => {
                quizQuestions.style.display = 'none';
                answersContainer.style.display = 'none';
                resultContainer.classList.remove('animateFadeOut');
                resultContainer.style.opacity = 0;
                resultContainer.classList.add('animateFadeIn');
                if(screenWidth < 1440 && resultContainer.style.display === 'none'){
                    resultContainer.style.display = 'initial';
                }else if(screenWidth > 1439 && resultContainer.style.display === 'none'){
                    resultContainer.style.display = 'flex';
                }
            }, 300);
            const gradeContainer = document.getElementById('gradeContainer');
            const courseContainer = gradeContainer.querySelector('div');
            const courseSelectedIcon = courseContainer.querySelector('img');
            const courseSelectedText = courseContainer.querySelector('h1');

            const gradeScore = document.getElementById('gradeScore');
            gradeScore.textContent = correctsCount;
            courseSelectedIcon.id = quizSubjectSelected.title + 'CourseIcon';
            courseSelectedIcon.src = quizSubjectSelected.icon;
            courseSelectedText.innerText = quizSubjectSelected.title;
            gradeScore.innerText = correctsCount;
        }else{
            quizQuestions.classList.add('animateFadeOut');
            answersContainer.classList.add('animateFadeOut');

            setTimeout(() => {
                quizQuestions.style.display = 'none';
                answersContainer.style.display = 'none';
            }, 300);
            
            const resultContainerMsg = document.createElement('div');
            const completeMsg = document.createElement('h1');
            completeMsg.innerText = 'Quiz completed';
            const gradeMsg = document.createElement('h1');
            gradeMsg.innerText = 'You scored...';
            resultContainer.appendChild(resultContainerMsg)
            resultContainerMsg.appendChild(completeMsg);
            resultContainerMsg.appendChild(gradeMsg);
            
            const resultContainerGrade = document.createElement('div');
            const gradeContainer = document.createElement('div');
            gradeContainer.id = 'gradeContainer';
            const courseContainer = document.createElement('div');

            courseContainer.classList.add('courseContainer');
            const courseSelectedIcon = document.createElement('img');
            courseSelectedIcon.id = quizSubjectSelected.title + 'CourseIcon';
            courseSelectedIcon.src = quizSubjectSelected.icon;
            const courseSelectedText = document.createElement('h1');
            courseSelectedText.innerText = quizSubjectSelected.title;

            const gradeScore = document.createElement('h1');
            gradeScore.id = 'gradeScore';
            gradeScore.innerText = correctsCount;

            const courseTotalQuestions = document.createElement('p');
            courseTotalQuestions.id = 'courseTotalQuestions';
            courseTotalQuestions.innerText = 'out of ' + quizSubjectSelected.questions.length;

            const quizAgainBtn = document.createElement('button');
            quizAgainBtn.id = 'quizAgainBtn';
            quizAgainBtn.innerText = 'Play Again';

            courseContainer.appendChild(courseSelectedIcon);
            courseContainer.appendChild(courseSelectedText);
            gradeContainer.appendChild(courseContainer);
            gradeContainer.appendChild(gradeScore);
            gradeContainer.appendChild(courseTotalQuestions);
            resultContainerGrade.appendChild(gradeContainer);
            resultContainerGrade.appendChild(quizAgainBtn);
            resultContainer.appendChild(resultContainerGrade)
            resultContainer.style.opacity = 0;
            setTimeout(() => {   
                resultContainer.classList.add('animateFadeIn');
            }, 300);
            quizAgainBtn.addEventListener('click', () => {
                QuizAgain();
            })
        }
    }

    function updateQuestion(){
        updateScreenWidth();
        clearOptions();
        setTimeout(() => {
            question.classList.remove('animateFadeOut');
            questionNumber.classList.remove('animateFadeOut');
            answersContainer.classList.remove('animateFadeOut');
            question.classList.add('animateFadeIn');
            questionNumber.classList.add('animateFadeIn');
            answersContainer.classList.add('animateFadeIn');
        }, 100);
        const question = document.getElementById('question');
        const questionNumber = document.getElementById('questionNumber');      
        const quizSubjectSelected = quizzesData.quizzes.find(quiz => quiz.title === quizSelected);
        const preventclicks = document.querySelectorAll('.optionsBtns');
        preventclicks.forEach(item => {
            item.classList.remove('useless');
        })
        const confirmAnswer = document.querySelector('.submitAnswer');
        confirmAnswer.textContent = 'Submit Answer';
        actualindex = actualindex + 1;
        const progressBar = document.querySelector('progress');
        progressBar.setAttribute('value', actualindex);
        question.style.height = question.scrollHeight + 'px';
        question.innerText = quizSubjectSelected.questions[actualindex].question;
        var newHeight = '';
        if(screenWidth <= 375){
            if(question.textContent.length <= 32 ){
                newHeight = 24 + 'px';
            }
            if(question.textContent.length > 32 && question.textContent.length <= 64){
                newHeight = 48 + 'px';
            }
            if(question.textContent.length > 64 && question.textContent.length <= 90 ){
                newHeight = 72 + 'px';
            }
            if(question.textContent.length > 90 && question.textContent.length <= 120 ){
                newHeight = 96 + 'px';
            }
        }
        if(screenWidth > 375 && screenWidth <=768){
            if(question.textContent.length <= 32 ){
                newHeight = 43 + 'px';
            }
            if(question.textContent.length > 35 && question.textContent.length <= 72 ){
                newHeight = 86 + 'px';
            }
            if(question.textContent.length > 72 && question.textContent.length <= 104 ){
                newHeight = 129 + 'px';
            }
            if(question.textContent.length > 104 && question.textContent.length <= 120 ){
                newHeight = 172 + 'px';
            }
        }
        question.style.height = newHeight;
        questionNumber.innerText = 'Question ' + (actualindex + 1) + ' of '+ quizSubjectSelected.questions.length;
        const letterA = document.getElementById('LetterA');
        const letterB = document.getElementById('LetterB');
        const letterC = document.getElementById('LetterC');
        const letterD = document.getElementById('LetterD');

        letterA.textContent = quizSubjectSelected.questions[actualindex].options[0];
        letterB.textContent = quizSubjectSelected.questions[actualindex].options[1];
        letterC.textContent = quizSubjectSelected.questions[actualindex].options[2];
        letterD.textContent = quizSubjectSelected.questions[actualindex].options[3];
    }

    function quizAnswers(){
        var newHeight = '';
        if(screenWidth <= 375){
            if(question.textContent.length <= 32 ){
                newHeight = 24 + 'px';
            }
            if(question.textContent.length > 32 && question.textContent.length <= 64){
                newHeight = 48 + 'px';
            }
            if(question.textContent.length > 64 && question.textContent.length <= 90 ){
                newHeight = 72 + 'px';
            }
            if(question.textContent.length > 90 && question.textContent.length <= 120 ){
                newHeight = 96 + 'px';
            }
        }
        if(screenWidth > 375 && screenWidth <=768){
            if(question.textContent.length <= 32 ){
                newHeight = 43 + 'px';
            }
            if(question.textContent.length > 35 && question.textContent.length <= 72 ){
                newHeight = 86 + 'px';
            }
            if(question.textContent.length > 72 && question.textContent.length <= 104 ){
                newHeight = 129 + 'px';
            }
            if(question.textContent.length > 104 && question.textContent.length <= 120 ){
                newHeight = 172 + 'px';
            }
        }
        question.style.height = newHeight;
        const optionSelected = document.querySelectorAll('.optionsBtns');
        optionSelected.forEach(item =>{
            item.addEventListener('click', () => {
                document.querySelector('.answerSelected')?.classList.remove('answerSelected');
                item.classList.add('answerSelected');
            });
        })       
    }

    subjectsContainer.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        quizSelected = e.target.id;

        if(answersContainer.style.display === 'none'){
            quizMenu.style.opacity = 1;
            quizMenu.classList.add('animateFadeOut');
            setTimeout(() => {
                quizMenu.style.display = 'none';
                quizQuestions.classList.remove('animateFadeOut');
                quizQuestions.classList.add('animateFadeIn');
                quizQuestions.style.display = 'flex';
                answersContainer.classList.remove('animateFadeOut');
                answersContainer.classList.add('animateFadeIn');    
                answersContainer.style.display = 'flex';
            }, 300);

            const subjectSelected = document.getElementById('subjectSelected');
            const subjectSelectedIcon = subjectSelected.querySelector('img');
            const subjectSelectedText = subjectSelected.querySelector('p');
            subjectSelectedIcon.src = e.target.children[0].src;
            subjectSelectedText.innerText = e.target.id;
            subjectSelectedIcon.id = e.target.id + 'IconSubject';
            setTimeout(() => {
                subjectSelected.classList.remove('animateFadeOut');
                subjectSelected.classList.add('animateFadeIn');
            }, 300);            
        }else{
            quizMenu.classList.add('animateFadeOut');
            setTimeout(() => {
                quizMenu.style.display = 'none';  
            }, 300);

            const subjectSelected = document.createElement('div');
            subjectSelected.classList.add('animateFadeIn');
            subjectSelected.classList.add('subjectHeader');
            subjectSelected.id = 'subjectSelected';
            const subjectSelectedIcon = document.createElement('img');
            subjectSelectedIcon.src = e.target.children[0].src;
            const subjectSelectedText = document.createElement('p');
            subjectSelectedText.innerText = e.target.id;
            subjectSelectedIcon.id = e.target.id + 'IconSubject';
            subjectSelected.appendChild(subjectSelectedIcon);
            subjectSelected.appendChild(subjectSelectedText);
            header.prepend(subjectSelected);
            header.style.justifyContent = 'space-between';
        }
        if(quizQuestions.children.length === 0){
            firstStep();
        }else{
            reloadQuiz();
        }
    });
    
    answersContainer.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const answersContainer = document.getElementById('answersContainer');
        const correctIcon = document.createElement('img');
        correctIcon.src = './assets/images/icon-correct.svg';
        correctIcon.id = 'correctIcon';
        const incorrectIcon = document.createElement('img');
        incorrectIcon.src = './assets/images/icon-incorrect.svg';
        incorrectIcon.id = 'incorrectIcon';
        
        const preventclicks = document.querySelectorAll('.optionsBtns');
        const emptyAnswerErrorMsg = document.querySelector('.emptyAnswerErrorMsg');
        if(e.target && e.target.className === 'submitAnswer'){
            const quizSubjectSelected = quizzesData.quizzes.find(quiz => quiz.title === quizSelected);
            const submittedAnswer = document.querySelector('.answerSelected');
            if(submittedAnswer === null){
                emptyAnswerErrorMsg.classList.remove('animateErrorPulse');
                emptyAnswerErrorMsg.style.opacity = 0;
                setTimeout(() => {
                    emptyAnswerErrorMsg.classList.add('animateErrorPulse');
                }, 100);
            }
            if (submittedAnswer !== null && e.target.textContent !== 'Next Question' && e.target.textContent !== 'Check your result') {
                emptyAnswerErrorMsg.classList.remove('animateErrorPulse');
                emptyAnswerErrorMsg.style.opacity = 0;
                if(actualindex < (quizSubjectSelected.questions.length - 1)){
                    e.target.textContent = 'Next Question';
                }
                if(actualindex === (quizSubjectSelected.questions.length - 1)){
                    e.target.textContent = 'Check your result';
                    quizMenu.classList.remove('animateFadeIn', 'animateFadeOut');
                    quizQuestions.classList.remove('animateFadeIn', 'animateFadeOut');
                    answersContainer.classList.remove('animateFadeIn', 'animateFadeOut');
                    resultContainer.classList.remove('animateFadeIn');
                    const progressContainer = document.getElementById('progressContainer');
                    const progressBar = progressContainer.querySelector('progress');
                    progressBar.value = progressBar.value + 1;
                }
                preventclicks.forEach(item => {
                    item.classList.add('useless');
                })
                const optionsBtnsContainer = document.getElementById('answersContainer');
                const optionsBtns = optionsBtnsContainer.children;
                let correctAnswer = '';         
                for(let c = 0; c <= 3; c++){
                    var correctAnswerAdjust = optionsBtns[c].innerText.slice(2);
                    if(correctAnswerAdjust === quizSubjectSelected.questions[actualindex].answer){
                        correctAnswer = optionsBtns[c];
                        correctAnswer.appendChild(correctIcon);
                        correctIcon.classList.add('animateFadeIn');
                    }
                }            
                if(submittedAnswer.textContent.slice(1) === quizSubjectSelected.questions[actualindex].answer){
                    submittedAnswer.classList.add('answerCorrect');
                    submittedAnswer.appendChild(correctIcon);
                    correctsCount = correctsCount + 1;
                }else{
                    submittedAnswer.classList.add('answerIncorrect');
                    submittedAnswer.appendChild(incorrectIcon);
                }
            }else if(e.target.textContent === 'Next Question' && actualindex < (quizSubjectSelected.questions.length - 1)){
                const question = document.getElementById('question');
                question.classList.add('animateFadeOut');
                const questionNumber = document.getElementById('questionNumber');
                questionNumber.classList.add('animateFadeOut');
                answersContainer.classList.add('animateFadeOut');
                setTimeout(() => {
                    updateQuestion();
                }, 500);
            }else if(e.target.textContent === 'Check your result'){
                viewResults();
            }
        }
    });      

    themeToggle.addEventListener('click', (e) => {
        const appBody = document.querySelector('body');
        appBody.classList.toggle('darkTheme');
        const sunDark = document.getElementById('sunDark');
        const moonDark = document.getElementById('moonDark');
        if(appBody.classList.contains('darkTheme')){
            sunDark.src = './assets/images/icon-sun-light.svg';
            moonDark.src = './assets/images/icon-moon-light.svg';
        }else{
            sunDark.src = './assets/images/icon-sun-dark.svg';
            moonDark.src = './assets/images/icon-moon-dark.svg';
        }
    })
}