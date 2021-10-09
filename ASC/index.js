//Dependencies
const Discord = require("discord.js-selfbot-v11")
const Request = require("request")
const Delay = require("delay")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

const User = new Discord.Client()

//Main
if(!Self_Args){
    console.log(`node index.js <discord_token> <dictionary> <changing_delay(seconds)>
Example: node index.js yourdiscordtoken dictionary_test.txt 5`)
    process.exit()
}

if(!Self_Args[0]){
    console.log("Invalid discord_token.")
    process.exit()
}

if(!Self_Args[1]){
    console.log("Invalid dictionary.")
    process.exit()
}
if(!Self_Args[2]){
    console.log("Invalid changing_delay.")
    process.exit()
}

if(isNaN(Self_Args[2])){
    console.log("Invalid changing_delay, changing_delay is not an Int.")
    process.exit()
}

if(Self_Args[2] < 5){
    console.log("Invalid changing_delay, minimum is 5.")
    process.exit()
}

const Dictionary = Fs.readFileSync(Self_Args[1], "utf8").split("\n")

if(!Dictionary){
    console.log("Invalid dictionary.")
    process.exit()
}

var self_index = 0

User.on("ready", function(){
    console.log("Status message changer is running.")

    Looper()
    async function Looper(){
        await Delay(Self_Args[2] * 1000)

        Request.patch("https://discord.com/api/v9/users/@me/settings", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": Self_Args[0]
            },
            "body": JSON.stringify({ "custom_status": { "text": Dictionary[self_index], "expires_at":"2021-10-10T06:59:59.999Z" } })
        }, function(err, res, body){
            console.log(`Changed to ${Dictionary[self_index]}`)
        })

        self_index += 1
        Looper()
    }
})

User.login(Self_Args[0]).catch(()=>{
    console.log("Invalid discord_token.")
    process.exit()
})
