const path = require('path');
const resolve = file => path.resolve(__dirname, file);
module.exports  ={
    resolve: {
        alias: {
            '@': resolve('src'),
            '@api': resolve('api')
        }
    }
}
