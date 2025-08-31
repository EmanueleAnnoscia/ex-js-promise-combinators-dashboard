//fetchjson
async function fetchJson(url) {
    const response = await fetch(url);
    const obj = await response.json();
    return obj;
}


const getDashboardData = async (query) => {


    try {

        // lancio le 3 richieste in parallelo
        const results = await Promise.allSettled([
            fetchJson(`http://localhost:3333/destinations?search=${query}`),
            fetchJson(`http://localhost:3333/weathers?search=${query}`),
            fetchJson(`http://localhost:3333/airports?search=${query}`)
        ])

        // prelevo il primo risultato da ogni array
        const [destinations, weathers, airports] = results.map(res => res.status === "fulfilled" && res.value.length > 0 ? res.value[0] : null )


        const getDashboardData = {
            city: destinations ? destinations.name : null,  //EXTRA destination?.name ?? null
            country: destinations ? destinations.country : null, //EXTRA destination?.country ?? null
            temperature: weathers ? weathers.temperature : null, //EXTRA weathers?.weather_description ?? null
            weather: weathers ? weathers.weather_description : null, //EXTRA airports?.name ?? null
            airport: airports ? airports.name : null
        }

        return getDashboardData;

    } catch (error) {
        console.error('Errore in getDashboardData', error.message)
        throw (error);
    }
}

(async () => {
    try {
        const data = await getDashboardData("sydney")
        let message = "";
        if (data.city && data.country){
            message += `${data.city} is in ${data.country} \n`
        }

        if(data.temperature && data.weather){
            message += `Today there are ${data.temperature} degrees and the weather is ${data.weather}.  \n`
        }

        if(data.airport){
            message += `The main airport is ${data.airport}.  \n`
        }

        console.log(message || "No data available for this query.");

    } catch (error) {
        console.error(error.message)
    }
})()