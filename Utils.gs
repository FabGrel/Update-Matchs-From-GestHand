/*------------------------------------------------------------------------------------------------------



FONCTIONS SECONDAIRES ( ie : qui ne sont pas à lancer directement, mais uniquement appelées 
par des fonctions principales )



------------------------------------------------------------------------------------------------------*/

// ["26/05/2018 15:00:00"] => Objet date, null si date mal formatée
function parseDateHeure(date) {
  const regExp = new RegExp("[0-2][0-9]/[0-1][0-9]/2018 [0-2][0-9]:[0-5][0-9]:[0-5][0-9]");
  if (regExp.test(date)) {
    const stringHoraire = date.substring(10);
    const stringDate = date.substring(0,10);
    
    const jour = stringDate.split("/")[0];
    const mois = stringDate.split("/")[1] - 1;
    const annee = stringDate.split("/")[2];
    
    const heure = stringHoraire.split(":")[0];
    const minute = stringHoraire.split(":")[1];
    const seconde = stringHoraire.split(":")[2];
    var date = new Date(annee, mois, jour, heure, minute, seconde)
    return (date);
  } else {
    return null;
  }
}

// Fonction qui vérifie si la date passée en paramètre existe et n'est pas une valeur par défaut
function existsDate(date) {
  return (date!=null) && ((date.getTime()) > 0);
}

// Recherche si le match a déjà été créé dans le fichier historique
function isRencontreAlreadyInHistory(codeRencontre) {
  var values = historySheet.getDataRange().getValues();
  // Recherche de la rencontre dont le code est passé en paramètre
  for (var row = 1; row < values.length; row++) {
    if (values[row][COL_HISTORY_CODERENCONTRE] == codeRencontre) {
      return true;
    }
  }
  return false;
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

function createEventTitle(categorieMatch,libelleMatch) {
  return categorieMatch + ' | ' + libelleMatch;
}

/* Creation d'un événement dans un calendrier. La création d'un événement crée également une entrée dans le fichier historique
@calendar : un calendrier Google
@categorieMatch : Chaine de caractère
@libelleMatch : Chaine de caractère
@libelleAdresse : Chaine de caractère
@DateMatch : Date au format Date
@codeRencontre : Chaine de caractère
*/
function createEvent(calendar, categorieMatch, libelleMatch, libelleAdresse, dateMatch, codeRencontre) {
  if (calendar != null && dateMatch!= null && codeRencontre.length > 0) { 
    var compteur = 0;
    var date = dateMatch;
    var DUREE_MATCH = 1000 * 60 * 90;
    var event = calendar.createEvent(createEventTitle(categorieMatch,libelleMatch), date, new Date(date.getTime() + DUREE_MATCH), {location:libelleAdresse});
    historySheet.appendRow([codeRencontre, categorieMatch, dateMatch, event.getId()]);
    Logger.log('création du match %s %s le %s avec code %s', categorieMatch, libelleMatch, dateMatch, codeRencontre);
    countCreate = countCreate +1;
    return event;
  } else {
    return null;
  }
}

// Retourne l'indice de la ligne du fichier History correspondant au code de rencontre passé en paramètre. 0 si le code n'est pas trouvé. 
function getHistoryRowIndexForCodeRencontre(codeRencontre) {
  var values = historySheet.getDataRange().getValues();
  var retour=-1;
  // Recherche de la rencontre dont le code est passé en paramètre
  for (var row = 1; row < values.length; row++) {
    if (values[row][COL_HISTORY_CODERENCONTRE] == codeRencontre) {
      return row;
    }
  }
  return retour;
}

function getEventIdForHistoryRowIndex(rowIndex) {
  var values = historySheet.getDataRange().getValues();
  return values[rowIndex][COL_HISTORY_EVENTID];
}

function getCodeRencontreforHistoryRowIndex(rowIndex) {
  var values = historySheet.getDataRange().getValues();
  return values[rowIndex][COL_HISTORY_CODERENCONTRE];
}

/* Fonction permettant la suppression d'un événement dont l'indice de la ligne dans le fichier history est passé en paramètre. 
Supprimer également l'entrée dans le fichier historique */
function deleteEvent(calendar, codeRencontre) {
  var rowIndex = getHistoryRowIndexForCodeRencontre(codeRencontre);
  var eventID = getEventIdForHistoryRowIndex(rowIndex);
  
  // Si un code a été trouvé, on supprime l'événement de l'agenda, et on le supprime du fichier historique.
  var event = calendar.getEventById(eventID);
  Logger.log('Suppression event %s et codeRencontre %s', eventID, codeRencontre);
  event.deleteEvent();
  historySheet.deleteRow(rowIndex+1);
  countDelete = countDelete +1;
}

// Fonction supprimant toutes les entrées du fichier historique dont la date est passée. Le calendrier Google n'est pas modifié. 
function cleanHistory() {
  var date = new Date();
  Logger.log('Date du jour : %s', date);
  var values = historySheet.getDataRange().getValues();
  
  for (var row = 1; row < values.length; row++) {
    var historyDate = new Date(values[row][COL_HISTORY_DATE]);
    var codeRencontre = values[row][COL_HISTORY_CODERENCONTRE]
    if (historyDate.getTime() < date.getTime()) {
      historySheet.deleteRow(row+1);
      Logger.log('Suppression de l\'historique %s pour code %s', historyDate, codeRencontre); 
    }
  }
}

function flushLogs() {
  // Generation des logs dans un Document dédié
  var body = logger.getBody();
  body.appendParagraph(Logger.getLog());
}