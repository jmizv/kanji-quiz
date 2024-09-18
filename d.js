current = { index: 0, question: 0, correct: 0, wrong: 0, selected: -1 };
notShown = [];
answers = {};

function initNotShown() {
  notShown = Array.from({ length: kanjidata.length }, (_, i) => i);
  shuffleArray(notShown);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getNextRandomQuestionIndex() {
  if (current.index >= notShown.length) {
    current.index = 0;
    initNotShown();
  }

  return notShown[current.index];
}

function getRandom(answers) {
  let randomValue;
  do {
    randomValue = Math.floor(Math.random() * kanjidata.length);
  } while (answers.some((item) => item.index === randomValue));
  return randomValue;
}

function generateQuestion() {
  current.selected = -1;
  current.question = getNextRandomQuestionIndex();
  correctAnswer = {
    index: current.question,
    answer: kanjidata[current.question].meanings,
    type: kanjidata[current.question].type,
    correct: true,
  };
  answers = [correctAnswer];

  for (i = 1; i < 4; ++i) {
    rnd = getRandom(answers);
    answers[i] = {
      index: rnd,
      answer: kanjidata[rnd].meanings,
      type: kanjidata[rnd].type,
      correct: false,
    };
  }

  shuffleArray(answers);
  const children = $("#solutions").children();
  for (i = 0; i < children.length; ++i) {
    children[i].innerHTML = `${i + 1}) ${answers[i].answer}`;
    answers[i].index = i;
  }
  displayQuestion();
}

function checkAnswer() {
  selected = current.selected;
  if (selected < 0) {
    return;
  }
  correctIndex = answers.filter((a) => a.correct).at(0).index;
  addedClass = "";
  if (selected === correctIndex) {
    ++current.correct;
  } else {
    ++current.wrong;
    notShown.push(notShown[current.index]);
  }
  ++current.index;

  updateExplanation(selected === correctIndex);
  addedClass = selected === correctIndex ? "correct" : "wrong";

  document.getElementById("check").classList.remove("white-bg");
  document.getElementById("check").classList.add(addedClass);
  setTimeout(function () {
    document.getElementById("check").classList.add("white-bg");
    document.getElementById("check").classList.remove(addedClass);
  }, 500);

  document.getElementsByTagName("body").item(0).classList.remove("white-bg");
  document.getElementsByTagName("body").item(0).classList.add(addedClass);
  setTimeout(function () {
    document.getElementsByTagName("body").item(0).classList.add("white-bg");
    document.getElementsByTagName("body").item(0).classList.remove(addedClass);
  }, 500);

  updateScore();
  clearSelection();
  generateQuestion();
}

function displayQuestion() {
  $("#question").html(`What does this <b>${correctAnswer.type}</b> mean?`);
  const character = `${kanjidata[current.question].character}`;
  $("#character-smaller").html(character);
  $("#character-bigger").html(character);
  $("#character-normal").html(character);
}

function updateExplanation(correct) {
  const emoji = correct ? "✅" : "⚠️";
  const prefix = correct ? emoji + " Yes" : emoji + " No";
  $("#explanation").html(
    `${prefix}, ${kanjidata[current.question].character} means ${
      kanjidata[current.question].meanings
    }.`
  );
  let textForHistory;
  if (correct) {
    textForHistory = `${prefix}, ${
      kanjidata[current.question].character
    } means ${kanjidata[current.question].meanings}.`;
  } else {
    textForHistory = `${prefix}, let's try ${
      kanjidata[current.question].character
    } later again.`;
  }
  $("#history-list").append($("<li>").text(textForHistory));
}

function updateScore() {
  $("#score").html(
    `${current.correct + current.wrong} questions: ${
      current.correct
    } correct, ${current.wrong} wrong.`
  );
}

function clearSelection() {
  $("#solutions div").each((index, elem) => {
    $(elem).attr("style", "");
  });
}
