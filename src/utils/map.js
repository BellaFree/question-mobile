import Vue from 'vue';
import { Notify } from 'vant';
Vue.use(Notify);

export const geolocation = new AMap.Geolocation ({
    enableHighAccuracy: true,
    timeout: 10000,
    buttonPosition: 'LB',
    buttonDom: '<img class="back-position" src="/img/check-in/backPosition.png" />',
    buttonOffset: new AMap.Pixel (10, 50),
    zoomToAccuracy: true,
});
  
export function mGeolocation(geolocation) {
    return new Promise ((resolve) => {
        geolocation.getCurrentPosition ((status, result) => {
            if (status != 'complete') {
                Notify({ type: 'warning', message: result.message, duration: 1000 });
            }
            return resolve ({status, result})
        })
    });
};