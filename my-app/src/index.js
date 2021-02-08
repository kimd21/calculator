import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: '0',
      arr: [],
      startNewNumber: false,
      isNegative: false,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick(e) {
    let val = e.target.value.toString();
    switch (val) {
      // Reset state to initial if 'AC' is clicked
      case 'AC':
        this.setState({
          display: '0',
          arr: [],
          startNewNumber: false,
        })
        break;
      case '0':
        // If there is no display, add a 0 and return
        if (this.state.display.toString() === '' || this.state.startNewNumber) {
          this.setState({display: '0'});
        }
        // Append numbers to string and remove leading zeros
        if (!this.state.startNewNumber) {
          this.setState(state => ({
            display: [...state.display.toString(), val].join('').replace(/^0/,'')
          }))
        } else {
          this.setState({
            display: [val].join('').replace(/^0/,''),
            startNewNumber: false
          })
        }
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        // Append numbers to string and remove leading zeros
        if (!this.state.startNewNumber) {
          this.setState(state => ({
            display: [...state.display.toString(), val].join('').replace(/^0/,'')
          }))
        } else {
          this.setState({
            display: [val].join('').replace(/^0/,''),
            startNewNumber: false
          })
        }

        // If there are no numbers in front of the decimal point, add a 0
        break;
      case '/':
      case '*':
      case '-':
      case '+':
        await this.setState(state => ({
          arr: [...state.arr, Number(state.display), val],
          startNewNumber: true
        }))
        if (this.state.arr.length === 4) {
          let result = operate(this.state.arr[0], this.state.arr[2], this.state.arr[1]);
          if (result.toString().length > 7) {
            result = Number.parseFloat(result).toPrecision(6);
          }
          let newArr = [result, this.state.arr[3]];
          this.setState({
            display: result.toString(),
            arr: newArr,
            startNewNumber: true,
          })
        }
        break;
      case '=':
        await this.setState(state => ({
          arr: [...state.arr, Number(state.display), val],
          startNewNumber: true
        }))
        if (this.state.arr.length === 4) {
          let result = operate(this.state.arr[0], this.state.arr[2], this.state.arr[1]);
          if (result.toString().length > 7) {
            result = Number.parseFloat(result).toPrecision(6);
          }
          this.setState({
            display: result.toString(),
            arr: [],
            startNewNumber: true,
          })
        }
        break;
      case '+/-':
        if (this.state.display.toString() === '0') {
          return;
        } else if (!this.state.display.toString().includes('-')) {
          this.setState(state => ({
            display: ['-', ...state.display.toString()].join(''),
          }))
        } else {
          this.setState(state => ({
            display: state.display.toString().slice(1),
          }))
        }
        break;
      case '%':
        let result = Number(this.state.display / 100);
        this.setState({
          display: result
        })
        break;
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