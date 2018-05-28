function import() {
  const pagedata = UrlFetchApp.fetch('http://gesthand-extraction.ff-handball.org/export_csv.php?section=competition&type=rencontre&joue=0&week=2018-18&perimetre=0&csv',{headers: {'User-Agent': 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                 Cookie: 'PHPSESSID=pv4i2hv3a8cjktnhcgqkuon427'}});
  Logger.log(pagedata);
  //var response = UrlFetchApp.fetch('http://gesthand-extraction.ff-handball.org/index.php?section=competition&type=rencontre');  
  
  // Generation des logs dans un Document dédié
  flushLogs();
}
