import {useCallback, useEffect, useState} from "react";

// componentes
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import End from './components/End';

// css
import './App.css';

// Dados
import {wordsList} from "./data/words";

const stages = [
  {id:1, name:'start'},
  {id:2, name:'game'},
  {id:3, name:'end'},
];

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);


  const [pickedWord ,setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters,setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);


  const pickWordAndCategory = useCallback(() => {
    // pegar categoria
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random()*Object.keys(categories).length)];

    // pegar palavra
    const word = words[category][Math.floor(Math.random()*words[category].length)];
    return {word, category}
  }, [words]);
  // starts 
  const startGame = useCallback(() => {
    clearLetterStates();

    // pegar letras e palavras
    const {word, category} = pickWordAndCategory();

    // palavrass em letras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // setar states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process the latter input
  const verifyLetter = (letter) => {
    // normalizando a letra
    const normalizedLetter = letter.toLowerCase();

    // checando se ja foi usada a letra
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return 
    }

    //colocando a letra acertada ou errada 
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter
      ]);
    }else{
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses -1)
    }
  }
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(() => {
    if(guesses <= 0){
      // resetar o jogo todo 
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  },[guesses])

  //verificar condição de vitória
  useEffect(() => {

    const uniqueLetters = [... new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore)=> actualScore += 100);
    
      startGame();
    }

  }, [guessedLetters, letters, startGame])

  // restarts the game
  const retry = () =>{
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  }


  return (
    <div className="App">
      { gameStage === 'start' && <StartScreen startGame={startGame}/> }
      { gameStage === 'game' && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score} /> }
      { gameStage === 'end' && <End retry={retry} score={score}/> }
    </div>
  );
}

export default App;
