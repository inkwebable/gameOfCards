import _ from 'lodash';
import './assets/styles/style.scss';
import Icon from './assets/images/question-icon.svg';
import printMe from './core';

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('sass-hello');

  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;

  element.appendChild(btn);
  printMe();

  return element;
}

document.body.appendChild(component());
