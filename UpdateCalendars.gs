var countDelete = 0;
var countCreate = 0;  

// Permet de supprimer des agendas Google tous les événements présents dans le fichier Gest'Hand. 
// Utile notamment si une erreur est survenue, ou pour faire du debug.
function reInitEvents() {
  Logger.log("Réinitialisation des agendas");
 
  var categorieMatch;
  var codeRencontre;
  
  var range = dataSheet.getDataRange();
  var values = range.getDisplayValues();
  
  for (var row = 1; row < values.length; row++) {
    categorieMatch = formatCategorie(values[row][COL_DATA_CATEGORIE]);
    codeRencontre = values[row][COL_DATA_CODERENCONTRE];
    
    var calendar = CalendarApp.getCalendarsByName(getCalendarNameFromCategorie(categorieMatch));
    
    var rowIndex = getHistoryRowIndexForCodeRencontre(codeRencontre);
    var event;
    
    if ( rowIndex > 0 ) {
      deleteEvent(calendar[0], codeRencontre);
    }
  }
  Logger.log('Nombre de suppressions effectuées : %s', countDelete);
  
  flushLogs();
}

// Fonction principale qui permet de lancer la mise à jour des agendas de toutes les équipes à partir des données de la FFHB dans le fichier Excel.
function updateCalendars() {
  Logger.log("Démarrage de la mise à jour");

  var range = dataSheet.getDataRange();
  var values = range.getDisplayValues();

  if (range.getNumRows() < 1) {
    Logger.log('ERREUR : fichier vide !');
    // TODO : M'envoyer un mail
  } else {
    var libelleDateMatch;
    var categorieMatch;
    var libelleAdresse;
    var heureMatch;
    var libelleMatch;
    var codeRencontre;
    
    for (var row = 1; row < values.length; row++) {
      // Pour chaque ligne du fichier dont la conclusion de match existe
      // Récupération des colonnes catégorie, date/heure, hote/visiteur, adresse 
      categorieMatch = formatCategorie(values[row][COL_DATA_CATEGORIE]);
      libelleDateMatch = values[row][COL_DATA_DATE] + " " + values[row][COL_DATA_HEURE];
      libelleAdresse = values[row][COL_DATA_SALLE] + " " + values[row][COL_DATA_ADRESSE] + " " + values[row][COL_DATA_CP] + " " + values[row][COL_DATA_VILLE];
      libelleMatch = values[row][COL_DATA_HOTE] + " / " + values[row][COL_DATA_VISITEUR];
      codeRencontre = values[row][COL_DATA_CODERENCONTRE];
      
      var calendar = CalendarApp.getCalendarsByName(getCalendarNameFromCategorie(categorieMatch));
      
      // Si le match existe déjà dans l'agenda, et qu'il y a eu un changement depuis, on le supprime de l'agenda pour le recréer ensuite 
      var changes = getChanges(calendar[0], categorieMatch, libelleMatch, libelleAdresse, libelleDateMatch, codeRencontre);
      if (changes.length > 0) {
        deleteEvent(calendar[0], codeRencontre); 
      }
      
      // Si une date de match est positionnée et que le match n'existe pas déjà, on crée le match 
      var dateMatch = parseDateHeure(libelleDateMatch);
      
      if (existsDate(dateMatch)===true && !isRencontreAlreadyInHistory(codeRencontre)) {
        // Création d'un nouvel événement dans l'agenda de la catégorie concernée 
        var event = createEvent(calendar[0], categorieMatch, libelleMatch, libelleAdresse, dateMatch, codeRencontre);
        
        // sendMail(changes, categorieMatch, libelleMatch, libelleAdresse, dateMatch, codeRencontre);
      }
    }
  }
  Logger.log('Nombre de suppressions effectuées : %s', countDelete);
  Logger.log('Nombre de créations effectuées : %s', countCreate);
  Logger.log("Fin de la mise à jour");
    
  flushLogs();
}


/* Permet de déterminer si quelquechose a changé entre les données recues de la FFHB et l'événement précédemment créé.
Si l'événement n'existe pas déjà, retourne un tableau vide 
Entrée : des chaines de caractères
Sortie : Un tableau contenant une liste de chaines avec les changements 
*/
function getChanges(calendar, categorieMatch, libelleMatch, libelleAdresse, dateMatch, codeRencontre) {
  var changeTable = new Array();
  
  if ( isRencontreAlreadyInHistory(codeRencontre) ) {
    var eventId = getEventIdForHistoryRowIndex(getHistoryRowIndexForCodeRencontre(codeRencontre));
    var event = calendar.getEventById(eventId);
    var location = event.getLocation();
    var startTime = event.getStartTime();
    var title = event.getTitle();
    var newTitle = createEventTitle(categorieMatch, libelleMatch);
    
    var index = 0;
    
    var changedTitle = title != newTitle;
    if (changedTitle) {
      changeTable[index] = Utilities.formatString('Un changement a eu lieu sur le titre de %s vers %s\n', title, newTitle);
      Logger.log(changeTable[index] );
      index = index + 1;
    }
    
    var changedDate = (new Date(startTime)).getTime() != (new Date(dateMatch)).getTime();
    if (changedDate) {
      changeTable[index] = Utilities.formatString('Un changement a eu lieu sur la date de %s vers %s\n', startTime, dateMatch);
      Logger.log(changeTable[index] );
      index = index + 1;
    }
    
    var changedLocation = location != libelleAdresse;
    if (changedLocation) {
      changeTable[index] = Utilities.formatString('Un changement a eu lieu sur le lieu de %s vers %s\n', location, libelleAdresse);
      Logger.log(changeTable[index] );
      index = index + 1;
    }
  }

  return changeTable;
}
/*Fonction permettant la suppression d'un événement dont l'indice de la ligne dans le fichier history est passé en paramètre.
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

// codeRencontre -> id_event
function convertCodeRencontreToEventId(historySheet, codeRencontre){
  return getEventIdForHistoryRowIndex(getHistoryRowIndexForCodeRencontre(historySheet, codeRencontre));
}

// GoogleSheet,
// (dataSheet: DataSheet, columnName: string) => ['MAFOIJ','QPSOKD', 'QSJQKD']
function getColumnValues(dataSheet, columnName){
  const range = dataSheet.getDataRange();
  const rows = range.getDisplayValues();
  return rows.map((a, row) => row[columnName]); // lambda
  return rows.map(function(row){return row[columnName]}); // function anonyme
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
const successCount = deleteStatus.filter(function([codeRencontre, eventID, isSuccess]){return isSuccess === true}).length;
*/