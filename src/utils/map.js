  export function mGeolocation(geolocation) {
    return new Promise ((resolve) => {
        geolocation.getCurrentPosition ((status, result) => {
            return resolve ({status, result})
        })
    });
  }

  export function mPositionPicker(m) {
    return new Promise ((resolve) => {
        AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
            var positionPicker = new PositionPicker ({
                mode: 'dragMap',
                map: m
            });
            positionPicker.on ('success', res => {
                console.log('*');
                return resolve ({status: 'success', res});
            });
            positionPicker.on ('fail', err => {
                return resolve ({status: 'err', err});
            })
            positionPicker.start ();
        });
    });
  }