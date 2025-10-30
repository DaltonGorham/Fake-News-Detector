import './styles.css'

const Loading = ({ inline = false }) => {
  return (
    <div className={inline ? "loading-container-inline" : "loading-container"}>
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading</div>
    </div>
  )
}

export default Loading