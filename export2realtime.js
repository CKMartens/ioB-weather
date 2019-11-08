/**
  ##########         EXPORT2REALTIME          ##########
  Weatherman-Daten in eine realtime.txt Datei schreiben zur Veröffentlichung
  Informationen realtime.txt unter https://cumuluswiki.wxforum.net/a/Realtime.txt

  01.11.2019:   V0.0.1  Initialrelease (quick&ditry)
  06.11.2019:   v0.1.0  Code funktional überarbeitet

  to do:


  Author: CKMartens (carsten.martens@outlook.de)
  License: GNU General Public License V3, 29. Juni 2007
**/

/**
  ##########         Variablen          ##########
**/
const s_realtime = '';                                                          // Inhalt der realtime.txt Datei
const FTP_USER = '';
const FTP_PASSWD = '';
const FTP_HOST = '';
const FTP_PATH = '';
var fs = require('fs');

/**
  ##########         Pfade          ##########
**/
const PATH2RT = '/opt/iobroker/realtime/realtime.txt';

/**
  ##########         Datenpunkte          ##########
**/

/**
  ##########         Funktionen          ##########
**/

/*
 * Funktion makerealtime()
 * erstelt die realtime.txt Datei und speichert diese lokal ab
 */
function makerealtime() {
  let sp=' ';                                                                   // Leerzeichen als Trenner
  let f01=makedate();                                                           // 1. date dd/mm/yy (18/10/08)
  let f02=maketime();                                                           // 2. time hh:mm:ss (16:03:45)
  let f03=String(getState('hm-rega.0.1467').val);                               // 3. outside temperature
  let f04=String(getState('hm-rega.0.1468').val);   														// 4. relative humidity
  let f05=String(getState('hm-rega.0.1475').val);   														// 5. dewpoint
  let f06=String(getState('hm-rega.0.1470').val);   														// 6. average wind speed
  let f07=String(getState('hm-rega.0.1470').val);														    // 7. latest wind speed reading - In weatherman nicht vorhanden
  let f08=String(getState('hm-rega.0.1472').val);														    // 8. wind bearing (degrees)
  let f09=String(getState('hm-rega.0.1474').val);														    // 9. current rain rate (per hour)
  let f10=String(getState('hm-rega.0.1486').val);														    // 10. rain today
  let f11=String(getState('hm-rega.0.1469').val);														    // 11. barometer
  let f12=String(getState('hm-rega.0.1489').val);														    // 12. current wind direction (compass point)
  let f13=String(getState('hm-rega.0.1490').val);   														// 13. wind speed (beaufort)
  let f14='m/s';           	  																									// 14. wind units - m/s, mph, km/h, kts
  let f15='C';              																										// 15. temperature units - degree C, degree F
  let f16='hPa';            																										// 16. pressure units - mb, hPa, in
  let f17='mm';																										              // 17. rain units - mm, in
  let f18=String(getState('hm-rega.0.1471').val);														    // 18. wind run (today)
  let f19=String(getState('javascript.1.Wetterdaten.Luftdruck.Barotrend.baro_trend').val);            // 19. pressure trend value (The average rate of pressure change over the last three hours)
  let f20=String(getState('javascript.1.Wetterdaten.Statistik.Regen.monatsmittel').val);	 		            // 20. monthly rainfall
  let f21=String(getState('javascript.1.Wetterdaten.Statistik.Regen.jahresmittel').val);			            // 21. yearly rainfall
  let f22=String(getState('hm-rega.0.1493').val);														    // 22. yesterday's rainfall
  let f23=String(getState('mihome.0.devices.weather_v1_158d00027466c7.temperature').val);				// 23. inside temperature
  let f24=String(getState('mihome.0.devices.weather_v1_158d00027466c7.humidity').val);					// 24. inside humidity
  let f25=String(getState('hm-rega.0.1487').val);														    // 25. wind chill
  let f26=String(getState('javascript.1.Wetterdaten.Temperatur.Temptrend.temp_trend').val);				// 26. temperature trend value (The average rate of change in temperature over the last three hours)
  let f27=String(getState('javascript.1.Wetterdaten.Statistik.Temperatur.max').val);		        // 27. today's high temp
  let f28=String(getState('javascript.1.Wetterdaten.Statistik.Temperatur.max_std').val);	      // 28. time of today's high temp (hh:mm)
  let f29=String(getState('javascript.1.Wetterdaten.Statistik.Temperatur.max').val);						// 29. today's low temp
  let f30=String(getState('javascript.1.Wetterdaten.Statistik.Temperatur.min_std').val);  			// 30. time of today's low temp (hh:mm)
  let f31=String(getState('javascript.1.Wetterdaten.Statistik.Wind.wind_max').val);			  			// 31. today's high wind speed (of average as per choice)
  let f32=String(getState('javascript.1.Wetterdaten.Statistik.Wind.wind_max_std').val);					// 32. time of today's high wind speed (average) (hh:mm)
  let f33=String(getState('javascript.1.Wetterdaten.Statistik.Wind.guest_max').val);   					// 33. today's high wind gust
  let f34=String(getState('javascript.1.Wetterdaten.Statistik.Wind.guest_max_std').val);					// 34. time of today's high wind gust (hh:mm)
  let f35=String(getState('javascript.1.Wetterdaten.Statistik.Luftdruck.max').val);							// 35. today's high pressure
  let f36=String(getState('javascript.1.Wetterdaten.Statistik.Luftdruck.max_std').val);		  		// 36. time of today's high pressure (hh:mm)
  let f37=String(getState('javascript.1.Wetterdaten.Statistik.Luftdruck.min').val);							// 37. today's low pressure
  let f38=String(getState('javascript.1.Wetterdaten.Statistik.Luftdruck.min_std').val);					// 38. time of today's low pressure (hh:mm)
  let f39='1.8.7';																									            // 39. Cumulus Versions (the specific version in use)
  let f40='819';																										            // 40. Cumulus build number
  let f41='0.0';																										            // 41. 10-minute high gust
  let f42=String(getState('javascript.1.Wetterdaten.Statistik.Temperatur.heatindex').val);			// 42. Heat index
  let f43='0.0';																										            // 43. Humidex
  let f44=String(getState('hm-rega.0.1494').val);														    // 44. UV Index
  let f45=String(getState('javascript.1.Wetterdaten.Statistik.Temperatur.humidex').val);				// 45. evapotranspiration today
  let f46=String(getState('hm-rega.0.1652').val);																// 46. solar radiation W/m2
  let f47='0.0';																             										// 47. 10-minute average wind bearing (degrees)
  let f48=String(getState('hm-rega.0.1485').val);						    								// 48. rainfall last hour - w_regen_letzte_h
  let f49='0.0';																								            		// 49. The number of the current (Zambretti) forecast as per Strings.ini.
  if (getState('hm-rega.0.1476').val >= 25) {																		// 50. Flag to indicate that the location of the station is currently in daylight (1 = yes, 0 = No)
    var f50='1';
  } else {
    var f50='0';
  }
  let f51='0';																										              // 51. If the station has lost contact with its remote sensors 'Fine Offset only', a Flag number is given (1 = Yes, 0 = No)
  let f52='N';																										              // 52. Average wind direction
  let f53='0.0';																										            // 53. Cloud base
  let f54='0.0';																										            // 54. Cloud base units
  let f55='0.0';																										            // 55. Apparent temperature
  let f56=String(String(getState('hm-rega.0.1492').val) + ' ');									// 56. Sunshine hours so far today - w_sonnenstunden_heute
  let f57= '0';																										              // 57. Current theoretical max solar radiation
  if (getState('hm-rega.0.1482').val == true) {																	// 58. Is it sunny? 1 if the sun is shining, otherwise 0 - w_sonne_scheint
    var f58='1';
  } else {
    var f58='0';
  }

  let s_realtime = f01+sp+f02+sp+f03+sp+f04+sp+f05+sp+f06+sp+f07+sp+f08+sp+f09+sp+f10+sp+f11+sp+f12+sp+f13+sp+f14+sp+f15+sp+f16+sp+f17+sp+f18+sp+f19+sp+f20+sp+f11+sp+f22+sp+f23+sp+f24+sp+f25+sp+f26+sp+f27+sp+f28+sp+f29+sp+f30+sp+f31+sp+f32+sp+f33+sp+f34+sp+f35+sp+f36+sp+f37+sp+f38+sp+f39+sp+f40+sp+f41+sp+f42+sp+f43+sp+f44+sp+f45+sp+f46+sp+f47+sp+f48+sp+f49+sp+f50+sp+f51+sp+f52+sp+f53+sp+f54+sp+f55+sp+f56+sp+f57+sp+f58;

  fs.writeFile(PATH2RT, s_realtime, function (error) {
      console.log('Datei geschrieben');
   });   //schreibt in iobroker system

   let s_ftp = 'wput ' + PATH2RT + ' ftp://' + FTP_USER + ':' + FTP_PASSWD + '@' + FTP_HOST + FTP_PATH + '/realtime.txt';
   exec(s_ftp, function (error, result, stderr) {
         console.log(result);
   });
}
/*
 * Funktion makedate()
 * Datum im Format dd/mm/yy
 */
function makedate() {
  var today = formatDate(new Date(), 'DD/MM/YY');
  return today;
}

/*
 * Funktion maketime()
 * Datum im Format hh:mm:ss
 */
function maketime() {
  var now = formatDate(new Date(), 'hh:mm:ss');
  return now;
}

/*
 * Schedule evry 5 Minutes
 */
schedule('*/5 * * * *', function () {
  makerealtime();
});

makerealtime();
