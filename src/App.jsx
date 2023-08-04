import { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';

import 'leaflet/dist/leaflet.css';

import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';

import './App.css';

function App() {
  let [lat, setLat] = useState('');
  let [lon, setLon] = useState('');
  let [city, setCity] = useState('');
  let [country, setCountry] = useState('');
  let [ip, setIp] = useState('');
  let [isp, setIsp] = useState('');
  let [capital, setCapital] = useState('');
  let [flagImg, setFlagImg] = useState('');
  let [currency, setCurrency] = useState('');
  let [currencySymbol, setCurrencySymbol] = useState('');
  let [flagAlt, setFlagAlt] = useState('');
  let [timezone, setTimezone] = useState('');
  let [subregion, setSubregion] = useState('');
  let [countryCode, setCountryCode] = useState('');
  let [myTime, setMyTime] = useState('');
  let [population, setPopulation] = useState('');

  const position = [lat, lon];

  useEffect(() => {
    axios
      .get(`http://ip-api.com/json/`)
      .then(function (response) {
        // handle success

        setIp(response.data.query);
        setIsp(response.data.isp);
        setLat(response.data.lat);
        setLon(response.data.lon);
        setCity(response.data.city);
        setCountry(response.data.country);
        setCountryCode(response.data.countryCode);
        setTimezone(response.data.timezone);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/name/${country}`)
      .then(function (response) {
        // handle success
        setCapital(response.data[0].capital[0]);
        setFlagImg(response.data[0].flags.png);
        setCurrency(response.data[0].currencies.EUR.name);
        setCurrencySymbol(response.data[0].currencies.EUR.symbol);
        setFlagAlt(response.data[0].flags.alt);
        setTimezone(response.data[0].timezones[0]);
        setSubregion(response.data[0].subregion);
        setPopulation(response.data[0].population);
        console.log(response.data[0]);
      });
  }, [country, countryCode]);

  useEffect(() => {
    let interval = setInterval(() => {
      let currentTime = DateTime.local()
        .setZone(timezone)
        .setLocale(`${countryCode}`)
        .toFormat('dd LLL yyyy  HH:mm:ss')
        .toString();

      setMyTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [countryCode, timezone]);

  return (
    <div>
      <div className="map">
        {ip ? (
          <MapContainer
            center={position}
            zoom={5}
            style={{ height: '50vh', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                {city}, {country} Lat:{lat} / Lon: {lon}
                <hr />
                <p>
                  {ip} / {isp}
                </p>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="info">
        <center>
          <h2>Your ip: {ip}</h2>
          <h2>Your local time: {myTime}</h2>
          <p>
            Location:{' '}
            <strong>
              {city}, {country} <img className="flag" src={flagImg} alt="" />
            </strong>
          </p>
          <p>
            Provider: <strong>{isp}</strong>
          </p>
        </center>
        <p>
          Capital of {country} is {capital}. Population of {country} is{' '}
          {population} people. Local currency in {country} is {currency} with
          currency symbol {currencySymbol}. {flagAlt} {country} is located in{' '}
          {subregion} with timezone {timezone}.
        </p>
      </div>
    </div>
  );
}

export default App;
