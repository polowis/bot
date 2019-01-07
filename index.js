// require discord package npm install discord.js --save
const Discord = require('discord.js');

const Util = require('discord.js')

const config = require("./config.json")
// require ytdl-core npm install
const YTDL = require("ytdl-core");

const audio = require("opusscript");

const cleverbot = require('cleverbot.io')

//const Danbooru = require('danbooru');

const weather = require("weather-js");

const YouTube = require('simple-youtube-api');

const youtube = new YouTube(config.youtube)

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/discorddb', {
    useNewUrlParser: true
})

const Coins = require("./coins.js")


//token of the bot

const PREFIX = "$";

const queue = new Map()

const superagent = require('superagent');

const Booru = require('booru')

//const dispatcher = connection.playStream()

// fortunes game, get random in three strings
var fortunes = [
    "Yes",
    "No",
    "Maybe",
]
//flip coin game, 50/50 
var flip = [
    "Head",
    "Tail",
]

//riddle game, get random riddle from the list
var riddle = [
    "What is full of holes but can still hold water? \n -> A sponge",
    "What has keys but no locks and space but no room? \n -> A computer",
    "How many books can you put into an empty package? \n -> One, after that it's not empty",
    "What type of room has no windows or doors? \n -> A mushroom",
    "If you have one, you don't share it, if you share it, you don't have it? \n -> A secret",
    "What are the only two things you can't have for breakfast? \n -> Lunch and Dinner",
    "How many months have 28 days? \n -> All of them",
    "What goes up but never comes down? \n -> Your age",
    "What comes down but never goes up? \n -> Rain",
    "How can you go 10 days without sleeping? \n -> Just sleep at night",
    "What is the difference between blue paint and green paint? \n -> Yellow paint",
    "Which weighs more, a ton of feathers or a ton of bricks? \n -> Neither. They both weight a ton",
    "What can be caught but not thrown? \n -> Cold",
    "What gets wetter as it dries? \n -> A towel",
    "What has a head and a tail but no legs? \n -> A penny!",
    "What do you throw out when you want to use it, and take in when you don't? \n -> An anchor",
    "What has a lot of keys but can't open any door? \n -> A piano!!",
    "What gets bigger and bigger as you take more away from it? \n->  A hole!",
    "What can be cracked, made, told and played? \n -> A Joke !!",
    "What starts with a P and ends with an E and has a million letters in it? \n -> Post Office!",
    "A cowgirl rides into town on Friday, stays three days and leaves on Friday. How did she do it? \n -> Her horse is named Friday",
    "What two days start with T? ( Other than Tuesday and Thursday) \n -> Today and Tomorrow",
    "What starts out tall, but the longer it stands, the shorter it grows? \n -> A Candle",
    "What has a neck but no head? \n -> A bottle",
];



var bot = new Discord.Client();

var bot2 = new cleverbot();

bot2.setNick("session")

var url = "mongodb://localhost:27017/";




 

bot.on('ready', function(){
    console.log("I am ready");
    bot.user.setActivity("$help with polowis", { type: 'PLAYING'});
})

/*function play(connection, message){

var server = servers[message.guild.id]
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter : "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function(){

    if(server.queue[0])play(connection, message);
    
    else 
        connection.disconnect();
    
});
}*/
//bot.on("add", function(member){
  //  member.guild.channels.find("name", "ranked")
//})   

bot.on("message", async message => {
    
   

    if (message.author.equals(bot.user)) return;
    var args = message.content.substring(PREFIX.length).split(" ")
    var id = message.author.id
    var username = message.author.username;





   
    
    if (message.isMentioned(bot.users.get(''))){
        var ques = message.content.slice(args[0].length);
        var wait = await message.channel.sendMessage("bot is Typing....")
                bot2.create(function (err, session) {
        
                  
                  });
                  
                  bot2.ask(ques, function (err, response) {
                   message.channel.sendMessage(response);
                   console.log(ques)
                  // console.log(ques + " id of author " + message.author.id)
                   console.log(response)
                    wait.delete()
                   if (message.guild === null){
                    
                    message.author.sendMessage(response)
                }  
            });
        }
    
    var swearWord = []
    if(swearWord.some(word => message.content.includes(word))){
        message.delete()
       
    }
    // check if the message start with prefix $
    if (!message.content.startsWith(PREFIX)) return;

    var searchString = args.slice(1).join(' ');
    var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    var serverQueue = queue.get(message.guild.id);
    var coinadd = Math.ceil(Math.random() * 20)
   /* Coins.findOne({userID: message.author.id, serverID: message.guild.id}, (err,money)=>{
        if(err) console.log(err)
        if(!money){
            const newCoins = new Coins({
                userID: message.author.id,
                serevrID: message.guild.id,
                money : coinadd
            })
        }
    })*/
    
    //swtich case function for each message that is a valid command. 
    

        //-----------------------COMMANDS LINES_____


    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage("Pong! "+ [(Date.now() - (message.author.createdTimestamp))]+ "ms");
            break;

        

        case "lb":
        if(message.author.id !== '') return;
        Coins.find({serverID: message.guild.id}).sort(['coin', 'descending']).exec((err, res) => {
            if(err) console.log(err);
    
            let embed9 = new Discord.RichEmbed().setTitle("Leaderboard")
    
            if(res.length === 0){
                embed9.setColor("RED")
                embed9.addField("No data found")
            }
            else if(res.length < 10){
                embed9.setColor("BLUE")
                for(i=0; i<res; i++) {
                    let member1 = message.guild.member.get(res[i].userID) || "User Left"
                    if (member1 === "User Left"){
                        embed9.addField(`${i + 1}. ${member1}`, `**Coins**: ${res[i].coins}`)
                    } else{
                        embed9.addField(`${i + 1}. ${member1.user.username}`, `**Coins**: ${res[i].coins}`)
                    }
                }
            } else{
                embed.setColor("BLUE");
                for(i=0; i<10; i++){
                    let member1 = message.guild.member.get(res[i].userID) || "User Left"
                    if (member1 === "User Left"){
                        embed9.addField(`${i + 1}. ${member1}`, `**Coins**: ${res[i].coins}`)
                    }  else{
                        embed9.addField(`${i + 1}. ${member1.user.username}`, `**Coins**: ${res[i].coins}`)
                    }
                }
            }
            message.channel.send(embed9)
        }   
            
        )
        break;
      
        //command function for bot info
        case "info":
            message.channel.sendMessage("I am made with love by Polowis");
            break;

        case "hello":
            message.channel.sendMessage("Hi there");
            break;

        // command function for fortune game
        case "fortune":
            if (args[1]) {
                message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
            } else{
                message.channel.sendMessage("I can't read your question") 
            }
            break;

            // Command function for flipcoin game
        case "flipcoin":
    
            if (args[0]) {
                message.channel.sendMessage(flip[Math.floor(Math.random() * flip.length)]);
            }
            break;
        case "deleterole":
            let roles = message.content.split(" ")[1]
            if (!roles){
            	message.channels.sendMessage("Please provide a valid role")
            }
            else{
            	message.member.guild.roles.find("name", roles).delete()
            	message.channel.sendMessage("Deleted")
            }

        case "booru":

        let [ imgs ] = await Booru.search(''['rating:explicit'], {limit: 1, random: true})
        
        .then(images => {
            //Log the direct link to each image
           
              console.log(imgs.common.file_url)
            
          })
          .catch(err => {
            if (err.name === 'BooruError') {
              //It's a custom error thrown by the package
              console.log(err.message)
            } else {
             
              console.log(err)
            }
          })

            break;
        case "play":
        var voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) 
        return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		var permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
        }
        
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			var playlist = await youtube.getPlaylist(url);
			var videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
`)

            try {
                    var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                        maxMatches: 1,
                        time: 10000,
                        errors: ['time']
    });
    
}           catch (err) {
                        console.error(err);
                        return message.channel.send('No or invalid value entered, cancelling video selection.');
}
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
}           catch (err) {
                        console.error(err);
                        return message.channel.send('🆘 I could not obtain any search results. nya~~');
}
}
                        return handleVideo(video, message, voiceChannel);
}
                        break;
            case "skip":
            if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
            if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
            serverQueue.connection.dispatcher.end('Skip command has been used! nya~~');
            return undefined;
            break;

            case "stop":
            if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		    if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
		    serverQueue.songs = [];
		    serverQueue.connection.dispatcher.end('Stop command has been used! nya~~');
		    return undefined;

            case "volume":
            if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		    if (!serverQueue) return message.channel.send('There is nothing playing.');
		    if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		    serverQueue.volume = args[1];
		    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
            return message.channel.send(`I set the volume to: **${args[1]}**`);
            break;

            case "queue":
            if (!serverQueue) return message.channel.send('There is nothing playing.');
		    return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
        `);
            break;

            case "pause":
            if (serverQueue && serverQueue.playing) {
                serverQueue.playing = false;
                serverQueue.connection.dispatcher.pause();
                return message.channel.send('⏸ Paused the music for you! nya~~');
            }
            return message.channel.send('There is nothing playing. nya~~');
            break

            case "resume":
            if (serverQueue && !serverQueue.playing) {
                serverQueue.playing = true;
                serverQueue.connection.dispatcher.resume();
                return message.channel.send('▶ Resumed the music for you! nya~~');
            }
            return message.channel.send('There is nothing playing. nya~~');
            break
        
    
    

            /*let text = message.content.split(" ")[1]
            if (!args[0])
               return message.channel.sendMessage("Please provide a link");
                

            if (!message.member.voiceChannel)
                return message.channel.sendMessage("You must be in the voice channel");
                
            
            let validate = await YTDL.validateURL(args[1])
            if(!validate)
                 return message.channel.sendMessage("Please provide a valid URL")
            let info = await YTDL.getInfo(args[1])
            let connection = await message.member.voiceChannel.join()
            let dispatcher = await connection.playStream(YTDL(args[1], { filter: "audioonly"}));
            let data = ops.active.get(message.guild.id) || {};
            let queue = []
            message.channel.sendMessage("Now playing: " + text + " ")
           
            queue.push({
                songTitle: info.title,
                url: args[1]
            })
            message.channel.sendMessage("Added a song to queue")*/
            

       /*     if(!data.connection) 
            data.connection = await message.member.voiceChannel.join()
            let queue = []

            if(!data.queue) data.queue = [];
            data.guildID = message.guild.id;

            
         //   let info = await YTDL.getInfo(args[1]);

            data.queue.push({
                songTitle: info.title,
                requester: message.author.tag,
                url: args[1],
                announceChannel: message.channel.id,
            });
            if(!data.dispatcher) playStream(bot, ops, data)
            else{
                message.channel.sendMessage(`Added to queue: ${info.title}`)
            }
            ops.active.set(message.guild.id, data)

            async function play(bot, ops, data){
                bot.channels.get(data.queue[1]).send(`Now playing : ${data[1]}`)
                data.dispatcher = await data.connection.playStream(YTDL(data.queue[1].url, {filter: 'audioonly'}))
                data.dispatcher.guildID = data.guildID

                data.dispatcher.once('finish', function(){
                    finish(bot, ops, this)
                })
            }
            function finish(bot, ops, dispatcher){
                let fetched = ops.active.get(dispatcher.guildID)

                fetched.queue.shift()

                if(fetched.queue.lenght > 0){
                    ops.active.set(dispatcher.guildID, fetched);

                    play(bot, ops, fetched)
                } else{
                    ops.active.delete(dispatcher.guildID)

                    let vc = bot.guilds.get(dispatcher.guildID).me.voiceChannel;
                    if(vc) vc.leave()
                }
            }

            message.channel.sendMessage("Now playing: " + text + " ")



    
        
        case "add":
            if(message.mentions.members.size === 0)
            return message.channel.send("Please mention a user to give the role")
            var user2 = message.mentions.members.first();
            var name2 = args.slice[1]
            var role = message.guild.roles.find(r => r.name === name2)
            
            if(!role) return message.channel.send("I can\'t seem to find that role");

            try{
                await user2.addRole(role)
                await message.channel.send(`I've added the ${name2} role to ${member.displayName}`);
            } catch (e){
                console.log(e)
            }
            
        case "riddle":
        if (args[0]) {
            message.channel.sendMessage(riddle[Math.floor(Math.random() * riddle.length)]);
        }
        break;
       /* case "password":
        if (args[0]) {
            message.channel.sendMessage(number[Math.floor(Math.random() * number.length)]) + (number[Math.floor(Math.random() * number.length)]);
        }
        break;*/
        case "invite":
             message.channel.createInvite()
            .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
            .catch(console.error);

            message.channel.createInvite()
            .then(invite => message.channel.sendMessage(`Created an invite with a code of ${invite.code}`))
            .catch(console.error);
           
            //message.channel.sendMessage(a)

            break;

            //Command function for noticemesenpai
        case "noticemesenpai":
            // Tag the user with toString method and add some message
            message.channel.sendMessage(message.author.toString() + " Notice!");
            break;
        case "kick":
        var user69 = message.mentions.users.first();
        var reason69 =  message.content.slice(args[0, 1].length);
        if (user69){
            var member69 = message.guild.member(user69)

            if(member69){
                member69.kick(reason69).then(() => {
                    message.channel.send(`Successfully kicked ${user69.tag}`);
                }).catch(err =>{
                    message.channel.send("I cannot kick the member, this user either has a higher role or I don't have permission to kick")
                    console.log(err);
                });
            }else{
                message.channel.send("That user isn\'t in this server")
            }        
        } else{
            message.channel.send("Please mention a valid username")
        }
        break;
        case "ban":
        var user22 = message.mentions.users.first();
        var reason22 =  message.content.slice(args[0, 1].length);
        if (user22){
            var member22 = message.guild.member(user22)

            if(member22){
                member22.ban(reason22).then(() => {
                    message.channel.send(`Successfully kicked ${user22.tag}`);
                }).catch(err =>{
                    message.channel.send("I cannot kick the member, this user has a higher role or I don't have permission to kick")
                    console.log(err);
                });
            }else{
                message.channel.send("That user isn\'t in this server")
            }        
        } else{
            message.channel.send("Please mention a valid username")
        }
        case "setnsfw":
            message.channel.setNSFW()
            break;
        case "setnick":
          // let array = message.content.split("")       
           let nickname =  message.content.slice(args[0, 1].length);
           if (!nickname){
               message.channel.sendMessage("No nickname provided")
           }  
           let member = message.mentions.members.first() || message.guild.members.get(args[1])
           //let point = message.guild.members.get(/[d]/)
           if(!member){
               message.channel.sendMessage("Please mention a valid username of this server")
           }
           if(!message.member.hasPermission("MANAGE_MESSAGES")){
               message.channel.send("You don't have permission to perform this action")
           }

           
            else{
                
               
                //point = nickname
                //point = member.content.get(/[d]/)
                //up = nickname.content.get(/[d]/)
               // mes =  point.replace()
                member.setNickname(nickname)
                .then(console.log)
                .catch(console.error);
            }

            
            break;
            case "cat":
            let msg = await message.channel.sendMessage("Searching....")
            let {body} = await superagent
            .get('https://aws.random.cat/meow')
            console.log(body.file)
            if(!{body})
                return message.channel.sendMessage("I'm dead, try again")
                let aembed = new Discord.RichEmbed()
                .setColor("#42e8f4")
                .setImage(body.file)
                message.channel.sendMessage(aembed)
                msg.delete()
                break;
     /*  case "s":
            let embed = bot.channels.find("name", "ranked")
            let names = message.content.split(" ")[1]
            let info = message.guild.member
            if (!names){
                message.channel.sendMessage("No nickname provided")
            }
            else{
                y = "["+ "0" +"]"
                info.setNickname( y + " " + names)
                .then(console.log)
                .catch(console.error)
            }
            break*/
            //Command function to get user information on the server
            case "purge":
            if(isNaN(args[1])) 
            return message.channel.sendMessage("Please enter a valid amount of message you want to purge")

            if(!message.member.hasPermission('MANAGE_MESSAGES'))
            return message.channel.sendMessage("You don't have permision to perform this action")

            if (args[1] > 100) 
            return message.channel.sendMessage("I can only delete fewer than 100 message at a time")

            message.channel.bulkDelete(args[1])
            .then(console.log)
            .catch(console.error)
            break;

        case "danbooru":
            var booru = new Danbooru()
            var post = await booru.posts({random})
           // var url = booru.url(post.file_url)
           // console.log(url.href)

            break;
        
        case "userinfo":
            // use embed to create an awesome user info. 
            var embed1 = new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setDescription("This is the user info!")
            .setColor("#985986")
            .addField("Full username", (message.author.username)+"#"+(message.author.discriminator))
            .addField("ID", (message.author.id) )
            .addField("Created at", (message.author.createdAt))
            .setThumbnail(message.author.avatarURL);
            message.channel.sendMessage(embed1);
            break;
      //  case "cat":
           
        //    const {body} = superagent.get("aws.random.cat/meow");
          //  var embed5 = new Discord.RichEmbed()
            //.setColor(0x954D23)
            //.setTitle("Meow!")
            //.attachFile(body);
            //message.channel.sendMessage(embed5)
            //break;
         /*   case "chat":
           let ques = message.content.slice(args[0].length);

            bot2.create(function (err, session) {
    
                // Will likely be: "Living in a lonely world"
                // session is your session name, it will either be as you set it previously, or cleverbot.io will generate one for you
                
                // Woo, you initialized cleverbot.io.  Insert further code here
              });
              
              bot2.ask(ques, function (err, response) {
               message.channel.sendMessage(response);
               
            
              });
              break; */
        case "serverinfo":
            var info1 = new Discord.RichEmbed()
            .setDescription("This is the server info!")
            .setColor("#42e8f4")
            .addField("Server name", (message.guild.name))
            .addField("Member", (message.guild.memberCount))
            .addField("Owner", (message.guild.owner))
            .addField("OwnerID", (message.guild.ownerID))
            .addField("Region", (message.guild.region))
            .addField("Created at", (message.guild.createdAt))
            .addField("Server Emojis", (message.guild.emojis))
            .addField("Verification level", (message.guild.verificationLevel))
        
            .setThumbnail(message.guild.iconURL);
            
            message.channel.sendMessage(info1);
            break;
            
        case "weather":
            var w = message.content.split(" ")[1]
            weather.find({search: w, degreetype : "C"}), function(err, result){
                if(err) console.log(err)
                //check if the place is valid
                console.log(JSON.stringify(result, null, 2))                
            
        }
    
            break;
            //Help command. Display all the commands and its usage. 
        case "help":
            var embed = new Discord.RichEmbed()
                .addField("$info", "Get information about this bot")
                .addField("$fortune", "Can I predict the future?")
                .addField("$flipcoin", "Head or Tail?")
                .addField("$noticemesenpai", "notice")
                .addField("$play", "play a music")
                .addField("$riddle", "Are you smart enough?")
                .addField("$userinfo", "Get your user info!")
                .addField("$serverinfo", "Get information about this server")
                .addField("$set", "Set a nickname")
                .addField("$cat", "get random cat image")
                .addField("$purge", "purge messages")
                .addField("$stop", "stop the music")
                .addField("$pause", "Pause the current music")
                .addField("$resume", "Resume the current music")
                .addField("$skip", "Skip the music")
                .setColor("#9ef442")
                .setThumbnail("")
            message.author.sendEmbed(embed);
            message.channel.sendMessage(message.author.toString() + " Check your DM!")
            .then(console.log)
            .catch(console.error)
            break;

            //default response if message contain $ with invalid command
        default:
            message.channel.sendMessage("Invalid Command, please try to use $help to get more information");
    }
    

});

async function handleVideo(video, message, voiceChannel, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
    console.log(video);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(message.guild.id);
            return message.channel.send(`I could not join the voice channel: ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
    }
    return undefined;
}
function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs);

    const dispatcher = serverQueue.connection.playStream(YTDL(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
            else console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`)}

bot.login(config.token);


