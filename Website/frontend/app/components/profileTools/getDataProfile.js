import axios from "axios";

export async function getDataProfile(userName, api) {
  const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
  const nginx = process.env.nginx_host;

  try {
    const url = `${nginx}/Dashboard_home/${api}/${userName}`;
    const response = await axios.get(url,{maxRedirects: 0});
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}