import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Basic calculator operations
const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;
const operate = (x, y, str) => {
  switch (str) {
    case '+':
      return add(x, y);
    case '-':
      return subtract(x, y);
    case '*':
      return multiply(x, y);
    case '/':
      return divide(x,y);
    default:
  }
}

// Character limit on calculator
let lim = 9;

// Number of leading zeros after decimal point if |number| < 1 (i.e. 0.0000134, there are 4 zeros after decimal)
let leadZeros = 0;

// Create buttons for calculator
class CalculatorButtons extends React.Component {
  render() {
    return(
      <div id='container'>
        <div id='display'>{this.props.display}</div>
        <button className='blue button' onClick={this.props.onClick} value='AC'>AC</button>
        <button className='blue button' onClick={this.props.onClick} value='+/-'>+/-</button>
        <button className='blue button' onClick={this.props.onClick} value='%'>%</button>
        <button className='green button' onClick={this.props.onClick} value='/'>/</button>
        <button className='white button' onClick={this.props.onClick} value='7'>7</button>
        <button className='white button' onClick={this.props.onClick} value='8'>8</button>
        <button className='white button' onClick={this.props.onClick} value='9'>9</button>
        <button className='green button' onClick={this.props.onClick} value='*'>*</button>
        <button className='white button' onClick={this.props.onClick} value='4'>4</button>
        <button className='white button' onClick={this.props.onClick} value='5'>5</button>
        <button className='white button' onClick={this.props.onClick} value='6'>6</button>
        <button className='green button' onClick={this.props.onClick} value='-'>-</button>
        <button className='white button' onClick={this.props.onClick} value='1'>1</button>
        <button className='white button' onClick={this.props.onClick} value='2'>2</button>
        <button className='white button' onClick={this.props.onClick} value='3'>3</button>
        <button className='green button' onClick={this.props.onClick} value='+'>+</button>
        <button className='zero white button' onClick={this.props.onClick} value='0'>0</button>
        <button className='white button' onClick={this.props.onClick} value='.'>.</button>
        <button className='green button' onClick={this.props.onClick} value='='>=</button>
      </div>
    );
  }
}

// Main calculator class
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: '0',
      arr: [],
      startNewNumber: false,
      operatorClicked: true
    }
    this.handleClick = this.handleClick.bind(this);
  }

  // Handle calculator operations
  async handleClick(e) {
    let val = e.target.value.toString();
    switch (val) {
      // Reset state to initial if 'AC' is clicked
      case 'AC':
        this.setState({
          display: '0',
          arr: [],
          startNewNumber: false,
          operatorClicked: true
        })
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        // If there is no display, add a 0 and return
        if ((this.state.display.toString() === '' || this.state.startNewNumber) && val === '0') {
          this.setState({
            display: '0',
            operatorClicked: false
          });
          return;
        }
        // Append numbers to string and remove leading zeros
        if (!this.state.startNewNumber) {
          // If number of characters exceeds 10, do nothing
          if (this.state.display.toString().length >= lim) {
            return;
          }
          // If there is a 0 in front of a decimal point, don't replace the leading 0
          let strArr = this.state.display.toString().split('.');
          if (strArr[0] === '0' && strArr.length === 2) {
            // Number of leading zeros after decimal
            let tmp = strArr[1].match(/^0+/);
            leadZeros = tmp ? tmp[0].length : 0;
            this.setState(state => ({
              display: [...state.display.toString(), val].join('')
            }))
          } else {
            this.setState(state => ({
            display: [...state.display.toString(), val].join('').replace(/^0/,''),
            operatorClicked: false
            }))
          }
        // Start a new number if startNewNumber is true
        } else {
          this.setState({
            display: [val].join('').replace(/^0/,''),
            startNewNumber: false,
            operatorClicked: false
          })
        }
       
        break;
      case '/':
      case '*':
      case '-':
      case '+':
      case '=':
        // Do nothing if another operator has already been clicked
        if (this.state.operatorClicked === true) {
          return;
        }

        // Store current number and clicked operator to array, wait for next number 
        await this.setState(state => ({
          arr: [...state.arr, Number(state.display), val],
          startNewNumber: true,
          operatorClicked: true
        }))

        // Perform corresponding operation if 2 numbers and an operator exists in array upon
        // clicking a subsequent operator
        if (this.state.arr.length === 4) {
          // Display error message and return if dividing by 0
          if (this.state.arr[2] === 0 && this.state.arr[1] === '/') {
            this.setState({
              display: "Divided by 0",
              arr: [],
              startNewNumber: true,
              operatorClicked: true
            })
            return;
          }

          // Display error message if the correct order of numbers and operators does not exist in array
          if (typeof(this.state.arr[0]) !== 'number' || typeof(this.state.arr[1]) !== 'string' 
            || typeof(this.state.arr[2]) !== 'number' || typeof(this.state.arr[3]) !=='string') {
            this.setState({
              display: "Error, AC",
              arr: [],
              startNewNumber: true,
              operatorClicked: true
            })
            return;
          }

          // Perform operation
          let result = operate(this.state.arr[0], this.state.arr[2], this.state.arr[1]);

          // Prevent character length from exceeding 10
          let hardlim = lim;
          if (leadZeros > 0) {
            hardlim = hardlim - leadZeros;
          }
          if (result.toString().includes('-')) {
            hardlim = hardlim - 1;
          } 

          if (result.toString().length > lim) {
            result = Number.parseFloat(result).toPrecision(hardlim);
            if (result.toString().includes('e')) {
              result = Number.parseFloat(result).toPrecision(hardlim - 3);
            }
          }

          // Remove trailing zeros from result
          result = Number(result.toString().replace(/0$/,''));

          // Add result and next operator to array
          let newArr = [result, this.state.arr[3]];
          this.setState({
            display: result.toString(),
            arr: newArr,
            startNewNumber: true,
            operatorClicked: true
          })

          // Reset array to empty if equal sign is clicked
          if (val === '=') {
            this.setState({
              arr: [],
              operatorClicked: false
            });
          }
        }
        break;
      
      // Toggle negative sign 
      case '+/-':
        let regex = /^-/;
        // No negative sign in front of just zero
        if (this.state.display.toString() === '0') {
          return;
        } else if (!regex.test(this.state.display.toString())) {
          this.setState(state => ({
            display: ['-', ...state.display.toString()].join(''),
          }))
        } else {
          this.setState(state => ({
            display: state.display.toString().replace(/-?/,''),
          }))
        }
        break;
      
      // Divide by 100 
      case '%':
        let result = Number(this.state.display) / 100;
        // Prevent character length from exceeding 10
        let hardlim = lim;
        if (result.toString().includes('-')) {
          hardlim = lim - 1;
        } 

        if (result.toString().length > lim) {
          result = Number.parseFloat(result).toPrecision(hardlim);
          if (result.toString().includes('e')) {
            result = Number.parseFloat(result).toPrecision(hardlim - 3);
          }
        }
        this.setState({
          display: result
        })
        break;
      
      // Create a decimal if none exist
      case '.':
        if (!this.state.display.toString().includes('.')) {
          this.setState(state => ({
            display: [...state.display, '.'].join(''),
          }))
        }
        break;
      default:
    }
  }

  render() {
    return(
      <CalculatorButtons display={this.state.display} onClick={this.handleClick} />
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById('root'));