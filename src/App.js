import './App.css';
import "leaflet/dist/leaflet.css"
import {MapContainer, TileLayer, Marker, Popup, FeatureGroup} from "react-leaflet"
import L from "leaflet"
import {Icon, divIcon} from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import {EditControl} from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"
import {useState, useEffect} from "react"
import {MapCleanup} from "./MapFunctions"

L.Icon.Default.mergeOptions({
  iconUrl:
  "https://cdn-icons-png.flaticon.com/128/2642/2642502.png",
  iconSize: [38, 38]
})

const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/2642/2642502.png",
  iconSize: [38, 38]
})

const createCustomClusterIcon = (cluster) => {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
  });
};


function App() {

  const created = (e) => {
    const layer = e.layer
    var newMarker = {};

    if (layer instanceof L.Marker) {
      const latlng = layer._latlng;
      console.log(latlng)
      const feedback = prompt("What do you want to say about this location?")
      newMarker = {
        geocode: [latlng.lat, latlng.lng],
        popup: feedback || `user marker ${markers.length - 3}`
      }
    }

    setMarkers((prev) => [...prev, newMarker])
    setDrawnItems((prev) => [...prev, layer])
    console.log("markers:", markers)
    console.log("drawn items:",drawnItems)
  }

  const [drawnItems, setDrawnItems] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
      fetch("/data/markers.json")
          .then(res => res.json())
          .then(data => {
              const newMarkers = data.features.map(feature => ({
                  geocode: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
                  popup: feature.properties.popup || ""
              }));
              setMarkers(newMarkers);
              })
          }, []);

  return (
    <div>
      <h1>Leaflet</h1>
      <MapContainer center={[1.3187311,103.8167564]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          maxZoom={20}
        />
        <FeatureGroup>
          <EditControl position="topright" 
            onCreated={created}
            draw={{
              polyline:false,
              polygon:false,
              circle:false,
              rectangle:false,
              marker:true,
              circlemarker:false
            }}
            edit={{
              edit: false,
              remove:false
            }}
            markerIcon={customIcon}
           />
        </FeatureGroup>
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createCustomClusterIcon}>
        {markers.map((marker) => (
          <Marker position={marker.geocode} icon={customIcon}>
            <Popup><h2>{marker.popup}</h2></Popup>
          </Marker>
        ))}
        </MarkerClusterGroup>

        <MapCleanup drawnItems={drawnItems} setDrawnItems={setDrawnItems}/>
      </MapContainer>
    </div>
  );
}

export default App;
