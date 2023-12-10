import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import TollDetails from './TollDetails';
import './Map.css';

/**
 * Map component for displaying routes and toll information.
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.routeCoordinates - Array of encoded polyline coordinates for the route.
 * @returns {JSX.Element} - Rendered component.
 */
const Map = ({ routeCoordinates }) => {
  const [decodedRoute, setDecodedRoute] = useState([]);
  const [tollInfo, setTollInfo] = useState([]);

  /**
   * Decode polyline coordinates using the @mapbox/polyline library.
   * @param {string} encoded - Encoded polyline string.
   * @returns {Array} - Decoded coordinates.
   */
  const decodePolyline = (encoded) => {
    try {
      return polyline.decode(encoded, { precision: 5 }).map(point => [parseFloat(point[0]), parseFloat(point[1])]);
    } catch (error) {
      console.error('Invalid encoded polyline:', encoded);
      return [];
    }
  };

  useEffect(() => {
    const decoded = routeCoordinates.map(decodePolyline);
    setDecodedRoute(decoded);

    
    const exampleTollInfo = [
      { boothName: 'Toll Booth A', cost: '$5.00', position: [37.7749, -122.4194], additionalInfo: 'Express lane' },
      { boothName: 'Toll Booth B', cost: '$7.50', position: [34.0522, -118.2437], additionalInfo: 'Cash only' },
    ];
    setTollInfo(exampleTollInfo);
  }, [routeCoordinates]);

  const center = routeCoordinates.length > 0 ? routeCoordinates[0] : [0, 0];

  const tollMarkers = tollInfo.map((toll, index) => (
    <Marker key={index} position={toll.position || [0, 0]}>
      <Popup>
        <strong>Toll Booth:</strong> {toll.boothName}, <strong>Cost:</strong> {toll.cost}
        {toll.additionalInfo && (
          <span>, <strong>Additional Info:</strong> {toll.additionalInfo}</span>
        )}
      </Popup>
    </Marker>
  ));

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={decodedRoute} color="blue" />
        {tollMarkers}
      </MapContainer>
      <TollDetails tollInfo={tollInfo} />
    </div>
  );
};

export default Map;
