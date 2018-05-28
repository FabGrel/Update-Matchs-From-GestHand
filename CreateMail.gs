// Fonction permettant de récupérer le destinataire du mail correspondant à la catégorie passée en paramètre ( selon le fichier parametrage )
function getRecipient(categorieMatch) {
  var recipient;
  var values = categoriesSheet.getDataRange().getDisplayValues();
  for (var row = 1; row < values.length; row++) {
    if (values[row][COL_PARAM_CATEGORIE] == categorieMatch) {
      recipient = values[row][COL_PARAM_EMAIL];
    }
  }
  return recipient;
}

function getSubjectMail(param, categorieMatch, dateMatch) {
  var subject;
  var timeZone = Session.getScriptTimeZone();
  var values = paramSheet.getDataRange().getDisplayValues();
  for (var row = 1; row < values.length; row++) {
    if (values[row][0] == param) {
      subject = values[row][1];
    }
  }
  return Utilities.formatString(subject, categorieMatch, Utilities.formatDate(new Date(dateMatch), timeZone, 'dd/MM/yyyy'));
}

function getBodyMail(templateMail, categorieMatch, libelleMatch, libelleAdresse, dateMatch, codeRencontre, changes) {
  var timeZone = Session.getScriptTimeZone();
  var body = templateMail.getBody().getText();
  return Utilities.formatString(body, categorieMatch, libelleMatch, Utilities.formatDate(new Date(dateMatch), timeZone, 'dd/MM/yyyy à HH:mm'), libelleAdresse, changes);
}