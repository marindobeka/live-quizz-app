/* eslint-disable max-len */

/**
 * Create radio elements.
 * @param {dataFile} dataFile The data.
 * @return {data}
 */
export function createElements(dataFile) {
  if (dataFile.includes('<radios>'.toLowerCase())) {
    return createRadioElement(dataFile);
  } else if (dataFile.includes('<checkboxes>'.toLowerCase())) {
    return createCheckboxElements(dataFile);
  } else if (dataFile.includes('<textbox/>'.toLowerCase())) {
    return createTextBoxElement(dataFile);
  } else if (dataFile.includes('<sourcecode/>'.toLowerCase())) {
    return createTextBoxElement(dataFile);
  }
}
/**
 * Create radio elements.
 * @param {dataFile} dataFile The data.
 * @return {data}
 */
function createRadioElement(dataFile) {
  // console.log(dataFile);
  const question = dataFile[0].replace(/(^\s+|\s+$|["'])/g, '');
  const answers = [];
  let htmlText = '<label><h4>'+question+'</h4></label>';
  //   let htmlText = '';
  for (let i = 1; i < dataFile.length; i ++) {
    const trimmed = dataFile[i].replace(/(^\s+|\s+$|["'])/g, '');
    if (trimmed !== '<radios>' && trimmed !== '</radios>' && trimmed !== ' ') {
      // console.log(trimmed);
      htmlText = htmlText.concat(
          '<div class="form-check">'+
            '<input class="form-check-input" type="radio"  name="radioButton" id="radioButton'+i+'" value="' + trimmed + '" required/>'+
            '<label class="form-check-label" for="radioButton'+i+'">'+trimmed+'</label>'+
          '</div>');
      answers.push(trimmed);
    }
  }
  const parsedElements = {
    question: question,
    answers: answers,
    htmlText: htmlText,
    type: 'radio',
  };
  // console.log(parsedElements);
  return parsedElements;
};

/**
 * Create checkbox elements.
 * @param {dataFile} dataFile The data.
 * @return {data}
 */
function createCheckboxElements(dataFile) {
  // console.log(dataFile);
  const question = dataFile[0].replace(/(^\s+|\s+$|["'])/g, '');
  const answers = [];
  let htmlText = '<label><h4>'+question+'</h4></label>';
  for (let i = 1; i < dataFile.length; i ++) {
    const trimmed = dataFile[i].replace(/(^\s+|\s+$|["'])/g, '');
    if (trimmed !== '<checkboxes>' && trimmed !== '</checkboxes>' && trimmed !== ' ') {
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
  const parsedElements = {
    question: question,
    answers: answers,
    htmlText: htmlText,
    type: 'checkbox',
  };
  // console.log(parsedElements);
  return parsedElements;
};

/**
 * Create checkbox elements.
 * @param {dataFile} dataFile The data.
 * @return {data}
 */
function createTextBoxElement(dataFile) {
  // console.log(dataFile);
  const question = dataFile[0].replace(/(^\s+|\s+$|["'])/g, '');
  let htmlText = '<label><h4>'+question+'</h4></label>';
  htmlText = htmlText.concat(
      '<div class="form-group">'+
      '<textarea class="form-control" id="FormControlTextarea1" rows="5"></textarea>'+
    '</div>'
  );
  const parsedElements = {
    question: question,
    answers: null,
    htmlText: htmlText,
    type: 'textbox',
  };
  // console.log(parsedElements);
  return parsedElements;
};
