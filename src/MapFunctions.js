import {useMap} from "react-leaflet"
import {useEffect} from "react"

function MapCleanup({drawnItems, setDrawnItems}) {
    const map = useMap();

    useEffect(() => {
        if (drawnItems.length > 0) {
        drawnItems.forEach(layer => {
            map.removeLayer(layer);
        })
        setDrawnItems([]);
        }
    }, [drawnItems, map, setDrawnItems]);

    return null;
}


export {MapCleanup};