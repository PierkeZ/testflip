(function() {
    'use strict';

    // Define the simulation modes
    const SIMULATION_MODES = {
        RANDOM: 'random',
        OPPOSITE: 'opposite',
        FIRSTONEOPPOSITE: 'firstoneflipped',
        REVERSE: 'reverse',
        PROCENT: 'procent',
        SLIGHTSAME: 'slightsame',

    };

    let simulationInterval = 300;
    let simulationPaused = false;
    let deltaInputValue = 5;
    let takeIt = false;
    let inputFieldValue = 10;
    let continueMode = false;
    let gamevalue = 0;
    let stopAmount = 0;
    let iAr = 0;
    let simulationMode = SIMULATION_MODES.RANDOM; // Set the default mode to random

    // Define the array to store the key presses
    let keyPresses = [];
    // Define the array to store the last sequence key presses
    let fillHerUp = ['P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q'];
    console.log('fillHerUp: ' + fillHerUp); 
    let lastKeyPresses = ['P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q'];
    console.log('lastKeyPresses: ' + lastKeyPresses);   
    let newKeyPresses = ['P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q','P','Q'];
    console.log('newKeyPresses: ' + newKeyPresses); 

    // Create a div to hold the user interface
    const uiDiv = document.createElement('div');
    uiDiv.id = 'Flip VS CODE';
    uiDiv.style.position = 'fixed';
    uiDiv.style.top = '800px';
    uiDiv.style.left = '48px';
    uiDiv.style.zIndex = '9999';
    uiDiv.style.padding = '10px';
    uiDiv.style.background = '#fff';
    uiDiv.style.border = '1px solid #000';

    // Create the user interface elements
    const title = document.createElement('h3');
    title.innerText = 'Flip VS Code';

    const info = document.createElement('p');
    info.innerText = 'Press the "Start" button to begin simulating key presses.';

    // Create the input field element
    const inputField = document.createElement('input');
    inputField.type = 'number';
    inputField.min = '0';
    inputField.max = '1000';
    inputField.value = '10';
    inputField.addEventListener('change', () => {
        inputFieldValue = inputField.value;
        console.log('Payout changed to.' + inputFieldValue);
    });

    // Create the interval input field
    const intervalLabel = document.createElement('label');
    intervalLabel.innerText = 'Interval (ms): ';
    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.value = simulationInterval;
    intervalInput.min = '100';
    intervalInput.max = '5000';
    intervalInput.step = '100';


    // Create the delta compare input field
    const deltaLabel = document.createElement('label');
    deltaLabel.innerText = 'Delta: ';
    const deltaInput = document.createElement('input');
    deltaInput.type = 'number';
    deltaInput.value = deltaInputValue;
    deltaInput.addEventListener('change', (event) => {
        deltaInputValue = event.target.value;
        console.log('Delta changed to.' + deltaInputValue);
    });

    // Create the stop amount input field element
    const stopAmountLabel = document.createElement('label');
    stopAmountLabel.innerText = 'Stop Amount: ';
    const stopAmountInput = document.createElement('input');
    stopAmountInput.type = 'number';
    stopAmountInput.min = '0';
    stopAmountInput.max = '1000';
    stopAmountInput.step = '0.01';
    stopAmountInput.value = stopAmount;
    stopAmountInput.addEventListener('change', (event) => {
        stopAmount = event.target.value;
        console.log('Stop Amount changed to: ' + stopAmount);
    });

    // Create the simulation mode dropdown
    const modeLabel = document.createElement('label');
    modeLabel.innerText = 'Simulation mode: ';
    const modeSelect = document.createElement('select');
    modeSelect.innerHTML = `
  <option value="${SIMULATION_MODES.RANDOM}">Random</option>
  <option value="${SIMULATION_MODES.OPPOSITE}">Opposite</option>
  <option value="${SIMULATION_MODES.FIRSTONEOPPOSITE}">firstoneopposite</option>
  <option value="${SIMULATION_MODES.REVERSE}">reverse</option>
<option value="${SIMULATION_MODES.PROCENT}">procent</option>
`;
    modeSelect.value = simulationMode;
    modeSelect.addEventListener('change', (event) => {
        simulationMode = event.target.value;
        console.log('mode changed to: ' +event.target.value);
    });

    // Create the continue mode checkbox
    const continueLabel = document.createElement('label');
    continueLabel.innerText = 'Continue mode: ';
    const continueCheckbox = document.createElement('input');
    continueCheckbox.type = 'checkbox';
    continueCheckbox.addEventListener('change', (event) => {
        continueMode = event.target.checked;
        console.log('Continuemode changed to.' + continueMode);
    });

    // Create the take it checkbox
    const takeItLabel = document.createElement('label');
    takeItLabel.innerText = 'Take it: ';
    const takeItCheckbox = document.createElement('input');
    takeItCheckbox.type = 'checkbox';
    takeItCheckbox.addEventListener('change', (event) => {
        takeIt = event.target.checked;
        console.log('Take changed to: ' + takeIt);
    });

    // Add the take it checkbox to the UI
    uiDiv.appendChild(takeItLabel);
    uiDiv.appendChild(takeItCheckbox);


    // Add the continue mode checkbox to the UI
    uiDiv.appendChild(continueLabel);
    uiDiv.appendChild(continueCheckbox);

    const startButton = document.createElement('button');
    startButton.innerText = 'Start';
    startButton.style.marginRight = '5px';
    startButton.style.padding = '5px 10px';
    startButton.addEventListener('click', startSimulation);

    const stopButton = document.createElement('button');
    stopButton.innerText = 'Stop';
    stopButton.style.marginRight = '5px';
    stopButton.style.padding = '5px 10px';
    stopButton.disabled = true;
    stopButton.addEventListener('click', stopSimulation);

    const pauseButton = document.createElement('button');
    pauseButton.innerText = 'Pause';
    pauseButton.style.marginRight = '5px';
    pauseButton.style.padding = '5px 10px';
    pauseButton.disabled = false; // Disable the pause button by default
    pauseButton.addEventListener('click', () => {

        simulationPaused = !simulationPaused; // Toggle the paused state
        if (simulationPaused) {
            clearInterval(simulationInterval); // Clear the simulation interval
            startButton.disabled = true; // Disable the start button
            stopButton.disabled = false; // Enable the stop button
            pauseButton.innerText = 'Resume'; // Change the button text to "Resume"
            console.log('Simulation paused.');
        } else {
            startSimulation(); // Restart the simulation
            pauseButton.innerText = 'Pause'; // Change the button text back to "Pause"
            console.log('Simulation resumed.');
        }
    });


    // Create the button to retrieve the array content and print to console
    const getArrayButton = document.createElement('button');
    getArrayButton.innerText = 'Get Array Content';
    getArrayButton.style.marginRight = '5px';
    getArrayButton.style.padding = '5px 10px';
    getArrayButton.addEventListener('click', getArrayContent);

    // Function to retrieve the array content and print to console
    function getArrayContent() {
        console.log(keyPresses);
    }


    // Create the button to retrieve the array content and print to console
    const increaseAmountButton = document.createElement('button');
    increaseAmountButton.innerText = 'Amount +';
    increaseAmountButton.style.marginRight = '5px';
    increaseAmountButton.style.padding = '5px 10px';
    increaseAmountButton.addEventListener('click', amountIncrease);


    // Create the button to retrieve the array content and print to console
    const decreaseAmountButton = document.createElement('button');
    decreaseAmountButton.innerText = 'Amount -';
    decreaseAmountButton.style.marginRight = '5px';
    decreaseAmountButton.style.padding = '5px 10px';
    decreaseAmountButton.addEventListener('click', amountDecrease);

    // Add the button to the UI
    uiDiv.appendChild(getArrayButton);
    uiDiv.appendChild(increaseAmountButton);
    uiDiv.appendChild(decreaseAmountButton);

    // Add the user interface elements to the UI div
    uiDiv.appendChild(title);
    uiDiv.appendChild(info);
    uiDiv.appendChild(modeSelect);
    uiDiv.appendChild(startButton);
    uiDiv.appendChild(stopButton);
    uiDiv.appendChild(pauseButton);
    uiDiv.appendChild(inputField);
    // Add the interval input field and the simulation mode dropdown to the UI
    uiDiv.appendChild(deltaLabel);
    uiDiv.appendChild(deltaInput);
    uiDiv.appendChild(intervalLabel);
    uiDiv.appendChild(intervalInput);
    uiDiv.appendChild(stopAmountLabel);
    uiDiv.appendChild(stopAmountInput);
    uiDiv.appendChild(modeLabel);
    uiDiv.appendChild(modeSelect);

    // Add the UI div to the page
    document.body.appendChild(uiDiv);

    function amountIncrease() {
        simulateKeyPress('S');
    }
    function amountDecrease() {
        simulateKeyPress('A');
    }

    function startSimulation() {
        gamevalue = 0;
        simulationPaused = false;
        pauseButton.enabled = true;
        startButton.disabled = true;
        stopButton.disabled = false;
        info.innerText = 'Simulating key presses...';
        simulationInterval = setInterval(runSimulation, parseInt(intervalInput.value));
    }

    function stopSimulation() {
        clearInterval(simulationInterval);
        startButton.disabled = false;
        stopButton.disabled = true;
        info.innerText = 'Simulation stopped.';
    }
    function runSimulation() {
        let fieldValue = parseInt(inputField.value);
        gamevalue = 0;
        gamevalue = parseFloat(document.querySelector('.coinflip-left .t').innerText);
        console.log(new Date().toLocaleTimeString() + ' target:' + fieldValue + ' ; multi:' + gamevalue + ' ; continue: '+ continueMode + ' ; takeit: '+takeIt );

        if(getCurrentStack()<= stopAmount) {
            console.log('StopAmount reached: ' + stopAmount);
            gamevalue = 0;
            iAr=0;
            stopSimulation();
            return;
        }

        if(gamevalue >= fieldValue && continueMode && takeIt) {
            console.log('Taking profit and continuing');
            simulateKeyPress('W');
            iAr=0;
            stopSimulation();
            startSimulation();
            gamevalue = 0;
        }

        if(gamevalue >= fieldValue && takeIt && !continueMode) {
            console.log('Taking profit and stopping');
            simulateKeyPress('W');
            iAr=0;
            gamevalue = 0;
            stopSimulation();

            return;
        }

        if(gamevalue >= fieldValue && !takeIt && !continueMode) {
            console.log('Pausing on target');
            gamevalue = 0;
            stopSimulation();

            return;
        }





        // Check the state of the button and simulate a key press if it is active
        const betButton = [...document.querySelectorAll('button')].find(
            (btn) => btn.innerText === 'Bet'
        );
        const cashButton = [...document.querySelectorAll('button')].find((btn) =>
                                                                         btn.innerText.includes('Cas')
                                                                        );

        if (betButton != null) {


            const isBetButtonActive = !betButton.disabled;
            if (isBetButtonActive) {
                // Check if the simulation is paused again before triggering a key press
                if (simulationPaused) {
                    console.log('Simulation paused.');
                    return;
                }

                //if previous results were less than 10 presses, fill up the array
                console.log(lastKeyPresses);

                newKeyPresses = getArrayToPlay();
                // Always fill up the array until 15 to play with
                while (newKeyPresses.length < 15) {
                    newKeyPresses.push(getKeyPressRandom()); // add random Q or P until array length is 15
                }
                lastKeyPresses.length = 0;

                console.log("jumped into isbuttonactive:" + newKeyPresses);

                //console.log('BetButton is active. Simulating key press: Space');
                simulateKeyPress(' ');
                //clear array

            } else {
                console.log('BetButton is not active.');
            }
        } else if (betButton == null && cashButton != null) {

            // Check if the simulation is paused again before triggering a key press
            if (simulationPaused) {
                console.log('Simulation paused.');
            } else{
                simulateKeyPress(getKeyPressRandom());//each iteration the next element in newKeyPresses is used.
                lastKeyPresses.push(newKeyPresses[iAr]);
                iAr ++;
            }

        } }

        function getArrayToPlay() {
            console.log("before: " + lastKeyPresses);
            let newKeyPresses = [];
        
            //depending on the selected mode, the array will be prepped differently
            switch (simulationMode) {
                case SIMULATION_MODES.RANDOM:
                    while (newKeyPresses.length < 15) {
                        newKeyPresses.push(getKeyPressRandom()); // add random Q or P until array length is 15
                    }
                    console.log("random: " + newKeyPresses);
                    break;
                case SIMULATION_MODES.PROCENT:
                    while (newKeyPresses.length < 15) {
                        newKeyPresses.push(getKeyPressPercentageMode()); // add random Q or P until array length, use delta as percentage
                    }
                    console.log("procent: " + newKeyPresses);
                    break;
                case SIMULATION_MODES.SLIGHTSAME:
                    while (newKeyPresses.length < 15) {
                        newKeyPresses.push(chooseSlightlyTheSame()); // add random Q or P until array length, use delta as percentage
                    }
                    console.log("procent: " + newKeyPresses);
                    break;
                case SIMULATION_MODES.OPPOSITE:
                    newKeyPresses =  chooseOppositeAll();
                    console.log("opposite: " + newKeyPresses);
                    break;
                case SIMULATION_MODES.FIRSTONEOPPOSITE:
                    newKeyPresses = chooseOppositeFirst();
                    console.log("firstoneopposite: " + newKeyPresses);
                    break;
                case SIMULATION_MODES.REVERSE:
                    newKeyPresses = [...lastKeyPresses].reverse();
                    console.log("reverse: " + newKeyPresses);
                    break;
                default:
                    console.error(`Invalid simulation mode: ${simulationMode}`);
                    break;
            }
        

        
            console.log("After: " + newKeyPresses);
            return newKeyPresses;
        }



    function simulateKeyPress(key) {
        if (key == null) {
            console.error('Key parameter is null or undefined');
            return;
        }
        logKeyPress(key);
        console.log(key);
        const keyCode = key.charCodeAt(0); // get the ASCII code for the key
        const event = new KeyboardEvent('keydown', { keyCode: keyCode });
        document.dispatchEvent(event);
        setTimeout(() => {
            const event = new KeyboardEvent('keyup', { keyCode: keyCode });
            document.dispatchEvent(event);
        }, 100);
    }

    // Define the function to log the key presses
    function logKeyPress(key) {
        keyPresses.push(key);
    }

    function getCurrentStack() {
        const amountSpan = document.querySelector('div.amount > span.amount-str');
        return parseFloat(amountSpan.innerText.replace('€ ', ''));
    }

    function getKeyPressRandom() {
        return Math.random() < 0.5 ? 'Q' : 'P';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function chooseOppositeFirst() {
        // Get the first keypress from the lastKeyPresses array which
        const firstKeyPress = lastKeyPresses[0];
        // Check if it is either "Q" or "P"
        if (firstKeyPress === "Q") {
            lastKeyPresses[0] = "P";
        } else if (firstKeyPress === "P") {
            lastKeyPresses[0] = "Q";
        }

        // Set lastKeyPresses to newKeyPresses
        return lastKeyPresses;

    }

    function chooseOppositeAll() {
        let swappedArray = lastKeyPresses.map(function(element) {
            return element.replace("Q", "temp").replace("P", "Q").replace("temp", "P");
        });
        console.log(swappedArray); // Output: ["Q", "P", "Q", "Q", "P"]
        return swappedArray;


    }


    function chooseSlightlyTheSame() {
        let shuffeledArray;
        shuffeledArray = shuffleArray(lastKeyPresses);
        return shuffeledArray;
    }

    function getKeyPressPercentageMode() {
        const random = Math.random() < (deltaInputValue / 100) ? 'Q' : 'P';
        console.log("Percentagemode: " + deltaInputValue + " ;selected: " + random);
        return random;


    }

})();