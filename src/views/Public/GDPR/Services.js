import { Microservices } from "../../../../shared/MicroServices";
const location = typeof window !== "undefined" ? window.location : {};
const adatkezeleskUrl = location.origin + "/api/adatkezeles";

export default class Services {
  // ADATKEZELES START

  static listAdatkezeles = () => {
    let result = Microservices.fetchApi(adatkezeleskUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
      },
    });

    return result;
  };
  // ADATKEZELES END
}
