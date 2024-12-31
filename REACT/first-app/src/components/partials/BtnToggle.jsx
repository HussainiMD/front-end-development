
const handleToggle = event => {
  const ballElem = event.target.firstElementChild;
  ballElem.classList.toggle('toggle-animate');
}

export default BtnToggle = ({color}) => (
    <div class="toggle" onClick={handleToggle}>
        <div class="ball" style={{'background-color' : color}} />
    </div>
) 
