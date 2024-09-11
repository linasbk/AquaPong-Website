import axios from "axios";
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const nginx = process.env.nginx_host;
export  const gameThemes = {

        DarkAqua : {
            primaryColor : '#793AFF',
            secondColor : '#3B3A3A',
            background : `relative h-full w-full bg-cover bg-center  bg-[url(/gameElement/gameBg.png)]`,
            secondColor : '#5b0fff',
            background : `absolute h-full w-full bg-cover bg-center blur-lg bg-[url(/maps/darkaqua.png)]`,
            bgName : '/maps/darkaqua.png',
            headerBackground : 'md:w-32 sm:w-28 w-16  bg-cover drop-shadow-2xl border-2 border-black border-solid rounded-tl-lg rounded-br-lg bg-gradient-to-br from-violet-600 to-violet-950',
            canvasBackground : "bg-[url('/gameElement/table.svg')] bg-contain bg-center bg-no-repeat  origin-center",
            name : 'DarkAqua'
        },

        Aqua : {
            primaryColor : '#66FCF1',
            secondColor : '#3B3A3A',
            background : `absolute h-full w-full bg-cover bg-center blur-lg bg-[url(/maps/aqua.png)]`,
            bgName : '/maps/aqua.png',
            headerBackground : 'md:w-32 sm:w-28 w-16  bg-cover drop-shadow-2xl border-2 border-voilet border-solid rounded-tl-lg \
            rounded-br-lg bg-gradient-to-br from-teal-600 to-teal-950',
            canvasBackground : "bg-[url('/gameElement/AquaTable.svg')] bg-contain bg-center bg-no-repeat  origin-center",
            name : 'Aqua'
        },
        GoldAqua : {
            primaryColor : '#FFAE00',
            secondColor : '#e9c058',
            background : `absolute h-full w-full bg-cover bg-center blur-lg bg-[url(/maps/goldaqua.png)]`,
            bgName : '/maps/goldaqua.png',
            headerBackground : 'md:w-32 sm:w-28 w-16  bg-cover drop-shadow-2xl border-2 border-voilet border-solid rounded-tl-lg \
            rounded-br-lg bg-gradient-to-br from-teal-600 to-teal-950',
            canvasBackground : "bg-[url('/gameElement/AquaTable.svg')] bg-contain bg-center bg-no-repeat  origin-center",
            name : 'GoldAqua'
        },
};

 async function getDataTheme() {
    return await axios.post(`${API_ADDRESS}/Dashboard_home/set_selected_map`, {
        map_name: "get_map",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.data)
      .catch(error => {
          console.error('Error:', error.response ? error.response.data : error.message);
          return null;
      });
}

export const GameParams = async () => {
    const theme = await getDataTheme();
    if (theme) {
        if (theme.map_name === 'DARKAQUA') {
            return gameThemes.DarkAqua;
        } else if (theme.map_name === 'AQUA') {
            return gameThemes.Aqua;
        } else {
            return gameThemes.GoldAqua;
        }
    }
    return null;
};