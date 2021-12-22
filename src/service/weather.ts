import axios from 'axios';

import { Weather } from '../datamodel';

export class WeatherService {
  public async getWeatherNow(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const loaction = '121.64,38.92'
      Promise.all([getNowData(loaction), get24HData(loaction)]).then((response: any[]) => {
        const weatherNow: Weather = response?.[0]?.data?.now;
        const weather24H: Weather[] = response?.[1]?.data?.hourly;
        resolve(this.makeATextForTTS(weatherNow, weather24H));
      })
    });
  }

  private makeATextForTTS(now: Weather, hours: Weather[]) {
    // 一小时内是否需要带伞
    if (now.feelsLike && now.feelsLike < 4) return '需要穿羽绒服！';
    return '穿个毛线。';
  }
}


export function getNowData(pos: string) {
  return request({
    url: '/now',
    params: {
      location: pos
    }
  })
}

export function get24HData(pos: string) {
  return request({
    url: '/24h',
    params: {
      location: pos
    }
  })
}

function request(config: any) {

  const instance = axios.create({
    baseURL: 'https://devapi.qweather.com/v7/weather',
    timeout: 5000
  });

  instance.interceptors.request.use(
    (config: any) => {
      config.params.key = process.env.HE_FENG_KEY;
      return config
    },
    (err: unknown) => { console.log(err) }
  )


  return instance(config);
}