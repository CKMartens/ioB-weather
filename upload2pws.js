/* Skript zum Beschreiben der Personal Weather Station
Autor: pix (30.6.2016), mit Anpassungen durch dtp
nach dem Vorbild dieses HM-Skriptes von mape
http://homematic-forum.de/forum/viewtopic.php?f=27&t=31045&start=140#p293007

Voraussetzung: Anmeldung einer PWS unter
https://www.wunderground.com/personal-weather-station/signup (Hardware: other)
*/

var logging = false;

var pws_id = "IUNTER31";    // "Station ID" der PWS
var pws_key = "hZzmbLZa";  // "Station Key" der PWS

var idtempc 		= "hm-rega.0.1467"; 		// Temperatur in °C
var idhumidity		= "hm-rega.0.1468"; 		// Luftfeuchtigkeit in %
var idwinddir		= "hm-rega.0.1472";         // Windrichtung (0-360°)
var idwindspeedkmh	= "hm-rega.0.1470"; 		// Windgeschwindigkeit in km/h
var idwindgustkmh	= "hm-rega.0.1471"; 		// Windgeschwindigkeit Peak in km/h
var iddailyrainmm	= "hm-rega.0.1486"; 	   	// Regen heute in mm
var iddailynowrainmm = "hm-rega.0.1474"; 	   	// Regenstärke aktuell in mm
var idpressure      = "hm-rega.0.1469";         // Luftdruck
// var idsolarradiation = "hm-rega.0.4835";        // Solar Radiation
var iduv             = "openuv.0.UV";           // UV Einstrahlung aus OpenUV

// Ab hier nix mehr anpassen

var request = require('request');

function weatherupdate() {
        var tempc = getState(idtempc).val;
        var tempf = (tempc * 1.8) + 32;  									// Umwandlung °C in °F
        var barometera = getState(idpressure).val;
        var barometerb = (barometera*0.02952998751);
        var humidity = getState(idhumidity).val;
        var winddir = getState(idwinddir).val;
        var windspeedkmh = getState(idwindspeedkmh).val;
        var windspeedmph = windspeedkmh * 2.2369362921;  			// Umwandlung km/h in mph
        var windgustkmh = getState(idwindgustkmh).val;
        var windgustmph = windgustkmh * 2.2369362921;  			// Umwandlung km/h in mph
        var dailyrainmm = getState(iddailyrainmm).val;
        var dailyrainin = dailyrainmm * 0.0393701;  			// Umwandlung mm in in
        var dailyrainnowmm = getState(iddailynowrainmm).val;
        var dailyrainnowin = dailyrainnowmm * 0.0393701;  			// Umwandlung mm in in
        var taupkt = 0;
        var taupktf = (taupkt * 1.8) + 32;
        var mw = 18.016; // Molekulargewicht des Wasserdampfes (kg/kmol)
        var gk = 8214.3; // universelle Gaskonstante (J/(kmol*K))
        var t0 = 273.15; // Absolute Temperatur von 0 °C (Kelvin)
        var tk = tempc + t0; // Temperatur in Kelvin
 //       var solarradiation1 = getState(idsolarradiation).val;
        var uv = getState(iduv).val;

        var a, b;
        if (tempc >= 0) {
          a = 7.5;
          b = 237.3;
        } else if (tempc < 0) {
          a = 7.6;
          b = 240.7;
        }

        // Sättigungsdampfdruck (hPa)
        var sdd = 6.1078 * Math.pow(10, (a*tempc)/(b+tempc));

        // Dampfdruck (hPa)
        var dd = sdd * (humidity/100);

        // Wasserdampfdichte bzw. absolute Feuchte (g/m3)
        af = Math.pow(10,5) * mw/gk * dd/tk;

        // v
        v = Math.log10(dd/6.1078);

        // Taupunkttemperatur (°C)
        td = (b*v) / (a-v);
        taupkt = (Math.round(td*100)/100);
        taupktf = (taupkt * 1.8) + 32;
        taupktf1 = (Math.round(taupktf*100)/100);

    var weatherURL = 'http://weatherstation.wunderground.com/weatherstation/updateweatherstation.php?ID=' + pws_id + '&PASSWORD=' + pws_key + '&dateutc=now&tempf=' + tempf + '&humidity=' + humidity + '&winddir=' + winddir + '&windspeedmph=' + windspeedmph + '&windgustmph=' + windgustmph + '&dewptf=' + taupktf1 + '&dailyrainin=' + dailyrainin + '&rainin=' + dailyrainnowin + '&baromin=' + barometerb + '&uv=' + uv +'&action=updateraw';

    try {
        request(weatherURL,function (error, response, body) {
            if (!error && response.statusCode == 200) {
               // Update ok
               log('Wunderground Personal Weather Station successfully updated','debug');
            } else {
                log('Error updating Wunderground PWS (Status Code' + response.statusCode + ')', 'warn');
                log(error,'error');
            }
        });
    } catch (e) {
        log('Fehler (try) beim Update der Wunderground Personal Weather Station (PWS): ' + e, 'error');
    }
    if (logging === true) {
        log ('Daten wurden an Wunderground gesendet', 'info');
        log ('Temperatur : ' + tempc + '°C' + ' (' + tempf + 'F)');
        log ('Luftdruck : ' + barometera + 'hPa' + ' (' + barometerb + 'Hg)');
        log ('Luftfeuchte : ' + humidity + ' %');
        log ('Windrichtung : ' + winddir);
        log ('Windgeschwindigkeit : ' + windspeedkmh + ('km/h') + ' (' + windspeedmph + ' mph)');
        log ('Windgeschwindigkeit Peak : ' + windgustkmh + ('km/h') + ' (' + windgustmph + ' mph)');
        log ('Regen : Aktuell ' + dailyrainnowmm + ('mm  und am Tag: ') + ' (' + dailyrainmm + ' mm)');
        log ('--------------------------------------------------------------------------');
        log ('Taupunkt : ' + taupkt + ' °C' + '(' + taupktf1 + ' F)');
        log ('--------------------------------------------------------------------------');
    }

}

//on(idtempc, weatherupdate); 				// aktualisieren, wenn neuer Temperaturwert von HM-Kombisensor
//on(idhumidity, weatherupdate); 			// aktualisieren, wenn neuer Luftfeuchtigkeitswert von HM-Kombisensor
//on(idwinddir, weatherupdate); 			// aktualisieren, wenn neuer Windrichtungswert von HM-Kombisensor
//on(idwindspeedkmh, weatherupdate); 	// aktualisieren, wenn neuer Windgeschwindigkeitswert von HM-Kombisensor
//on(idwindgustkmh, weatherupdate); 	// aktualisieren, wenn neuer Windgeschwindigkeitswert von HM-Kombisensor
//on(iddailynowrainmm, weatherupdate); 	// aktualisieren, wenn neuer Regenwert von HM-Kombisensor
//on(iddailyrainmm, weatherupdate); 	// aktualisieren, wenn neuer Regenwert von HM-Kombisensor
//on(idpressure, weatherupdate); 	   // aktualisieren, wenn neuer Luftdruckwert von HM-Kombisensor
//on(idsolarradiation, weatherupdate);
//on(iduv, weatherupdate);
schedule("*/5 * * * *", function () {
    weatherupdate();
});

weatherupdate();
