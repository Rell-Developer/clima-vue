import { computed, ref } from "vue";
import axios from "axios";

const useClima = () => {
    // States
    const clima = ref({});
    const cargando = ref(false);
    const error = ref("");

    // Fetching
    const obtenerClima = async(busqueda: { ciudad: string; pais: string }): Promise<void> => {
        try {
            // Reseteamos los valores
            clima.value = {};
            cargando.value = true;
            error.value = "";

            // Obtenemos la key por variables de entorno
            const key = import.meta.env.VITE_API_KEY;
            // Obtenemos la lat y lng
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${busqueda.ciudad},${busqueda.pais}&limit=1&appid=${key}`;
            const { data } = await axios(url);

            const urlClima = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${key}`;
            const { data: response } = await axios(urlClima);
            clima.value = response;
        } catch (e) {
            error.value = "Ciudad no Encontrada";
        }finally{
            cargando.value = false;
        }
    }

    const mostrarClima = computed(()=> Object.values(clima.value).length > 0);
    const formatearTemperatura = (temperatura:number): number => parseInt((temperatura - 273.15).toString());

    return {
        clima,
        mostrarClima,
        cargando,
        formatearTemperatura,
        obtenerClima,
        error
    }
}

export default useClima;