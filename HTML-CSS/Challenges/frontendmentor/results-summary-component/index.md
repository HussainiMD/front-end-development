<head>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.4.2/css/all.css">
  <style>
    body {
  	background-color: hsl(0, 0%, 94%);  
}

.text-pure-white {
  color: hsl(0, 100%, 100%);
}

.section-orange {
  background-color: hsl(12, 100%, 98%);  
}

.section-orange > i {
    color: 	#ffb7b7;;
  }

.section-orange > span {
    color: 	hsl(6, 61%, 78%);
  }

.section-yellow {
  background-color : 		hsl(47, 100%, 97%);
}

.section-yellow > i {
  color: #dddd00;
}

.section-yellow > span {
  color: 	hsl(45, 62%, 71%);
}

.section-green {
  background-color: hsl(173, 53%, 97%);
}

.section-green > i {
  color: #008080;
}

.section-green > span {
  color: hsl(163, 43%, 63%);
}

.section-blue {
  background-color: hsl(240, 100%, 98%);
}

.section-blue > i {
  color: #00004d;
}

.section-blue > span {
  color: hsl(232, 91%, 78%);
}

.component-container-result {
  background-color: hsl(250, 97%, 62%);
  color: hsl(251, 90%, 79%);
  padding: 0.5em 0;
  text-align: center;
  border-radius: 0 0 2em 2em;
}

.component-container-result > div {  
  max-width: 90%;
  margin: auto;
}

.component-container-result-score-area {
  background-color: hsl(253, 70%, 47%);
  width: fit-content;
  padding: 1em;  
  border-radius: 50%;
  margin: auto;  
}

.component-container-result-score-area > h2 {
  margin: 0;
}


.component-container-summary {
  background-color: hsl(0, 100%, 100%);
  padding: 3em 2em 0 2em;
  margin-top: -1em;
  position: relative;
  z-index: -1;
}

.component-container-summary-point {
  margin-bottom: 1em;
  border-radius: 0.5em;
  display: flex;
  gap: 1em;
}

.component-container-summary-point > * {
  padding: 0.5em;
}

.component-container-summary-point > span {
  flex-grow: 1;
}

.component-action-continue {
  background-color: #303B5A;
  color: #989EAE;
  max-width: 30ch;
  width: 90%;
  display: block;
  margin: auto;
  line-height: 2;
  padding: 0 0;
  font-weight: 700;
  
  border-radius: 2em;
}

@media only screen and (min-width: 700px) {  
  
  .component-container {
    display: flex;
    justify-content: center;
    align-content: center;    
  }
  
  .component-container-result {
    border-radius: 2em;
    width: fit-content;    
  }
  
  .component-container-summary {
    border-radius: 0 0 2em 2em;
    padding-left: 3em;
    padding-top: revert;
    margin-top: revert;
    margin-left: -1em;
    width: fit-content;
  }
  
}
  </style>
</head>
<body>
  <main class="component-container">
    <section class="component-container-result">
      <div>
        <h4>Your Result</h4>
        <div class="component-container-result-score-area">
          <h2 class="text-pure-white">76</h2><span>of 100</span>
        </div>
        <h3 class="component-container-result-score-grade text-pure-white">Great</h3>
        <p>You scored higher than 65% of the people who have taken these tests</p>
      </div>
    </section>
    <section class="component-container-summary">
      <h3>Summary</h3>
      <div class="component-container-summary-point section-orange">
        <i class="fa-solid fa-bolt" ></i>
        <span>Reaction</span>
        <div class="component-container-summary-point-score">
          <span>80</span> <span>/ 100</span>
        </div>
      </div>
      <div class="component-container-summary-point section-yellow">
        <i class="fa-regular fa-clock" style="color: "></i>
        <span>Memory</span>
        <div class="component-container-summary-point-score">
          <span>92</span> <span>/ 100</span>
        </div>
      </div>
      <div class="component-container-summary-point section-green">
        <i class="fa-regular fa-comment-dots" ></i>
        <span>Verbal</span>
        <div class="component-container-summary-point-score">
          <span>61</span> <span>/ 100</span>
        </div>
      </div>
      <div class="component-container-summary-point section-blue">
        <i class="fa-regular fa-eye"></i>
        <span>Visual</span>
        <div class="component-container-summary-point-score">
          <span>72</span> <span>/ 100</span>
        </div>
      </div>
      <button class="component-action-continue">Continue</button>
    </section>
  </main>
  
</body>
