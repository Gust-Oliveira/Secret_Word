import styles from "./End.module.css"

const end = ({retry, score}) => {
  return (
    <div>
        <h2>Fim do jogo</h2>
        <h2>A sua pontuação foi: <span>{score}</span></h2>
        <button onClick={retry}>Reiniciar jogo</button>
    </div>
  )
}

export default end