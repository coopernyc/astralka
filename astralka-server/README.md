# AstralkaServer
The server is node express REST server running on `http://localhost:3010/` where 3010 default port.

# HTTP GET on /natal route
Send get http request to /natal route of the server with additional query parameters (see below) to get astrological natal chart data.

## Query Parameters
**name**: string - label for the data  
**y**: number - DOB year  
**m**: number - DOB month  
**d**: number - DOB day  
**h**: number - UTC birth hour  
**m**: number - UTC birth minutes  
**s**: number - UTC birth seconds  
**long**: number - Longitude of the birth pace  
**lat**: number - Latitude of the birth place  
**elv**: number - Elevation in meters of the birth place  
**hsys**: string - letter for "house system", defaults to "Placidus" (See Below)  

### House System ###
<BLOCKQUOTE>
	 'A'&nbsp;&nbsp;equal (cusp 1 is ascendant)<BR>
	 'E'&nbsp;&nbsp;equal (cusp 1 is ascendant)<BR>
	 'B'&nbsp;&nbsp;Alcabitius
	 'C'&nbsp;&nbsp;Campanus<BR>
	 'G'&nbsp;&nbsp;36 Gauquelin sectors
	 'H'&nbsp;&nbsp;azimuthal or horizontal system<BR>
	 'K'&nbsp;&nbsp;Koch<BR>
	 'M'&nbsp;&nbsp;Morinus
	 'O'&nbsp;&nbsp;Porphyrius<BR>
	 'P'&nbsp;&nbsp;Placidus<BR>
	 'R'&nbsp;&nbsp;Regiomontanus<BR>
	 'T'&nbsp;&nbsp;Polich/Page ('topocentric' system)<BR>
	 'U'&nbsp;&nbsp;Krusinski-Pisa-Goelzer
	 'V'&nbsp;&nbsp;Vehlow equal (asc. in middle of house 1)<BR>
	 'X'&nbsp;&nbsp;axial rotation system/ Meridian houses<BR>
	 'W'&nbsp;&nbsp;equal, whole sign
	 'X'&nbsp;&nbsp;axial rotation system/ Meridian houses
	 'Y'&nbsp;&nbsp;APC houses       
</BLOCKQUOTE>  

  
# Running the server
Run `npm run once` to start server. 
Run `npm start` to start dev server with live reload.
