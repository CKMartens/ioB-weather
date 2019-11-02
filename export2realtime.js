/**
  ##########         EXPORT2REALTIME          ##########
  Weatherman-Daten in eine realtime.txt Datei schreiben zur Veröffentlichung
  Informationen realtime.txt unter https://cumuluswiki.wxforum.net/a/Realtime.txt

  01.11.2019:   V0.0.1  Initialrelease (quick&ditry)
  to do:


  Author: CKMartens (carsten.martens@outlook.de)
  License: GNU General Public License V3, 29. Juni 2007
**/

var Datum, Realtime, Uhrzeit, result, w_temperatur;
var fs = require('fs');

var w_temperatur = getState("hm-rega.0.1467").val;
var w_feuchte_rel = getState("hm-rega.0.1468").val;
var w_wind_mittel = getState("hm-rega.0.1470").val;

var e = 17.27*w_temperatur/(237.7+w_temperatur);
e = e.toExponential();
e = 0.33*(w_feuchte_rel/100*6.105*e);

var th = 0.7*w_wind_mittel

var gef_temp= extround(w_temperatur+e-th-4,10);

console.log(gef_temp);

function extround(zahl,n_stelle) {
zahl = (Math.round(zahl * n_stelle) / n_stelle);
    return zahl;
}

Datum = formatDate(new Date(), "DD/MM/YY");
Uhrzeit = formatDate(new Date(), "hh:mm:ss");
Realtime = String(Datum) + ' ';																							// 1. date dd/mm/yy (18/10/08)
Realtime += String(String(Uhrzeit) + ' ');																				// 2. time hh:mm:ss (16:03:45)
Realtime += String(String(getState("hm-rega.0.1467").val) + ' ');														// 3. outside temperature (8.4) - w_temperatur
Realtime += String(String(getState("hm-rega.0.1468").val) + ' ');														// 4. relative humidity - w_feuchte_rel
Realtime += String(String(getState("hm-rega.0.1475").val) + ' ');														// 5. dewpoint - w_taupunkt
Realtime += String(String(getState("hm-rega.0.1470").val) + ' ');														// 6. average wind speed - w_wind_mittel
Realtime += String(String(getState("hm-rega.0.1470").val) + ' ');														// 7. latest wind speed reading - Nicht vorhanden: w_wind_mittel
Realtime += String(String(getState("hm-rega.0.1472").val) + ' ');														// 8. wind bearing (degrees) - w_wind_dir
Realtime += String(String(getState("hm-rega.0.1474").val) + ' ');														// 9. current rain rate (per hour) - w_regenstaerke
Realtime += String(String(getState("hm-rega.0.1486").val) + ' ');														// 10. rain today - w_regen_mm_heute
Realtime += String(String(getState("hm-rega.0.1469").val) + ' ');														// 11. barometer - w_barometer
Realtime += String(String(getState("hm-rega.0.1489").val) + ' ');														// 12. current wind direction (compass point) - w_windrichtung
Realtime += String(String(getState("hm-rega.0.1490").val) + ' ');														// 13. wind speed (beaufort) - w_windstaerke
Realtime += 'm/s ';																										// 14. wind units - m/s, mph, km/h, kts
Realtime += 'C ';																										// 15. temperature units - degree C, degree F
Realtime += 'hPa ';																										// 16. pressure units - mb, hPa, in
Realtime += 'mm ';																										// 17. rain units - mm, in
Realtime +=  String(String(getState("hm-rega.0.1471").val) + ' ');														// 18. wind run (today) - w_wind_spitze
Realtime += '0.0 ';																										// 19. pressure trend value (The average rate of pressure change over the last three hours)
Realtime += '0.0 ';																										// 20. monthly rainfall
Realtime += '0.0 ';																										// 21. yearly rainfall
Realtime += String(String(getState("hm-rega.0.1493").val) + ' ');														// 22. yesterday's rainfall - w_regen_mm_gestern
Realtime += String(String(getState("mihome.0.devices.weather_v1_158d00027466c7.temperature").val) + ' ');				// 23. inside temperature - Xiomi Fühler Büro
Realtime += String(String(getState("mihome.0.devices.weather_v1_158d00027466c7.humidity").val) + ' ');					// 24. inside humidity -  Xiomi Fühler Büro
Realtime += String(String(getState("hm-rega.0.1487").val) + ' ');														// 25. wind chill - w_windchill
Realtime += '0.0 ';																										// 26. temperature trend value (The average rate of change in temperature over the last three hours)
Realtime += '0.0 ';																										// 27. today's high temp
Realtime += '0.0 ';																										// 28. time of today's high temp (hh:mm)
Realtime += '0.0 ';																										// 29. today's low temp
Realtime += '0.0 ';																										// 30. time of today's low temp (hh:mm)
Realtime += '0.0 ';																										// 31. today's high wind speed (of average as per choice)
Realtime += '0.0 ';																										// 32. time of today's high wind speed (average) (hh:mm)
Realtime += '0.0 ';																										// 33. today's high wind gust
Realtime += '0.0 ';																										// 34. time of today's high wind gust (hh:mm)
Realtime += '0.0 ';																										// 35. today's high pressure
Realtime += '0.0 ';																										// 36. time of today's high pressure (hh:mm)
Realtime += '0.0 ';																										// 37. today's low pressure
Realtime += '0.0 ';																										// 38. time of today's low pressure (hh:mm)
Realtime += '1.8.7 ';																									// 39. Cumulus Versions (the specific version in use)
Realtime += '819 ';																										// 40. Cumulus build number
Realtime += '0.0 ';																										// 41. 10-minute high gust
Realtime += '0.0 ';																										// 42. Heat index
Realtime += '0.0 ';																										// 43. Humidex
Realtime += String(String(getState("hm-rega.0.1494").val) + ' ');														// 44. UV Index
Realtime += '0.0 ';																										// 45. evapotranspiration today
Realtime += '0.0 ';																										// 46. solar radiation W/m2
Realtime += '0.0 ';																										// 47. 10-minute average wind bearing (degrees)
Realtime += String(String(getState("hm-rega.0.1485").val) + ' ');														// 48. rainfall last hour - w_regen_letzte_h
Realtime += '0.0 ';																										// 49. The number of the current (Zambretti) forecast as per Strings.ini.
if (getState("hm-rega.0.1476").val >= 25) {																				// 50. Flag to indicate that the location of the station is currently in daylight (1 = yes, 0 = No)
  Realtime += '1 ';
} else {
  Realtime += '0 ';
}
Realtime += '0.0 ';																										// 51. If the station has lost contact with its remote sensors "Fine Offset only", a Flag number is given (1 = Yes, 0 = No)
Realtime += 'N ';																										// 52. Average wind direction
Realtime += '0.0 ';																										// 53. Cloud base
Realtime += '0.0 ';																										// 54. Cloud base units
Realtime += '0.0 ';																										// 55. Apparent temperature
Realtime += String(String(getState("hm-rega.0.1492").val) + ' ');														// 56. Sunshine hours so far today - w_sonnenstunden_heute
Realtime += '0 ';																										// 57. Current theoretical max solar radiation
if (getState("hm-rega.0.1482").val == true) {																			// 58. Is it sunny? 1 if the sun is shining, otherwise 0 - w_sonne_scheint
  Realtime += '1 ';
} else {
  Realtime += '0.0 ';
}
console.log(Realtime);

fs.writeFileSync('./realtime/realtime.txt', Realtime, function (error) {
    console.log('Datei geschrieben');
 });   //schreibt in iobroker system

/*exec('wput /opt/iobroker/iobroker-data/files/javascript/realtime/realtime.txt ftp://iobroker:Trustno1@gugelitze.de/realtime.txt', function (error, result, stderr) {
      console.log(result);
      exec('rm /opt/iobroker/iobroker-data/files/javascript/realtime/realtime.txt ftp://iobroker:Trustno1@gugelitze.de/realtime.txt', function (error, result, stderr) {
       console.log('Datei gelöscht');
      });
});*/
