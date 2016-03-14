'use strict'
const cheerio = require('cheerio');

const isBorrow = function(title, state) {
  if (!state.data) {
    if (state.children[0].data === "可借") {
      return 1;
    }
    return 0;
  } else if (state.data === "新书：正在上架") {
    return 1;
  }
  return 0;
}

const getTitle = function(data) {
  let docTitle = /document.title.*/g.exec(data)[0]
  let title = /".*$/g.exec(docTitle)[0]
    .replace('"', '《')
    .replace('"', '》')
    .replace(';', '')
  return title;
}

const getLocation = function(item) {
  if (item.parent) {
    let findState = cheerio.load(item.parent)
    let state = findState('td[width="10%"]').toArray()
    let location = state[0].children[0].data
    if (location) {
      return location;
    }
    return;
  }
  return;
}

exports.getTitle = getTitle;
exports.isBorrow = isBorrow;
exports.getLocation = getLocation;
