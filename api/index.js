'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

// quitar aviso de mongoose promise de la consola. Sec: 3, clase: 16
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => {
    if (err){
        throw err;
    } else {
        console.log('db started successfully...');

        app.listen(port, function(){
            console.log('web server running at port ' + port);
        })
    }
});


