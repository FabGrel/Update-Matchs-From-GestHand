function getCategoriesFromCategoriesSheet() {
  var categoriesSheet = SpreadsheetApp.openById('14IvtircE1hfTek4_K7q59eXl67l2-JRnS5WOn5tkqFg').getSheetByName('Categories');
  const COL_PARAM_CATEGORIE = 0;
  return getColumnValues(categoriesSheet, COL_PARAM_CATEGORIE);
}

function getCalendarNamesFromCategoriesSheet() {
  var categoriesSheet = SpreadsheetApp.openById('14IvtircE1hfTek4_K7q59eXl67l2-JRnS5WOn5tkqFg').getSheetByName('Categories');
  const COL_PARAM_CALENDAR_NAMES = 1;
  return getColumnValues(categoriesSheet, COL_PARAM_CALENDAR_NAMES);
}

function convertCategorieToCalendarName(categorie) {
  return getCalendarNamesFromCategoriesSheet()[return getCategoriesFromCategoriesSheet().indexOf(categorie)];
}
