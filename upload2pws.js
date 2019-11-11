/**
  ##########         EXPORT2PWS          ##########
  Wetterinformationen an die eigene PWS Station bei Wetaher Wndergrround senden
  AUfbau nach https://feedback.weather.com/customer/en/portal/articles/2924682-pws-upload-protocol?b_id=17298

  01.11.2019:   V0.0.1  Initialrelease (quick&ditry)
  06.11.2019:   v0.1.0  Code funktional überarbeitet
  11.11.2019:   V0.1.1  Datenpunkt UV Index angepasst

  todo:


  Author: CKMartens (carsten.martens@outlook.de)
  License: GNU General Public License V3, 29. Juni 2007
**/

/**
  ##########         Variablen          ##########
**/

var CRON                      = 5;                                              // Alle wieviele Minuten soll das Hauptcron laufen?
var LOGGING                   = true;                                           // Ausgabe in Console-Log
var request                   = require('request');

var PWS_ID                    = '';                                     // ID der PWS Station
var PWS_PW                    = '';                                     // Passwort der PWS SHtation
var PWS_ACT                   = 'action=updateraw';                             // Updatebefehl für PWS_ID

const DP_T                    = 'hm-rega.0.1467';
const DP_H                    = 'hm-rega.0.1468';
const DP_W                    = 'hm-rega.0.1470';
const DP_WDIR                 = 'hm-rega.0.1472';
const DP_B                    = 'hm-rega.0.1469';
const DP_D                    = 'hm-rega.0.1475';
const DP_RD                   = 'hm-rega.0.1486';
const DP_RN                   = 'hm-rega.0.1485';
const DP_G                    = 'hm-rega.0.1471';
const DP_UV                   = 'javascript.1.Wetterdaten.Solardaten.UV_Index';
const DP_SR                   = 'hm-rega.0.1652';
const DP_PM10                 = 'luftdaten.0.192_168_178_81.SDS_P1';
const DP_PM25                 = 'luftdaten.0.192_168_178_81.SDS_P2';

/**
  ##########         Funktionen          ##########
**/

function export2pws() {
  let dateutc = 'now';
  let t = (getState(DP_T).val * 1.8) + 32;
  let b = getState(DP_B).val * 0.02952998751;
  let h = getState(DP_H).val;
  let wdir = getState(DP_WDIR).val;
  let w = getState(DP_W).val * 2.2369362921;
  let g = getState(DP_G).val * 2.2369362921;
  let rd = getState(DP_RD).val * 0.0393701;
  let rn = getState(DP_RN).val * 0.0393701;
  let d = (getState(DP_D).val + 1.8) + 32;
  let sr = getState(DP_SR).val;
  let uv = getState(DP_UV).val;
  let pm25 = getState(DP_PM25).val;
  let pm10 = getState(DP_PM10).val;

  let URL = 'http://weatherstation.wunderground.com/weatherstation/updateweatherstation.php?' + PWS_ACT;
  URL += '&ID=' + PWS_ID;
  URL += '&PASSWORD=' + PWS_PW;
  URL += '&dateutc=now';
  URL += '&winddir=' + wdir;
  URL += '&windspeedmph=' + w;
  URL += '&windgustmph=' + g;
  URL += '&humidity=' + h;
  URL += '&dewptf=' + d;
  URL += '&tempf=' + t;
  URL += '&rainin=' + rn;
  URL += '&dailyrainin=' + rd;
  URL += '&baromin=' + b;
  URL += '&solarradiation=' + sr;
  URL += '&UV=' + uv;
  URL += '&AqPM2.5=' + pm25;
  URL += '&AqPM10=' + pm10;

  let CURLURL = "curl '" + URL + "'";
  exec(CURLURL, function (error, result, stderr) {
        console.log(result);
  });
}

schedule("*/5 * * * *", function () {
    export2pws();
});

export2pws();
