const html = ` <div class="container">
    <div class="heading">
      <h1 class="title">2048</h1>
      <div class="scores-container">
        <div class="score-container">0</div>
        <div class="best-container">0</div>
      </div>
    </div>
    <div class="above-game">
      <p class="game-intro">Join the numbers and get to the <strong id= "intro">2048 tile!</strong></p>
      <a class="restart-button">New Game</a>
    </div>

    <div class="game-container">
      <div class="game-message">
        <p></p>
        <div class="lower">
	        <a class="keep-playing-button">Keep going</a>
          <a class="retry-button">Try again</a>
        </div>
      </div>

      <div class="grid-container">
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
      </div>

      <div class="tile-container">

      </div>
    </div>

    <details id="settingsExpandable">
      <summary>Game Settings</summary>
      <div id="scoreSliderContainer">
      <p>Tile Goal: <span id="rangeValue"></span></p>
        <fieldset class="range__field">
          <input class="range" type="range" width="100%" min="0" max="9" id="rangeInput">
          <svg width="100%" height="20">
            <rect x="0%" y="3" width="1" height="10"></rect>
            <rect x="11%" y="3" width="1" height="10"></rect>
            <rect x="22%" y="3" width="1" height="10"></rect>
            <rect x="33%" y="3" width="1" height="10"></rect>
            <rect x="44%" y="3" width="1" height="10"></rect>
            <rect x="55%" y="3" width="1" height="10"></rect>
            <rect x="66%" y="3" width="1" height="10"></rect>
            <rect x="77%" y="3" width="1" height="10"></rect>
            <rect x="88%" y="3" width="1" height="10"></rect>
            <rect x="99%" y="3" width="1" height="10"></rect>
          </svg>
        </fieldset></div>
    </details>

    <p class="game-explanation">
      <strong class="important">How to play:</strong> Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>
    </p>
    <hr>
    <p>
    <strong class="important">Note:</strong> This site is the official version of 2048. You can play it on your phone via <a href="http://git.io/2048">http://git.io/2048.</a> All other apps or sites are derivatives or fakes, and should be used with caution.
    </p>
    <hr>
    <p>
    Created by <a href="http://gabrielecirulli.com" target="_blank">Gabriele Cirulli.</a> Based on <a href="https://itunes.apple.com/us/app/1024!/id823499224" target="_blank">1024 by Veewo Studio</a> and conceptually similar to <a href="http://asherv.com/threes/" target="_blank">Threes by Asher Vollmer.</a>
    </p>
  </div>`;


module.exports = html;