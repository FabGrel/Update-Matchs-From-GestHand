function getHistorySheet() {
  return SpreadsheetApp.openById('14IvtircE1hfTek4_K7q59eXl67l2-JRnS5WOn5tkqFg').getSheetByName('History');
}

function getCodesRencontreFromHistory() {
  const COL_HISTORY_CODERENCONTRE = 0;
  return getColumnValues(getHistorySheet(), COL_HISTORY_CODERENCONTRE);
}

function getCategoriesFromHistory() {
  const COL_HISTORY_CATEGORIE = 1;
  return getColumnValues(getHistorySheet(), COL_HISTORY_CATEGORIE);
}

function getDatesFromHistory() {
  const COL_HISTORY_DATE = 2;
  return getColumnValues(getHistorySheet(), COL_HISTORY_DATE);
}

function getEventIdsFromHistory() {
  const COL_HISTORY_EVENTID = 3;
  return getColumnValues(getHistorySheet(), COL_HISTORY_EVENTID);
}

function isCodeRencontreInHistory(codeRencontre) {
  return getCodesRencontreFromHistory().some(function (code) { return code===codeRencontre });
}

function convertCodeRencontreToEventId(codeRencontre){
  return getEventIdsFromHistory()[getCodesRencontreFromHistory().indexOf(codeRencontre)];
}

function convertCodeRencontreToCategorie(codeRencontre){
  return getCategoriesFromHistory()[getCodesRencontreFromHistory().indexOf(codeRencontre)];
}

function deleteCodeRencontreInHistory(codeRencontre) {
  return getHistorySheet().deleteRow(getCodesRencontreFromHistory().indexOf(codeRencontre)+1);
}
