import { useState, useEffect } from 'react';
import { fetchWeatherApi, WeatherApiResponse } from 'openmeteo';
import Chart from 'chart.js/auto';

const WeatherChart = () => {
    const [latitude, setLatitude] = useState<number>(39.658871); 
    const [longitude, setLongitude] = useState<number>(-4.043740); 
    const [chartLoaded, setChartLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (chartLoaded) {
            fetchData();
        }
    }, [chartLoaded]);

    const fetchData = async () => {
        const params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": "temperature_2m"
        };
        const url = "https://api.open-meteo.com/v1/forecast";

        try {
            const responses: WeatherApiResponse[] = await fetchWeatherApi(url, params);
            const response = responses[0];

            const utcOffsetSeconds = response.utcOffsetSeconds();
            const hourly = response.hourly()!;
            const timeRange = range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval());
            const temperatures = hourly.variables(0)!.valuesArray()!;

            const ctx = document.getElementById('weatherChart')!.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timeRange.map(t => new Date((t + utcOffsetSeconds) * 1000).toISOString()),
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: temperatures,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {}
            });
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const range = (start: number, stop: number, step: number) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const handleLatitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLatitude(parseFloat(event.target.value));
    };

    const handleLongitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLongitude(parseFloat(event.target.value));
    };

    const handleButtonClick = () => {
        setChartLoaded(true);
    };

    return (
        <div>
            <div>
                <label htmlFor="latitude">Latitude:</label>
                <input type="number" id="latitude" value={latitude} onChange={handleLatitudeChange} />
            </div>
            <div>
                <label htmlFor="longitude">Longitude:</label>
                <input type="number" id="longitude" value={longitude} onChange={handleLongitudeChange} />
            </div>
            <button onClick={handleButtonClick}>Get Weather Chart</button>
            <canvas id="weatherChart" width="400" height="400"></canvas>
        </div>
    );
};

export default WeatherChart;
