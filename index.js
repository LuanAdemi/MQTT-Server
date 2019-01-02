var mosca = require('mosca');
const ora = require('ora');
var colors = require('colors');
const signale = require('signale')
const {Signale} = require('signale');
var clear = require("cli-clear");
var clients = 0;
clear();
const spinner = ora('Starting Server').start()
var settings = {
		port:1883
		}

var server = new mosca.Server(settings);

const options = {
    disabled: false,
    interactive: false,
    stream: process.stdout,
    scope: 'Server',
    types: {
      connected: {
        badge: '',
        color: 'green',
        label: 'connection'
      },
      disconnected: {
        badge: '',
        color: 'red',
        label: 'connection'
      },
      message: {
        badge: '➡︎',
        color: 'yellow',
        label: 'message'
      }
    }
  };

  const custom = new Signale(options);

server.on('ready', function(){
spinner.stop()
signale.start("Server has started!\n")
});



server.on('clientConnected', function(client) {
    var ipadress = client.connection.stream.remoteAddress
    custom.connected('   A client withe the IP ' + colors.green(ipadress.replace(/[:f]/g,"")) + ' has connected!\n')
    clients += 1
});
server.on('clientDisconnected', function(client) {
    clients -= 1
    var ipadress = client.connection.stream.remoteAddress
    custom.disconnected("   " + colors.green(ipadress.replace(/[:f]/g,"")) + ' has disconnected!\n')
    if (clients == 0) {
        setTimeout(function(){
            clear()
            signale.start("Server has started!\n")
        },2000)
    }
  
    
});

server.on('published', function(packet, client) {
    if(!packet.topic == "$SYS/BZDXan~/new/clients" && !packet.topic == "$SYS/BZDXan~/new/subscribes") {
        custom.message('Published ' +`"${packet.payload}"`.blue + ' in the Topic ' + `"${packet.topic}"`.yellow  + '\n');
    }
   
  });

  process.on('SIGINT', function() {
    const endspinner = ora('Exiting').start()
    setTimeout(function(){
        clear()
        signale.start("Server has stopped!\n")
        server.close()
        process.exit(0)
    },5000)
});




