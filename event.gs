// (calender, 'v6t4hlo6erq4da4jd765c6oknk@google.com') : bool
function deleteEvent(calendar, eventID) {
  // Si un code a été trouvé, on supprime l'événement de l'agenda
  var event = calendar.getEventById(eventID);
  if(!event){
    return false;
  }
  event.deleteEvent();
  return true;
}
