const { Server, Client } = require('node-osc')
const path = require("node:path")
const fs = require("fs")
const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "config.json")))

console.log(`--------- [MagicOSC Splitter] ---------`);
console.log(`Thank you for your interest in my project.`)
console.log(`Check out other projects at https://kfn.moe\n`)
console.log(`I recommend not changing the config in the VRCHAT section.`)
console.log(`For config in other programs that will connect to this Splitter, set the listen port to ${config.splitter.port} and change the out port to whatever you want.`)
console.log(`And set the port and host other programs in the Device section.\n`)
console.log(`[LOGS] -------------------------------`)

const VRCReciver = new Server(config.VRCHAT.in, config.VRCHAT.host, () => {
    console.log('OSC VRCReciver is listening @', config.VRCHAT.host+":"+config.VRCHAT.in);
    console.log('OSC VRCSender is Running @', config.VRCHAT.host+":"+config.VRCHAT.out);
});
const SplitterReciver = new Server(config.splitter.port, config.VRCHAT.host, () => {
    console.log('OSC SplitterReciver is listening @', config.splitter.host+":"+config.splitter.port);
});
const VRCSender = new Client(config.VRCHAT.host, config.VRCHAT.out);
let devices = []
config.devices.forEach(e => {
    devices.push({
        name: e.name,
        client: new Client(e.host, e.listen_port),
    })
})
SplitterReciver.on('message', function (msg) {
    if(config.debug.splitter) console.log("SplitterReciver:",msg)
    VRCSender.send(msg[0], msg[1], (err) => {});
});
VRCReciver.on('message', function (msg) {
    devices.forEach(e => {
        if(config.debug.VRC) console.log("VRCReciver:",msg)
        e.client.send(msg[0], msg[1], (err) => {});
    })
});