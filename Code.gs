function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'dropdowns') {
    return ContentService.createTextOutput(JSON.stringify(getDropdowns()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ error: 'unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var fd = JSON.parse(e.postData.contents);
    var result = submitForm(fd);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getDropdowns() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = ss.getSheetByName('Config');
  const lastRow = config.getLastRow();
  if (lastRow < 2) return { warping: [], weaving: [], yarn: [] };
  const data = config.getRange(2, 1, lastRow - 1, 3).getValues();
  return {
    warping: data.map(function(r) { return r[0]; }).filter(Boolean),
    weaving: data.map(function(r) { return r[1]; }).filter(Boolean),
    yarn:    data.map(function(r) { return r[2]; }).filter(Boolean)
  };
}

function testGetDropdowns() {
  const result = getDropdowns();
  Logger.log('warping count: ' + result.warping.length);
  Logger.log('weaving count: ' + result.weaving.length);
  Logger.log('yarn count:    ' + result.yarn.length);
  Logger.log(JSON.stringify(result));
}

function submitForm(fd) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Data');
  const inOut = fd.docType === '2.盤頭領料上機' ? '出庫' : '入庫';
  const weight = fd.docType === '2.盤頭領料上機'
    ? -(Math.abs(parseFloat(fd.weight) || 0))
    : (parseFloat(fd.weight) || 0);
  sheet.appendRow([
    new Date(),
    fd.dept,
    fd.docType,
    inOut,
    fd.worker,
    fd.yarn,
    fd.warpCount || '',
    fd.bobbinNo,
    weight,
    fd.length   || '',
    fd.lot      || '',
    fd.machine  || '',
    fd.scale    || ''
  ]);
  return { success: true };
}

function testSubmitForm() {
  const sample = {
    dept:      '織一',
    docType:   '1.整經盤頭生產',
    worker:    '01507-Huỳnh Văn Khương黃文康',
    yarn:      '280D-NK',
    warpCount: '100',
    bobbinNo:  'B001',
    weight:    '5.5',
    length:    '1000',
    lot:       'L001',
    machine:   '',
    scale:     ''
  };
  const result = submitForm(sample);
  Logger.log(JSON.stringify(result));
}
