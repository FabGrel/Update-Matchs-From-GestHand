function testParseDate() {
  const dateOk = "26/05/2018 15:00:00";
  const dateko1 = "2605/2018 15:00:00";
  const dateko2 = "26/052018 15:00:00";
  const dateko3 = "26/05/201815:00:00";
  const dateko4 = "26/05/2018 1500:00";
  Logger.log(parseDateHeure(dateOk));
  Logger.log(parseDateHeure(dateko1));
  Logger.log(parseDateHeure(dateko2));
  Logger.log(parseDateHeure(dateko3));
  Logger.log(parseDateHeure(dateko4));
  flushLogs();
}

function test() {
  const pattern = "[0-2][0-9]/[0-1][0-9]/2018 [0-1][0-9]:[0-5][0-9]:[0-5][0-9]";
  const date1 = "26/05/2018 15:00:00";
  const date2 = "26052018 15:00:00";
  const date3 = "26/05/2017 15:00:00";
  const date4 = "98/05/2018 15:00:00";
  
  const date5 = "98/05/2018 150000";
  const date6 = "98/05/2018 25:00:00";
  const date7 = "98/05/2018 15:68:00";
  Logger.log((new RegExp(pattern)).test(date1));
  Logger.log((new RegExp(pattern)).test(date2));
  Logger.log((new RegExp(pattern)).test(date3));
  Logger.log((new RegExp(pattern)).test(date4));
  Logger.log((new RegExp(pattern)).test(date5));
  Logger.log((new RegExp(pattern)).test(date6));
  Logger.log((new RegExp(pattern)).test(date7));
  flushLogs();
}