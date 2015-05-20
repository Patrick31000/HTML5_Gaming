var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var md5 = require('MD5');

app.use('/', express.static(__dirname + '/client'));
app.get('/', function(req, res){
    res.sendfile(__dirname + '/client/index.html');
});

var color = ['#999999', '#CCCCCC', '#00FF00', '#0000FF', '#FF0000', '#FFFF00'];
var users = {};
var nbParticule = 250;
var particules = [];

for (var i = 0; i < nbParticule; i++)
{
    particules[i] = {
        x: randomIntInc(0, 5000),
        y: randomIntInc(0, 5000),
        color: color[randomIntInc(0, 5)],
        id: i
    };
}


io.on('connection', function(socket){
    var me = false;

    socket.on('new_player', function(user){
        me = user;
        socket.emit('getParticules', particules);

        for (var k in users){
            socket.emit('new_player', users[k]);
        }

        users[me.id] = me;
        socket.broadcast.emit('new_player', user);
    });

    socket.on('delete_particule', function(id){
        particules[id].x = randomIntInc(0, 5000);
        particules[id].y = randomIntInc(0, 5000);
        console.log(id);
        socket.broadcast.emit('update_particles', particules[id]);
    });

    socket.on('move_player', function(user){
        users[me.id] = user;
        socket.broadcast.emit('move_player', user);
    });

    socket.on('disconnect', function(){
        if(!me){
            return false;
        }
        delete users[me.id];
        socket.emit('logout', me.id);
    });

});

server.listen(3000, function(){
    console.log('listening on *:3000');
});

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}