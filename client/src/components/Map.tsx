import React, { useRef, useEffect } from 'react';
import { google } from '@types/googlemaps';

const Map: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        if (!window.google) {
            console.error('Google Maps JavaScript API is not loaded');
            return;
        }

        const map = new google.maps.Map(mapRef.current, {
            center: { lat: 0, lng: 0 },
            zoom: 4,
        });

        map.addListener('click', (event: google.maps.MouseEvent) => {
            console.log('Selected location:', event.latLng.toJSON());
        });
    }, []);

    return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default Map;
