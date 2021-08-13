require('dotenv').config();
const tmi = require('tmi.js');
const client = new tmi.Client({
	options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_PASSWORD,
	},
	channels: [ 'enter twitch channel name here' ]
});
client.connect().catch(console.error);

var entries;

let quizStarted = 0;

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
  

client.on('message', (channel, tags, message, self) => {
    if(self) return;
    console.log(message);
    console.log(tags);
	
	//to prevent non-moderators to start or finish the quiz
    const isAdminMessage = (tags.badges.broadcaster == 1) || (tags.badges.moderator == 1);

	if((message.toLowerCase() === '!startquiz') && (isAdminMessage) ) {
		entries = [];		//reset entries array
		quizStarted = 1;	//set flag to 1
	}

	if((message.toLowerCase() === '!finish') && (isAdminMessage) && quizStarted == 1)
    {
		quizStarted = 0;

		var counts = {};
		
		//convert entries array to an object with counter value
		for (const string of entries) {								
		counts[string] = counts[string] ? counts[string] + 1 : 1;
		}

		//sort descending
		const sortable = Object.fromEntries( Object.entries(counts).sort(([,a],[,b]) => b-a));

		counts = sortable;											

		var max;

		//we're going to take top 5 answers
		if(Object.keys(counts).length >= 5)
		{
			max = 5;
		}
		else{	//if number of distinct answers are less than zero, then list it as much
			max = Object.keys(counts).length;
		} 

		for(let i = 0 ; i < max; i++)
		{
			//for debugging purposes
			console.log(Object.keys(counts)[i]);
			console.log(counts[Object.keys(counts)[i]]);

			//writes the result to chat
			client.say(channel, `Answer: ${Object.keys(counts)[i]}  Answer Count: ${counts[Object.keys(counts)[i]].toString()}`);
		}

    }


	if(quizStarted == 1 && message != '!startquiz' && message != '!finish')
	{
		//to standardize the answers, all the chat messages are converted to lowercase
		//than, first letter is capitalized to make it look good
		entries.push(capitalizeFirstLetter(message.toLowerCase()));
	}

});