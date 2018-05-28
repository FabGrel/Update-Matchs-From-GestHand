// Permet de supprimer des agendas Google tous les événements présents dans le fichier Gest'Hand. 
// Utile notamment si une erreur est survenue, ou pour faire du debug.
function reInitEventsv2() {
  Logger.log("Réinitialisation des agendas");
 
  const COL_DATA_CATEGORIE = 2;
  const COL_DATA_CODERENCONTRE = 14;
  const COL_PARAM_NAME = 1;
  
  var categorieMatch;
  var codeRencontre;
  
  // 
  var range = dataSheet.getDataRange();
  var values = range.getDisplayValues();
  
  // On récupère les codes rencontres du fichier FFHB
  const codesRencontre = getColumnValues(dataSheet, COL_DATA_CODERENCONTRE);
  const categories = getColumnValues(dataSheet, COL_DATA_CATEGORIE).map(formatCategorie);
  const calendarNames = getColumnValues(dataSheet, COL_PARAM_NAME);
  
  // TODO : Stocker le nom du calendrier pour chaque ligne dans le fichier History
  
  // Pour chaque codeRencontre, on vérifie s'il est présent dans l'historique et  
  const eventIds = codesRencontre
  .filter(isCodeRencontreInHistory)
    
  // si c'est le cas, récupère l'id du calendrier  
  .map(convertCodeRencontreToEventId);  
  
  //pour le supprimer et le supprimer de l'historique
  //.map(deleveEvent);
  
  
/*  for (var row = 1; row < values.length; row++) {
    categorieMatch = formatCategorie(values[row][COL_DATA_CATEGORIE]);
    codeRencontre = values[row][COL_DATA_CODERENCONTRE];
    
    var calendar = CalendarApp.getCalendarsByName(getCalendarNameFromCategorie(categorieMatch));
    
    var rowIndex = getHistoryRowIndexForCodeRencontre(codeRencontre);
    var event;
    
    if ( rowIndex > 0 ) {
      //deleteEvent(calendar[0], codeRencontre);
    }
  }
  
  Logger.log('Nombre de suppressions effectuées : %s', countDelete);
  */
  
  Logger.log(resultat);
  
  flushLogs();
}


// Récuperation du nom de l'agenda à partir de la catégorie passée en paramètre, selon le fichier Params
function getCalendarNameFromCategorie(categorie) {
  var values = categoriesSheet.getDataRange().getDisplayValues();
  var calendarName = '';
  for (var row = 1; row < values.length; row++) {
    if (values[row][COL_PARAM_CATEGORIE] == categorie) {
      calendarName = values[row][COL_PARAM_NAME];
    }
  }
  return calendarName;
}

// Extrait la catégorie à partir d'une chaine de caractère représentant la compétition
function formatCategorie (categorieMatch) { 
  if (categorieMatch.indexOf("mas")>0) {
    categorieMatch = categorieMatch.substring(categorieMatch.indexOf("mas")-4, categorieMatch.length);
  } else if( categorieMatch.indexOf("fem")>0) {
    categorieMatch = categorieMatch.substring(categorieMatch.indexOf("fem")-4, categorieMatch.length);
  }
  return categorieMatch;
}

/* Fonction permettant la suppression d'un événement dans la calendrier. 
Supprimer également l'entrée dans le fichier historique */
function deleteEventInGoogleCalendar(calendar, codeRencontre) {
  var rowIndex = getHistoryRowIndexForCodeRencontre(codeRencontre);
  var eventID = getEventIdForHistoryRowIndex(rowIndex);
  
  // Si un code a été trouvé, on supprime l'événement de l'agenda, et on le supprime du fichier historique.
  var event = calendar.getEventById(eventID);
  Logger.log('Suppression event %s et codeRencontre %s', eventID, codeRencontre);
  event.deleteEvent();
  historySheet.deleteRow(rowIndex+1);
  countDelete = countDelete +1;
}

function isCodeRencontreInHistory(codeRencontre) {
  const historySheet = SpreadsheetApp.openById('14IvtircE1hfTek4_K7q59eXl67l2-JRnS5WOn5tkqFg').getSheetByName('History');
  const COL_HISTORY_CODERENCONTRE = 1;
  return getColumnValues(historySheet, COL_HISTORY_CODERENCONTRE).some(function (code) { return code===codeRencontre });
}

// GoogleSheet,
// (dataSheet: DataSheet, columnName: string) => ['MAFOIJ','QPSOKD', 'QSJQKD']
function getColumnValues(dataSheet, columnName){
  const range = dataSheet.getDataRange();
  const rows = range.getDisplayValues();
  return rows.map(function(row){return row[columnName]});
}

// codeRencontre -> id_event
function convertCodeRencontreToEventId(codeRencontre){
  const historySheet = SpreadsheetApp.openById('14IvtircE1hfTek4_K7q59eXl67l2-JRnS5WOn5tkqFg').getSheetByName('History');
  const COL_HISTORY_CODERENCONTRE = 1;
  const COL_HISTORY_EVENTID = 2;
  
  const codesRencontre = getColumnValues(historySheet, COL_HISTORY_CODERENCONTRE);
  const eventIds = getColumnValues(historySheet, COL_HISTORY_EVENTID);
  
  return eventIds[codesRencontre.indexOf(codeRencontre)];
}

/* Fonction permettant la suppression d'un événement dont l'indice de la ligne dans le fichier history est passé en paramètre.
Supprimer également l'entrée dans le fichier historique 
// (calender, f(): event) : bool
function deleteEvent(calendar, eventID) {
  // Si un code a été trouvé, on supprime l'événement de l'agenda, et on le supprime du fichier historique.
  var event = calendar.getEventById(eventID);
  if(!event){
    return false;
  }
  event.deleteEvent();
  return true;
}

const codeRencontres = ['MAFOIJ','QPSOKD', 'QSJQKD','QQQOISJD'];


function getCodeRencontre(dataSheet, ){
  return getColumnValues(dataSheet, 'codeRencontre');
}

const deleteStatus = codeRencontres
  .filter((codeRencontre) => getCodeRencontre(dataSheet).some(function(cell){return cell === codeRencontre})
  // Array[codeRencontre] -> Array[id_event]
  .map((codeRencontre) => [codeRencontre, convertCodeRencontreToEventId(codeRencontre)])
  .map(function([codeRencontre, eventId]){
  return [codeRencontre, eventId, deleteEvent(calendar, eventId)];
});

// [['MAFOIJ', 'oqisdj@sodij', true], ['QPSOKD', eventId, true], ['QSJQKD', eventId, true], ['QQQOISJD', eventId, true], 
deleteStatus.forEach(([codeRencontre, eventID, isSuccess]) => Logger.log('Suppression event %s et codeRencontre %s', eventID, codeRencontre))

// deleteStatus = [true, true, true, false]
const successCount = deleteStatus.filter(function([codeRencontre, eventID, isSuccess]){return isSuccess === true}).length;*/