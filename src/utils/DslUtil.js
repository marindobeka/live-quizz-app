/* eslint-disable max-len */

/**
 * Create radio elements.
 * @param {dataFile} dataFile The data.
 * @param {questionName} questionName The question name.
 * @return {data}
 */
export function createElements(dataFile, questionName) {
  if (dataFile.includes('<radios>'.toLowerCase())) {
    return createRadioElement(dataFile, questionName);
  } else if (dataFile.includes('<checkboxes>'.toLowerCase())) {
    return createCheckboxElements(dataFile, questionName);
  } else if (dataFile.includes('<textbox/>'.toLowerCase())) {
    return createTextBoxElement(dataFile, questionName);
  } else if (dataFile.includes('<sourcecode/>'.toLowerCase())) {
    return createTextBoxElement(dataFile, questionName);
  }
}
/**
 * Create radio elements.
 * @param {dataFile} dataFile The data.
 * @param {questionName} questionName The question name.
 * @return {data}
 */
function createRadioElement(dataFile, questionName) {
  // console.log(dataFile);
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(dataFile, 'text/html');
  let radios = htmlDoc.getElementsByTagName('radios')[0].innerHTML;
  radios = radios.split(/\r?\n/);
  const question = questionName;
  const answers = [];
  let htmlText = '';
  for (let i = 0; i < radios.length; i ++) {
    const trimmed = radios[i].replace(/(^\s+|\s+$|["'])/g, '');
    if (trimmed !== '<radios>' && trimmed !== '</radios>' && trimmed !== ' ' && trimmed !== '') {
      // console.log(trimmed);
      htmlText = htmlText.concat(
          '<div class="form-check">'+
            '<input class="form-check-input" type="radio"  name="radioButton" id="radioButton'+i+'" value="' + trimmed + '" required/>'+
            '<label class="form-check-label" for="radioButton'+i+'">'+trimmed+'</label>'+
          '</div>');
      answers.push(trimmed);
    }
  }
  htmlDoc.getElementsByTagName('radios')[0].innerHTML = htmlText;

  const outputHtml = htmlDoc.getElementsByTagName('body')[0].innerHTML;
  const parsedElements = {
    question: question,
    answers: answers,
    htmlText: outputHtml,
    type: 'radio',
  };
  console.log(parsedElements);
  return parsedElements;
};

/**
 * Create checkbox elements.
 * @param {dataFile} dataFile The data.
 * @param {questionName} questionName The question name.
 * @return {data}
 */
function createCheckboxElements(dataFile, questionName) {
  // console.log(dataFile);
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(dataFile, 'text/html');
  let checkBoxes = htmlDoc.getElementsByTagName('checkboxes')[0].innerHTML;
  checkBoxes = checkBoxes.split(/\r?\n/);
  const question = questionName;
  const answers = [];
  let htmlText = '';
  for (let i = 0; i < checkBoxes.length; i ++) {
    const trimmed = checkBoxes[i].replace(/(^\s+|\s+$|["'])/g, '');
    if (trimmed !== '<checkboxes>' && trimmed !== '</checkboxes>' && trimmed !== ' ' && trimmed !== '') {
      // console.log(trimmed);
      htmlText = htmlText.concat(
          '<div class="form-check">'+
            '<input class="form-check-input" type="checkbox" id="checkBox'+i+'" value="' + trimmed + '" />'+
            '<label class="form-check-label" for="checkBox'+i+'">'+trimmed+'</label>'+
          '</div>'
      );
      answers.push(trimmed);
    }
  }
  htmlDoc.getElementsByTagName('checkboxes')[0].innerHTML = htmlText;

  const outputHtml = htmlDoc.getElementsByTagName('body')[0].innerHTML;
  const parsedElements = {
    question: question,
    answers: answers,
    htmlText: outputHtml,
    type: 'checkbox',
  };
  // console.log(parsedElements);
  return parsedElements;
};

/**
 * Create checkbox elements.
 * @param {dataFile} dataFile The data.
 * @param {questionName} questionName The question name.
 * @return {data}
 */
function createTextBoxElement(dataFile, questionName) {
  // console.log(dataFile);
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(dataFile, 'text/html');
  console.log(htmlDoc.getElementsByTagName('body'));
  const question = questionName;
  let htmlText = '';
  htmlText = htmlText.concat(
      '<div class="form-group">'+
      '<textarea class="form-control" id="FormControlTextarea1" rows="5"></textarea>'+
    '</div>'
  );
  if (document.getElementsByTagName('textbox')) {
    htmlDoc.getElementsByTagName('textbox')[0].innerHTML = htmlText;
  } else if (document.getElementsByTagName('sourcecode')) {
    htmlDoc.getElementsByTagName('sourcecode')[0].innerHTML = htmlText;
  }
  const outputHtml = htmlDoc.getElementsByTagName('body')[0].innerHTML;
  const parsedElements = {
    question: question,
    answers: null,
    htmlText: outputHtml,
    type: 'textbox',
  };
  // console.log(parsedElements);
  return parsedElements;
};
