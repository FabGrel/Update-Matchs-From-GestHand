var categoriesSheet = SpreadsheetApp.openById('14IvtircE1hfTek4_K7q59eXl67l2-JRnS5WOn5tkqFg').getSheetByName('Categories');
var historySheet = SpreadsheetApp.openById('14IvtircE1hfTek4_K7q59eXl67l2-JRnS5WOn5tkqFg').getSheetByName('History');
var paramSheet = SpreadsheetApp.openById('14IvtircE1hfTek4_K7q59eXl67l2-JRnS5WOn5tkqFg').getSheetByName('Params');
var dataSheet = SpreadsheetApp.openById('1JUQNjHPvGJSAdIRagJS2PBT9Lqk_bC8frZsLKhCC3Xg');
var logger = DocumentApp.openById('1eFkO5fuYV-YU5MiiIBpgG9wkHQPFb_y3HPXcXeypoBc');
var templateMailNewMatch = DocumentApp.openById('1VT5utk9jDMM0ML1nXSGXisVIJnK6MGNhwIti1hHF97w');
var templateMailChangedMatch = DocumentApp.openById('1zwR66F_4qeXPZhWBlVpWKo4K7eBGrPoSVX_BpHodLtw');

var PARAM_SUBJECT_NEWMATCH = 'SubjectMailNewMatch';
var PARAM_SUBJECT_CHANGEDMATCH = 'SubjectMailChangedMatch';

var COL_PARAM_CATEGORIE = 0;
var COL_PARAM_NAME = 1;
var COL_PARAM_EMAIL = 2;

var COL_HISTORY_CODERENCONTRE = 0;
var COL_HISTORY_CATEGORIE = 1;
var COL_HISTORY_DATE = 2;
var COL_HISTORY_EVENTID = 3;

var COL_DATA_CATEGORIE = 2;
var COL_DATA_HEURE = 6;
var COL_DATA_DATE = 5;
var COL_DATA_HOTE = 7;
var COL_DATA_VISITEUR = 8;
var COL_DATA_CODERENCONTRE = 14;
var COL_DATA_SALLE = 15;
var COL_DATA_ADRESSE = 16;
var COL_DATA_CP = 17;
var COL_DATA_VILLE = 18;