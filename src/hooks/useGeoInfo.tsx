import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

type GeoProps = {
    countryName: string,
    status: string,
}

const useGeoInfo = (): GeoProps => {
    const [countryName, setCountryName] = useState<string>('');
    const [status, setStatus] = useState<string>('idle');
    useEffect(() => {
        const fetchGeoInfo = async () => {
            setStatus('fetching');
            axios.get(process.env.REACT_APP_LOCATION_API as string)
                .then((location: AxiosResponse) => {
                    setCountryName(location.data?.country_name);
                }).finally(() => setStatus('fetched'))
        }
        fetchGeoInfo();
    }, []);
    return {
        countryName,
        status,
    }
}

export default useGeoInfo;
