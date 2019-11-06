/**
  ##########         WEATHERCALC          ##########
  Wetterinformationen Berechnen

  01.11.2019:   V0.0.1  Initialrelease (quick&ditry)
  06.11.2019:   v0.1.0  Code funktional überarbeitet
  06.11.2019:   v0.1.1  Berechnung Solar Radiation hinzugefüget

  todo:
    erweitertes Logging integrieren

  Author: CKMartens (carsten.martens@outlook.de)
  License: GNU General Public License V3, 29. Juni 2007
**/

/**
  ##########         Variablen          ##########
**/

var CRON                      = 5;                                              // Alle wieviele Minuten soll das Hauptcron laufen?
var LOGGING                   = true;                                           // Ausgabe in Console-Log

var ELEMENTS                  = Math.round(360 / CRON);                         // Für 3 Stunden werden X Elemente berechnet
var A_BAROTRENDDATA           = [];
var A_BAROTRENDTEMPDATA       = [];
var A_TEMPTRENDDATA           = [];
var A_TEMPTRENDTEMPDATA       = [];


/**
  ##########         Pfade          ##########
**/
const JSPATH                  = 'javascript.1.';
const PATH                    = JSPATH + 'Wetterdaten.';
const PATH_BAROTREND          = PATH + 'Luftdruck.Barotrend.';
const PATH_TEMPTREND          = PATH + 'Temperatur.Temptrend.';
const PATH_STATISTIK          = PATH + 'Statistik.';

const DP_BAROTREND_DATA       = PATH_BAROTREND + 'baro_data';
const DP_BAROTREND_TREND      = PATH_BAROTREND + 'baro_trend';
const DP_BAROTREND_ALT        = PATH_BAROTREND + 'baro_alt';

const DP_TEMPTREND_DATA       = PATH_TEMPTREND + 'temp_data';
const DP_TEMPTREND_TREND      = PATH_TEMPTREND + 'temp_trend';
const DP_TEMPTREND_ALT        = PATH_TEMPTREND + 'temp_alt';

const DP_TEMP_MITTEL          = PATH_STATISTIK + 'Temperatur.temp_mittel';
const DP_TEMP_MITTEL_DATA     = PATH_STATISTIK + 'Temperatur.tagesmittel_data';

const DP_REGEN_MONAT          = PATH_STATISTIK + 'Regen.monatsmittel';
const DP_REGEN_JAHR           = PATH_STATISTIK + 'Regen.jahresmittel';

const DP_TEMP_MAX             = PATH_STATISTIK + 'Temperatur.max';
const DP_TEMP_MAX_ZEIT        = PATH_STATISTIK + 'Temperatur.max_std';
const DP_TEMP_MIN             = PATH_STATISTIK + 'Temperatur.min';
const DP_TEMP_MIN_ZEIT        = PATH_STATISTIK + 'Temperatur.min_std';

const DP_WIND_MAX             = PATH_STATISTIK + 'Wind.wind_max';
const DP_WIND_MAX_ZEIT        = PATH_STATISTIK + 'Wind.wind_max_std';

const DP_GUST_MAX             = PATH_STATISTIK + 'Wind.guest_max';
const DP_GUST_MAX_ZEIT        = PATH_STATISTIK + 'Wind.guest_max_std';

const DP_BARO_MAX             = PATH_STATISTIK + 'Luftdruck.max';
const DP_BARO_MAX_ZEIT        = PATH_STATISTIK + 'Luftdruck.max_std';
const DP_BARO_MIN             = PATH_STATISTIK + 'Luftdruck.min';
const DP_BARO_MIN_ZEIT        = PATH_STATISTIK + 'Luftdruck.min_std';

const DP_TEMP_GEF             = PATH_STATISTIK + 'Temperatur.apparent_temp';
const DP_TEMP_HI              = PATH_STATISTIK + 'Temperatur.heatindex';
const DP_TEMP_HUI             = PATH_STATISTIK + 'Temperatur.humidex';

const DP_T                    = 'hm-rega.0.1467';
const DP_F                    = 'hm-rega.0.1468';
const DP_W                    = 'hm-rega.0.1470';
const DP_B                    = 'hm-rega.0.1469';
const DP_D                    = 'hm-rega.0.1475';
const DP_R                    = 'hm-rega.0.1486';
const DP_G                    = 'hm-rega.0.1471';
const DP_SDT                  = 'hm-rega.0.1488';
const DP_SDM                  = 'hm-rega.0.1653';
const DP_SR                   = 'hm-rega.0.1652';
/**
  ##########         Datenpunkte          ##########
**/
if (isState(DP_REGEN_JAHR) == false) {
  if (LOGGING) console.log('Weathercalc: Datenpunkte werden angelegt');
  /*
   * DP für Barometertrend erstellen
   */
   createState(DP_BAROTREND_DATA, {
     'name': 'Daten für den Barometertrend',
     'desc': 'Differenz der Barometerdaten zur Ermittlung des Trends',
     'type': 'array',
     'read': 'true',
     'write': 'true',
     'role': 'value',
   });
   createState(DP_BAROTREND_TREND, {
     'name': 'Barometertrend',
     'desc': 'Der Barometertrend der letzten drei Stunden',
     'type': 'number',
     'read': true,
     'write': true,
     'role': 'value',
     'min': 0,
     'max': 1300,
     'def': 0,
      'unit': 'hPa',
   });
   createState(DP_BAROTREND_ALT, {
     'name': 'letzter Barometerwert',
     'desc': 'Der letzte gespeicherte Barometerwert zur Ermittelung der Differenz zum neuen Wert',
     'type': 'number',
     'read': true,
     'write': true,
     'role': 'value',
     'min': 0,
     'max': 1300,
     'def': 0,
      'unit': 'hPa',
   });
   /*
    * DP für Temperaturtrend erstellen
    */
    createState(DP_TEMPTREND_DATA, {
      'name': 'Daten für den Temperaturtrend',
      'desc': 'Differenz der Temperaturdaten zur Ermittlung des Trends',
      'type': 'array',
      'read': true,
      'write': true,
      'role': 'value',
    });
    createState(DP_TEMPTREND_TREND, {
      'name': 'Temperaturtrend',
      'desc': 'Der Temperaturtrend der letzten drei Stunden',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': -50,
      'max': 50,
      'def': 0,
      'unit': 'C',
    });
    createState(DP_TEMPTREND_ALT, {
      'name': 'letzter Temperaturwert',
      'desc': 'Der letzte gespeicherte Temperaturwert zur Ermittelung der Differenz zum neuen Wert',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': -50,
      'max': 50,
      'def': 0,
      'unit': 'C',
    });
   /*
    * DP für Statistik erstellen
    */
    createState(DP_TEMP_MITTEL, {
      'name': 'Tages-Temperaturmittelwert',
      'desc': 'Der Mittelwert der Temperatur für den vergangenen Tag',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': -50,
      'max': 50,
      'def': 0,
      'unit': 'C',
    });
    createState(DP_TEMP_MITTEL_DATA, {
      'name': 'Stundenwerte',
      'desc': 'Der Temperaturwert der jeweils vollen Stunde',
      'type': 'array',
      'read': true,
      'write': true,
      'role': 'value',
    });
    createState(DP_TEMP_MAX, {
      'name': 'Höchsttemperatur des Tages',
      'desc': 'Der höchste Temperaturwert des Tages',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': -50,
      'max': 50,
      'def': -50,
      'unit': 'C',
    });
    createState(DP_TEMP_MAX_ZEIT, {
      'name': 'Zeit der Höchsttemperatur des Tages',
      'desc': 'Wann (SS:MM) war die Höchsttemperatur des Tages',
      'type': 'string',
      'read': true,
      'write': true,
      'role': 'value',
      'def': '00:00',
    });
    createState(DP_TEMP_MIN, {
      'name': 'Niedrigste Temperatur des Tages',
      'desc': 'Der niedrigeste Temperaturwert des Tages',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': -50,
      'max': 50,
      'def': 50,
      'unit': 'C',
    });
    createState(DP_TEMP_MIN_ZEIT, {
      'name': 'Zeit der niedrigesten Temperatur des Tages',
      'desc': 'Wann (SS:MM) war die niedrigste Temperatur des Tages',
      'type': 'string',
      'read': true,
      'write': true,
      'role': 'value',
      'def': '00:00',
    });
    createState(DP_WIND_MAX, {
      'name': 'Höchstwert des Tages',
      'desc': 'Der höchste Wert der Windgeschwindigkeit des Tages',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': 0,
      'max': 120,
      'def': 0,
      'unit': 'km/h',
    });
    createState(DP_WIND_MAX_ZEIT, {
      'name': 'Zeit des Höchstwertes',
      'desc': 'Wann (SS:MM) war höchste Wert der Windgeschwindigkeit des Tages',
      'type': 'string',
      'read': true,
      'write': true,
      'role': 'value',
      'def': '00:00',
    });
    createState(DP_GUST_MAX, {
      'name': 'Höchstwert des Tages',
      'desc': 'Der höchste Wert einer Windböe des Tages',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': 0,
      'max': 120,
      'def': 0,
      'unit': 'km/h',
    });
    createState(DP_GUST_MAX_ZEIT, {
      'name': 'Zeit des Höchstwertes',
      'desc': 'Wann (SS:MM) war höchste Wert einer Windböe des Tages',
      'type': 'string',
      'read': true,
      'write': true,
      'role': 'value',
      'def': '00:00',
    });
    createState(DP_BARO_MAX, {
      'name': 'Höchster Luftdruck des Tages',
      'desc': 'Der höchste Luftdruck des Tages',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': 0,
      'max': 1300,
      'def': 0,
      'unit': 'hPa',
    });
    createState(DP_BARO_MAX_ZEIT, {
      'name': 'Zeit des hösten Luftdruck des Tages',
      'desc': 'Wann (SS:MM) war der höchste Luftdruck des Tages',
      'type': 'string',
      'read': true,
      'write': true,
      'role': 'value',
      'def': '00:00',
    });
    createState(DP_BARO_MIN, {
      'name': 'Niedrigste Luftdruck des Tages',
      'desc': 'Der niedrigeste Luftdruck des Tages',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': 0,
      'max': 1300,
      'def': 1300,
      'unit': 'hPa',
    });
    createState(DP_BARO_MIN_ZEIT, {
      'name': 'Zeit des niedrigesten Luftdruck des Tages',
      'desc': 'Wann (SS:MM) war der niedrigesten Luftdruck des Tages',
      'type': 'string',
      'read': true,
      'write': true,
      'role': 'value',
      'def': '00:00',
    });
    createState(DP_TEMP_GEF, {
      'name': 'Gefühlte Temperatur',
      'desc': 'Die gefühlte aktuelle Temperatur',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': -50,
      'max': 50,
      'def': 0,
      'unit': 'C',
    });
    createState(DP_TEMP_HI, {
      'name': 'Hitzindex Temperatur',
      'desc': 'Die Temperatur für den Hitzeindex',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': -50,
      'max': 50,
      'def': 0,
      'unit': 'C',
    });
    createState(DP_TEMP_HUI, {
      'name': 'Der Humindex',
      'desc': 'Der Wert des Humindex',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': 0,
      'max': 100,
      'def': 0,
    });
    createState(DP_REGEN_MONAT, {
      'name': 'Regen monatlich',
      'desc': 'Die gesamte Regenmenge im aktuellen Monat',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': 0,
      'max': 1500,
      'def': 0,
       'unit': 'mm',
    });
    createState(DP_REGEN_JAHR, {
      'name': 'Regen monatlich',
      'desc': 'Die gesamte Regenmenge im aktuellen Monat',
      'type': 'number',
      'read': true,
      'write': true,
      'role': 'value',
      'min': 0,
      'max': 10000,
      'def': 0,
       'unit': 'mm',
    });
    let timeout = setTimeout(function () {
      /*
       * Leere Daten für Barotrend füllen
       */
      A_BAROTRENDDATA = listsRepeat(0, ELEMENTS);
      setState(DP_BAROTREND_DATA, A_BAROTRENDDATA);
      /*
       * Leere Daten für Temperaturtrend füllen
       */
      A_TEMPTRENDDATA = listsRepeat(0, ELEMENTS);
      setState(DP_TEMPTREND_DATA, A_TEMPTRENDDATA);
    }, 2000);
}

/**
  ##########         Funktionen          ##########
**/

function listsRepeat(value, n) {
  var array = [];
  for (var i = 0; i < n; i++) {
    array[i] = value;
  }
  return array;
}

/**
 * Checks if a a given state or part of state is existing.
 * This is a workaround, as getObject() or getState() throw warnings in the log.
 * Set strict to true if the state shall match exactly. If it is false, it will add a wildcard * to the end.
 * See: https://forum.iobroker.net/topic/11354/
 * @param {string}    strStatePath     Input string of state, like 'javas-cript.0.switches.Osram.Bedroom'
 * @param {boolean}   [strict=true]    Optional: Default is true. If true, it will work strict, if false, it will add a wildcard * to the end of the string
 * @return {boolean}                   true if state exists, false if not
 */
function isState(strStatePath, strict) {
    if(strict === undefined) strict = true;
    let mSelector;
    if (strict) {
        mSelector = $('state[id=' + strStatePath + '$]');
    } else {
        mSelector = $('state[id=' + strStatePath + ']');
    }
    if (mSelector.length > 0) {
        return true;
    } else {
        return false;
    }
}

/*
 * Berechnen der gefühlten Temperatur
 */
function apparent_temp(t, f, w) {
  let e = 17.27*t/(237.7+t);
  e = e.toExponential();
  e = 0.33*(f/100*6.105*e);
  let th = 0.7*w;
  let g = Math.round(((t+e-th-4.10)*100)/100);

  if (LOGGING) console.log('Weathercalc: Gefühlte Temeratur=' + g);

  return g;
}

 /*
  * Berechnen des 3 Stunden Trend für den Luftdruck
  */
function barotrend() {
  let tmpelements = getState(DP_BAROTREND_DATA).val;
  let b = getState(DP_B).val;
  let b_alt = getState(DP_BAROTREND_ALT).val;
  let b_diff = Math.round((b - b_alt) * 100 ) / 100;
  let b_tmp;
  let b_akt_diff = 0;

  A_BAROTRENDTEMPDATA = [];

  for (let i = 1; i <= ELEMENTS - 1; i++) {
    b_tmp = parseFloat(tmpelements[i]);
    A_BAROTRENDTEMPDATA.push(b_tmp);
    b_akt_diff = b_akt_diff + b_tmp;
  }
  A_BAROTRENDTEMPDATA.push(b_diff);
  b_akt_diff = b_akt_diff + b_diff;

  b_akt_diff = Math.round((b_akt_diff / ELEMENTS) * 100 ) / 100;

  if (LOGGING) console.log('Weathercalc: Luftdrucktrend=' + b_akt_diff);

  setState(DP_BAROTREND_DATA, A_BAROTRENDTEMPDATA);
  setState(DP_BAROTREND_ALT, b);
  setState(DP_BAROTREND_TREND, b_akt_diff);
}

/*
 * Berechnen des 3 Stunden Trend für die Temperatur
 */
function temptrend() {
  let tmpelements = getState(DP_TEMPTREND_DATA).val;
  let t = getState(DP_T).val;
  let t_alt = getState(DP_TEMPTREND_ALT).val;
  let t_diff = Math.round((t - t_alt) * 100 ) / 100;
  let t_tmp;
  let t_akt_diff = 0;

  A_TEMPTRENDTEMPDATA = [];

  for (let i = 1; i <= ELEMENTS - 1; i++) {
    t_tmp = parseFloat(tmpelements[i]);
    A_TEMPTRENDTEMPDATA.push(t_tmp);
    t_akt_diff = t_akt_diff + t_tmp;
  }
  A_TEMPTRENDTEMPDATA.push(t_diff);
  t_akt_diff = t_akt_diff + t_diff;

  t_akt_diff = Math.round((t_akt_diff / ELEMENTS) * 100 ) / 100;

  if (LOGGING) console.log('Weathercalc: Temperaturtrend=' + t_akt_diff);

  setState(DP_TEMPTREND_DATA, A_TEMPTRENDTEMPDATA);
  setState(DP_TEMPTREND_ALT, t);
  setState(DP_TEMPTREND_TREND, t_akt_diff);
}

/*
 *  Sonnen-Radiation errechnen
 */
function sollarradiation() {
  let sdt = getState(DP_SDT).val;
  let sdm = sdt - (sdt * 0.3);

  let sr = (sdm - 3) * 30;
  if (sr < 0) sr = sr * -1;
  if (LOGGING) console.log('Weathercalc: Solar Radiation=' + sr);
  setState(DP_SR, sr);
}




/*
 * Ermittle den Hitzeindes (heat index) und den Humidex
 * Hitzeindex: HI = -8.784695 + 1.61139411*T + 2.338549*F - 0.14611605*T*F - 0.012308094*T2 - 0.016424828*F² + 0.002211732*T²*F + 0.00072546*T*F² - 0.000003582*T²*F²
 * HI = Hitzeindex in °C, T = Temperatur in °C, F = relative Luftfeuchtigkeitr in %
 *
 * Humidex: Humidex = T + 0.5555 * (6.11 * e(5417.7530*(1/273.16 - 1/TP) - 10)
 * T = Temperatur in °C, TP = Taupunkt in °C
 *
 * Formel und Funktion nach nach https://myscope.net/hitzeindex-gefuehle-temperatur/
 */

 function heatindex(t, f) {
   if (f < 0) { f = 0; }
   if (f > 100) { f = 100; }

   let hi = Math.round(((-8.784695 + 1.61139411*t + 2.338549*f - 0.14611605*t*f - 0.012308094*t*t - 0.016424828*f*f + 0.002211732*t*t*f + 0.00072546*t*f*f - 0.000003582*t*t*f*f) * 100) / 100);

   if (LOGGING) console.log('Weathercalc: Hitzeindex=' + hi);
   return  hi;
 }

 function humidex(t, tp) {
   let hui = Math.round(((t + 5/9 * (6.112 * Math.pow(10, 7.5 * t / (237.7+t)) * tp / 100 - 10)) * 100) / 100);

   if (LOGGING) console.log('Weathercalc: Humidex=' + hui);

   return  hui;
 }

 /**
   ##########         Trigger          ##########
 **/
 /*
  * Erfasse die gemessene heutige Höchst- und Niedrigwerte für:
  * Temperatur (min/max), Windgeschwinmdigkeit (max), Windböe (max), Luftdruck (min/max)
  */
 on({id: DP_T, change: 'gt'}, function (obj) {
   if (getState(DP_TEMP_MAX).val <= getState(DP_T).val) {
     setState(DP_TEMP_MAX, getState(DP_T).val);
     setState(DP_TEMP_MAX_ZEIT, formatDate(getDateObject(getState(DP_T).ts), 'SS:mm'));
     if (LOGGING) console.log('Weathercalc: Neue maximal Temperatur heute=' + DP_T + ' um ' + formatDate(getDateObject(getState(DP_T).ts), 'SS:mm'));
   }
 });
 on({id: DP_T, change: 'lt'}, function (obj) {
   if (getState(DP_TEMP_MIN).val >= getState(DP_T).val) {
     setState(DP_TEMP_MIN, getState(DP_T).val);
     setState(DP_TEMP_MIN_ZEIT, formatDate(getDateObject(getState(DP_T).ts), 'SS:mm'));
     if (LOGGING) console.log('Weathercalc: Neue minimal Temperatur heute=' + DP_T + ' um ' + formatDate(getDateObject(getState(DP_T).ts), 'SS:mm'));
   }
 });
 on({id: DP_B, change: 'gt'}, function (obj) {
   if (getState(DP_BARO_MAX).val <= getState(DP_B).val) {
     setState(DP_BARO_MAX, getState(DP_B).val);
     setState(DP_BARO_MAX_ZEIT, formatDate(getDateObject(getState(DP_B).ts), 'SS:mm'));
     if (LOGGING) console.log('Weathercalc: Neuer maximaler Luftdruck heute=' + DP_B + ' um ' + formatDate(getDateObject(getState(DP_B).ts), 'SS:mm'));
   }
 });
 on({id: DP_B, change: 'lt'}, function (obj) {
   if (getState(DP_BARO_MIN).val >= getState(DP_B).val) {
     setState(DP_BARO_MIN, getState(DP_B).val);
     setState(DP_BARO_MIN_ZEIT, formatDate(getDateObject(getState(DP_B).ts), 'SS:mm'));
     if (LOGGING) console.log('Weathercalc: Neuer minimaler Luftdruck heute=' + DP_B + ' um ' + formatDate(getDateObject(getState(DP_B).ts), 'SS:mm'));
   }
 });
 on({id: DP_W, change: 'gt'}, function (obj) {
   if (getState(DP_WIND_MAX).val <= getState(DP_W).val) {
     setState(DP_WIND_MAX, getState(DP_W).val);
     setState(DP_WIND_MAX_ZEIT, formatDate(getDateObject(getState(DP_W).ts), 'SS:mm'));
     if (LOGGING) console.log('Weathercalc: Neue maximale Windgeschwindigkeit heute=' + DP_W + ' um ' + formatDate(getDateObject(getState(DP_W).ts), 'SS:mm'));
   }
 });
 on({id: DP_G, change: 'gt'}, function (obj) {
   if (getState(DP_GUST_MAX).val <= getState(DP_G).val) {
     setState(DP_GUST_MAX, getState(DP_G).val);
     setState(DP_GUST_MAX_ZEIT, formatDate(getDateObject(getState(DP_G).ts), 'SS:mm'));
     if (LOGGING) console.log('Weathercalc: Neue maximale Böengeschwindigkeit heute=' + DP_G + ' um ' + formatDate(getDateObject(getState(DP_W).ts), 'SS:mm'));
   }
 });

 /**
   ##########         Crons          ##########
 **/

 /*
  *  Programmlauf
  */
  schedule('*/'+CRON+' * * * *', function () {
    let t = getState(DP_T).val;
    let f = getState(DP_F).val;
    let w = getState(DP_W).val;
    let d = getState(DP_D).val;
    let t_gef = apparent_temp(t, f, w);
    let hi =  Math.round((heatindex(t, f) * 100)/100);
    let hui = Math.round((humidex(t, d) * 100)/100);
    setState(DP_TEMP_GEF, t_gef);
    setState(DP_TEMP_HI, hi);
    setState(DP_TEMP_HUI, hui);
    barotrend();
    temptrend();
    sollarradiation();
    if (LOGGING) console.log('Weathercalc: Cron durchlaufen');
  });

/*
 * Tagesmittelwert für Temperatur
 */
schedule('0 * * * *', function () {
  let tmpelements = getState(DP_TEMP_MITTEL_DATA).val;
  let t = getState(DP_T).val;
  let a_temparray = [];
  let t_mittel = 0;
  let i;

  if (tmpelements.length < 23) {
    for (i=1; i <= tmpelements.length - 1; i++ ) {
      a_temparray.push(tmpelements[i]);
      t_mittel = t_mittel + parseFloat(tmpelements[i]);
    }
  } else {
    for (i=1; i <= 22; i++ ) {
      a_temparray.push(tmpelements[(i)]);
      t_mittel = t_mittel + parseFloat(tmpelements[i]);
      }
  }

  a_temparray.push(t);
  t_mittel = t_mittel + t;
  t_mittel =  Math.round(((t_mittel / tmpelements.length) * 100) / 100);

  if (LOGGING) console.log('Weathercalc: Mittlere Tagestemperatur=' + t_mittel);

  setState(DP_TEMP_MITTEL, t_mittel);
  setState(DP_TEMP_MITTEL_DATA, a_temparray);
});


 /*
  * Am Tagesende Daten zurücksetzen
  */
 schedule('59 23 * * *', function () {
   setState(DP_TEMP_MAX, -50);
   setState(DP_TEMP_MAX_ZEIT, '00:00');
   setState(DP_TEMP_MIN, 50);
   setState(DP_TEMP_MIN_ZEIT, '00:00');
   setState(DP_WIND_MAX, 0);
   setState(DP_WIND_MAX_ZEIT, '00:00');
   setState(DP_GUST_MAX, 0);
   setState(DP_GUST_MAX_ZEIT, '00:00');
   setState(DP_BARO_MAX, 0);
   setState(DP_BARO_MAX_ZEIT, '00:00');
   setState(DP_BARO_MIN, 1300);
   setState(DP_BARO_MIN_ZEIT, '00:00');
   if (LOGGING) console.log('Weathercalc: Tageswerte zum Tagesende gelöscht');
 });

 /*
  * Berechnen der monatlichen und jährlichen Regenmenge
  */
 schedule('59 23 * * *', function () {
   let regenmonatlich = getState(DP_REGEN_MONAT).val + getState(DP_R).val;
   let regenjaehrlich = getState(DP_REGEN_JAHR).val + getState(DP_R).val;
   setState(DP_REGEN_MONAT, regenmonatlich);
   setState(DP_REGEN_JAHR, regenjaehrlich);
   if (LOGGING) console.log('Weathercalc: Neuer Wert für monatliche Regenmenge=' + regenmonatlich);
   if (LOGGING) console.log('Weathercalc: Neuer Wert für jährliche Regenmenge=' + regenjaehrlich);
 });

 schedule('0 0 1 * *', function () {
   setState(DP_REGEN_MONAT, 0);
   if (LOGGING) console.log('Weathercalc: Wert für monatliche Regenmenge zum Ende des aktuellen Monats gelöscht');
 });

 schedule('0 0 1 1 *', function () {
   setState(DP_REGEN_JAHR, 0);
   if (LOGGING) console.log('Weathercalc: Wert für jährliche Regenmenge zum Ende des aktuellen Jahres gelöscht');
 });

/**
  ##########         Skriptstart          ##########
**/
let timeout = setTimeout(function () {
  let t = getState(DP_T).val;
  let f = getState(DP_F).val;
  let w = getState(DP_W).val;
  let d = getState(DP_D).val;
  let t_gef = apparent_temp(t, f, w);
  let hi =  heatindex(t, f);
  let hui = humidex(t, d);
  setState(DP_TEMP_GEF, t_gef);
  setState(DP_TEMP_HI, hi);
  setState(DP_TEMP_HUI, hui);
  barotrend();
  temptrend();
  sollarradiation();
  if (LOGGING) console.log('Weathercalc: Scriptaufruf zum Scriptstart');
}, 5000);
