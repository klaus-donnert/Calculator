const res = document.getElementById("result");
const toast = document.getElementById("toast");
let equalsPressed = false;  // Add this new flag

function calculate(value) {
  // If there's no value to calculate, return
  if (!value) return;
  
  // Special case for squaring (detect "* *" pattern which is what happens when "xx" is pressed)
  if (value.includes(' * * ') || value.includes(' * *')) {
    // Extract the number before the double multiplication
    const number = parseFloat(value.split(' * ')[0]);
    
    // Square the number and display result
    if (!isNaN(number)) {
      const result = number * number;
      // Round to 15 decimal places
      res.value = Math.round(result * 10**15) / 10**15;
      equalsPressed = true;
      return;
    }
  }
  
  // Handle regular calculations
  try {
    // Replace spaces before evaluation
    const cleanValue = value.replace(/\s/g, '');
    const calculatedValue = eval(cleanValue);
    
    if (isNaN(calculatedValue) || !isFinite(calculatedValue)) {
      res.value = "Error";
      setTimeout(() => {
        res.value = "";
      }, 1300);
    } else {
      // Round to 15 decimal places
      res.value = Math.round(calculatedValue * 10**15) / 10**15;
      equalsPressed = true;
    }
  } catch (error) {
    res.value = "Error";
    setTimeout(() => {
      res.value = "";
    }, 1300);
  }
}

// Displays entered value on screen.
function liveScreen(enteredValue) {
  // If equals was pressed and new input is a number, clear the display
  if ( !res.value || (equalsPressed && !['+', '-', '*', '/', '%'].includes(enteredValue))) {
    res.value = "";
  }
  
  // Handle percentage specially
  if (enteredValue === '%') {
    // Extract the last number in the expression
    let expression = res.value.trim();
    let lastNumber = '';
    let prefix = '';
    
    // Find the last number in the expression
    // If the expression has operators, extract the last part
    const lastOperatorIndex = Math.max(
      expression.lastIndexOf(' + '),
      expression.lastIndexOf(' - '),
      expression.lastIndexOf(' * '),
      expression.lastIndexOf(' / ')
    );
    
    if (lastOperatorIndex !== -1) {
      lastNumber = expression.substring(lastOperatorIndex + 3);
      prefix = expression.substring(0, lastOperatorIndex + 3);
    } else {
      lastNumber = expression;
      prefix = '';
    }
    
    // Convert to percentage by dividing by 100
    if (lastNumber !== '') {
      const percentValue = parseFloat(lastNumber) / 100;
      res.value = prefix + percentValue;
    }
  } 
  // Add spaces around other operators
  else if (['+', '-', '*', '/'].includes(enteredValue)) {
    res.value = res.value.trim() + " " + enteredValue + " ";
  } else {
    res.value += enteredValue;
  }
  
  equalsPressed = false;  // Reset the flag after handling input
}

//adding event handler on the document to handle keyboard inputs
document.addEventListener("keydown", keyboardInputHandler);

//function to handle keyboard inputs
function keyboardInputHandler(e) {
  e.preventDefault();
  
  switch (e.key) {
    // Numbers
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      
    // Operators
    case "+":
    case "-":
    case "*":
    case "/":
      
    // Decimal
    case ".":
    res.value += e.key;
    break;  
    // Enter for calculation
    case "Enter":
      calculate(result.value);
      break;
      
    // Backspace
    case "Backspace":
      backspace();
      break;
      
    default:
      break;
  }
}

// Add these new functions
function clearEntry() {
  // Get the current display value
  let displayValue = res.value;
  
  // If empty, nothing to do
  if (!displayValue) {
    return;
  }
  
  // If the value ends with a space, it likely has an operator before it
  if (displayValue.endsWith(' ')) {
    // Trim trailing space
    displayValue = displayValue.trimEnd();
    
    // Remove the operator
    displayValue = displayValue.slice(0, -1);
    
    // Remove any space before the operator too
    displayValue = displayValue.trimEnd();
    
    res.value = displayValue;
  } else {
    // at this point the value is a number and not an operator
    // remove the last set of digits
    // by removing last digit until a space is found or the value is empty
    while (displayValue.length > 0 && displayValue[displayValue.length - 1] !== ' ') {
      displayValue = displayValue.slice(0, -1);
    }
    res.value = displayValue;
  }
}

function backspace() {
  // Get the current display value
  let displayValue = res.value;
  
  // If empty, nothing to do
  if (!displayValue) {
    return;
  }
  
  // If the value ends with a space, it likely has an operator before it
  if (displayValue.endsWith(' ')) {
    // Trim trailing space
    displayValue = displayValue.trimEnd();
    
    // Remove the operator
    displayValue = displayValue.slice(0, -1);
    
    // Remove any space before the operator too
    displayValue = displayValue.trimEnd();
    
    res.value = displayValue;
  } else {
    // Otherwise just remove the last character
    res.value = displayValue.slice(0, -1);
  }
}
