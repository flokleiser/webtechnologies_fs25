/* :root {
    --primary-color: #000000;
    --bg-primary: #222222;
    --bg-secondary: #ffffff;
    --bg-secondary-two: #e3e3e3;
    --text-color: #222222;
    --text-color-two: #ffffff;
    --card-text: #000000;
    --shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
    --shadow-hover: 0 10px 30px rgba(0, 0, 0, 0.4);
    --weight-small: 400;
    --weight-semibold: 600;
    --weight-bold: 800;
    --width-small: 600px;
    --width-medium: 1100px;
    --width-large: 1300px;

    --bg-button: rgba(255, 255, 255, 0.3);
    --backdrop-blur: blur(20px);

}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: system-ui, sans-serif;
}

.unselectable {
  pointer-events: none;
}

body {
    background-color: var(--bg-primary);
    height:100vh;
    transition: opacity 300ms ease;

}

body.hidden {
    opacity: 0;
    transition: opacity 300ms ease; 
}

p {
    margin-bottom: 90px;
}

a {
    text-decoration: none;
    color: var(--primary-color);
}

.main-image {
    width: 100%;
    height:100%;
    display: flex;
    justify-content: center;
    border-radius: 20px;
    object-fit: cover;
}

h1 {
    padding-left: 1.5rem;;
}

.cardContainer{
    margin: 0 auto 0 auto;

    width: fit-content; 

    transform-style: preserve-3d;
    transition-duration: 300ms;
    transition-property: transform, box-shadow, scale;
    transition-timing-function: ease-out;
}

.cardContainer:hover {
    transition-duration: 150ms;
}

.content {
    position:relative;
    z-index:1;
    transition: transform 300ms ease;
}

.contentBottom {
    position:relative;
    z-index:1;
    transition: all 300ms ease;
}

.cardContainer:hover .content{
    transform: translate(-50%, -30%) translateZ(12px);
    transition: transform 300ms ease, 
}

.cardContainer:hover .contentBottom{
    transform: translate(-50%, -60%) translateZ(12px);
    transition: all 300ms ease;
}

.card-front {
    height:100%;
    width:100%;
}

.card {
    width: 450px;
    height: 700px;
    scale:1;
    background-color: var(--bg-secondary);
    color: var(--card-text);
    border-radius: 20px;
    box-shadow: var(--shadow);
    transition-duration: 300ms;
    transition-property: transform, box-shadow, scale;
    transition-timing-function: ease-out;

    display:flex;
    align-items: center;
    justify-content: center;
}


.card:hover {
    box-shadow: var(--shadow-hover);
    transition-duration: 150ms;
}

.cardHeader {
    width: 430px;
    height: 150px;
    left:50%;
    padding:20px;
    z-index: 1;
    transform: translate(-50%, -20%);

    display: flex;
    position:absolute;
    border-radius: 20px;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg-button);
    backdrop-filter: var(--backdrop-blur);

    box-shadow: var(--shadow);

    transition: box-shadow 250ms ease, transform 250ms ease;
}

.cardHeader:hover {
    box-shadow: var(--shadow-hover);
    transition-duration: 250ms;
}

.cardFooter:hover .ingredient-box {
    width: calc(100% / 6);
    height: 100%; 
    flex-grow: 1; 
    flex-basis: auto;
    transition: width 300ms ease, height 300ms ease, background-color 300ms ease;
}

.cardFooter:hover .ingredient-measure {
    opacity: 1;
    transition: opacity 300ms ease;
}

.cardFooter:hover {
    transition: all 300ms ease;
}


.cardFooter{
    width: 430px;
    height: 150px;
    left:50%;
    transform: translate(-50%, -70%);
    padding:20px;
    z-index: 1;

    display: flex;
    position:absolute;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    box-shadow: var(--shadow);
    background-color: var(--bg-button);
    backdrop-filter: var(--backdrop-blur);

    overflow: hidden;

    transition: box-shadow 250ms ease, transform 250ms ease;
}

.button1,
.button2 {
    position: absolute;
    padding: 10px 10px;
    border-radius: 5px;
    margin: 10px;

    background-color: var(--bg-button);
    backdrop-filter: var(--backdrop-blur);

    color: var(--card-text);
    border:none;
    font-weight: var(--weight-semibold);

    transition-duration: 300ms;
    transition-property: box-shadow;
    transition-timing-function: ease-out;
}

.button1:hover,
.button2:hover {
    box-shadow: var(--shadow);
    transition-duration: 150ms;
    cursor:pointer;
}


.buttonContainer1,
.buttonContainer2 {
    height:55px;
    width:120px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 15px;
    box-shadow: none;

    background-color: transparent;

    overflow: hidden; 
}

.buttonContainer3,
.buttonContainer4 {
    height:120px;
    width:120px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 15px;
    box-shadow: none;

    overflow: hidden; 
}


.buttonContainer1:hover,
.buttonContainer2:hover,
.buttonContainer3:hover,
.buttonContainer4:hover {
    background-color: var(--hover-color),
}

.buttonContainer1:active,
.buttonContainer2:active,
.buttonContainer3:active,
.buttonContainer4:active {
    background-color: var(--hover-color);
    scale: 1.05;
    transition: scale 100ms ease;
}


.buttonReload {
    color: var(--card-text);
    border:none;
    font-weight: var(--weight-semibold);

    height:100%;
    width:100%;

    background-color: transparent;

    display: flex;
    align-items: center;
    justify-content: center;

    transition-duration: 300ms;
    transition-property: transform;
    transition-timing-function: ease;
}

.buttonReload:hover {
    transform:rotate(80deg) scale(1.2);
    cursor:pointer;
    transition: transform 300ms ease;
}


.ingredients-section {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    gap: 6px;
    width: 100%;

    height:120px;
    overflow-x: hidden;
    overflow-y: hidden;
    padding: 5px;

    transition: width 300ms ease, background-color 300ms ease;
}


.ingredient-box {
    height:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 12px;

    cursor: pointer;

    transition: all 300ms ease;
}

.ingredient-box:hover {
    background-color: var(--bg-secondary-two)
}

.ingredient-image {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 10px;
}

.ingredient-name {
    font-size: 10px;
    font-weight: var(--weight-semibold);
    text-align: center;
    color: var(--card-text);
    line-height: 1.2;
    margin-bottom: 2px;
    word-wrap: break-word;
    max-width: 100%;
}

.ingredient-measure {
    font-size: 8px;
    color: var(--card-text);
    opacity: 0.7;
    text-align: center;
    font-weight: var(--weight-small);
    line-height: 1.1;

    opacity: 0;
    transition: opacity 300ms ease;
} */


____________________________________________________________________-

:root {
    --primary-color: #000000;
    --bg-primary: #333333;
    --bg-secondary: #ffffff;
    --text-color: #222222;
    --text-color-two: #ffffff;
    --card-text: #000000;
    --shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
    --shadow-hover: 0 10px 30px rgba(0, 0, 0, 0.4);
    --weight-small: 400;
    --weight-semibold: 600;
    --weight-bold: 800;
    --width-small: 600px;
    --width-medium: 1100px;
    --width-large: 1300px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: system-ui, sans-serif;
}

#loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.5s ease;
}

#loading-screen.fade-out {
  opacity: 0;
  pointer-events: none;
}

.card, .colorSection, .cardHeader, .cardFooter .buttonContainer1, .buttonContainer2, .buttonContainer3, .buttonContainer4 {
    transition: background-color 0.2s ease;
}

.unselectable {
  pointer-events: none;
}

body {
    /* margin:0;
    padding:0; */
    background-color: var(--bg-primary);
    height:100vh;
    /* height:100%; */
    transition: opacity 300ms ease;

}

body.hidden {
    opacity: 0;
    transition: opacity 300ms ease; 
}

p {
    margin-bottom: 90px;
}

a {
    text-decoration: none;
    color: var(--primary-color);
}

.main-image {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
}

.colorSection {
    height: 140px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.colorSectionName {
    opacity:0;
    height: 140px;
    transition: opacity 300ms ease;
}

.visible{
    height: 140px;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    margin-left: 1.5rem;
    opacity:1;

    transition: opacity 300ms ease;
}


.divider {
    width: 100%;
    height: 2px;
    padding: 0;
    background-color: var(--card-background);
}

h1 {
    padding-left: 1.5rem;;
}

.cardContainer{

    margin: 0 auto 0 auto;

    width: fit-content; 

    transform-style: preserve-3d;
    transition-duration: 300ms;
    transition-property: transform, box-shadow, scale;
    transition-timing-function: ease-out;
}

.cardContainer:hover {
    transition-duration: 150ms;
}

.content {
    position:relative;
    z-index:1;
    transition: transform 300ms ease;
}

.contentBottom {
    position:relative;
    z-index:1;
    transition: transform 300ms ease;
}

.cardContainer:hover .content{
    transform: translate(-50%, -20%) translateZ(12px);
    transition: transform 300ms ease, 
}

.cardContainer:hover .contentBottom{
    transform: translate(-50%, -70%) translateZ(12px);
    transition: transform 300ms ease, 
}

.card-front {
    width:100%
}

.card {
    width: 450px;
    height: 700px;
    padding-top:3%;
    scale:1;
    background-color: var(--bg-secondary);
    color: var(--card-text);
    border-radius: 20px;
    box-shadow: var(--shadow);
    transition-duration: 300ms;
    transition-property: transform, box-shadow, scale;
    transition-timing-function: ease-out;

    display:flex;
    align-items: center;
    justify-content: center;
}


.card:hover {
    box-shadow: var(--shadow-hover);
    transition-duration: 150ms;
}

.cardHeader {
    width: 430px;
    height: 150px;
    left:50%;
    padding:20px;
    z-index: 1;
    transform: translate(-50%, -20%);

    display: flex;
    position:absolute;
    border-radius: 20px;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg-secondary);
    box-shadow: var(--shadow);

    transition: box-shadow 250ms ease, transform 250ms ease;
}

.cardHeader:hover, 
.cardFooter:hover {
    box-shadow: var(--shadow-hover);
    transition-duration: 250ms;
}


.cardFooter{
    width: 430px;
    height: 150px;
    left:50%;
    transform: translate(-50%, -70%);
    padding:20px;
    z-index: 1;

    display: flex;
    position:absolute;
    border-radius: 20px;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg-secondary);
    box-shadow: var(--shadow);

    transition: box-shadow 250ms ease, transform 250ms ease;
}

.copyButton1,
.copyButton2,
.copyButton3 {
    padding: 10px 10px;
    border-radius: 5px;
    min-width: 100px;
    margin: 10px;
    opacity:0;
    border:none;
    border-radius: 15px;
    box-shadow: none;
    background-color: transparent;

    transition: opacity 300ms ease, background-color 300ms ease;
}

.copyButton1:hover,
.copyButton2:hover,
.copyButton3:hover {
    cursor:pointer;
    background-color: transparent;
    transition: opacity 300ms ease, background-color 300ms ease;
}


.copyButton-visible {
    opacity:1;
}

.copyButton1:active,
.copyButton2:active,
.copyButton3:active {
    scale:1.05;
    transition: scale 100ms ease;
}



.button1,
.button2 {
    position: absolute;
    padding: 10px 10px;
    border-radius: 5px;
    margin: 10px;
    background-color: var(--bg-secondary);
    color: var(--card-text);
    border:none;
    font-weight: var(--weight-semibold);

    transition-duration: 300ms;
    transition-property: box-shadow;
    transition-timing-function: ease-out;
}

.button1:hover,
.button2:hover {
    box-shadow: var(--shadow);
    transition-duration: 150ms;
    cursor:pointer;
}


.buttonContainer1,
.buttonContainer2 {
    height:55px;
    width:120px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 15px;
    box-shadow: none;

    background-color: transparent;

    overflow: hidden; 
}

.buttonContainer3,
.buttonContainer4 {
    height:120px;
    width:120px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 15px;
    box-shadow: none;

    background-color: transparent;

    overflow: hidden; 
}


.buttonContainer1:hover,
.buttonContainer2:hover,
.buttonContainer3:hover,
.buttonContainer4:hover {
    background-color: var(--hover-color),
}

.buttonContainer1:active,
.buttonContainer2:active,
.buttonContainer3:active,
.buttonContainer4:active {
    background-color: var(--hover-color);
    scale: 1.05;
    transition: scale 100ms ease;
}

.fade-hidden {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.buttonReload {
    color: var(--card-text);
    border:none;
    font-weight: var(--weight-semibold);

    height:100%;
    width:100%;

    background-color: transparent;

    display: flex;
    align-items: center;
    justify-content: center;

    transition-duration: 300ms;
    transition-property: transform;
    transition-timing-function: ease;
}

.buttonReload:hover {
    transform:rotate(80deg) scale(1.2);
    cursor:pointer;
    transition: transform 300ms ease;
}

.buttonToggleMode,
.buttonToggleScheme,
.buttonSettings {
    color: var(--card-text);
    border:none;
    height:100%;
    width:100%;

    font-weight: var(--weight-semibold);

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: transparent;
    font-size: medium;

    transition: box-shadow 300ms ease, background-color 300ms ease;
}

.buttonToggleMode:hover,
.buttonToggleScheme:hover,
.buttonSettings:hover {
    cursor:pointer;
}

.main-image img {
    width: 100%;
    display: block;
}


/* ------------------------------------------------------------------------------------------------------------------------------------------ */

.palette-section, .settings-section {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 100;
}

.settings-section {
    justify-content: flex-end;
}



.palette-section {
    justify-content: flex-start;
}

.settings-expanded {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    max-width: 0;
    overflow: hidden;
    transition: max-width 0.3s ease, padding 0.3s ease;
    white-space: nowrap;
    flex-shrink:1;
}

.settings-expanded.expanded {
    max-width: 200px;
    padding:10px;
}

.palette-history-expanded {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    max-width: 0;
    overflow: hidden;
    transition: max-width 0.3s ease, padding 0.3s ease;
    white-space: nowrap;
    flex-shrink:1;
}

.palette-history-expanded.expanded {
    max-width: 200px;
    padding-left: 10px;
}

.buttonContainer-palette,
.buttonContainer-settings {
    height: 120px;
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    box-shadow: none;
    background-color: transparent;
    overflow: hidden;
    transition: background-color 0.3s ease;
}

.buttonContainer-palette:hover,
.buttonContainer-settings:hover {
    background-color: var(--hover-color);
}

.buttonContainer-palette:active,
.buttonContainer-settings:active {
    background-color: var(--hover-color);
    scale: 1.05;
    transition: scale 100ms ease;
}

.buttonPalette {
    color: var(--card-text);
    border: none;
    height: 100%;
    width: 100%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 10px;
}

.palette-preview {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 60px;
    height: 60px;
}

.palette-swatch {
    flex: 1;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.history-container {
    height:120px;

    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    z-index: 100;
    min-height: 65px;
}

.history-bar {
    width:100%;
    height:100%;
    display: flex;
    align-items:center;
    gap: 8px;
    max-width: 320px;
    overflow-x: hidden;
}

.history-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 60px;
    height:60px;
    padding: 4px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.history-item:hover {
    transform: translateY(-2px);
}

.history-item:active {
    transform: translateY(0);
}

.history-swatch {
    flex: 1;
    border-radius: 3px;
    min-height: 12px;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
