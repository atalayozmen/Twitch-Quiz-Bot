# Twitch Quiz Bot
Twitch Bot on Node.js which gathers all the answers given to a certain question and displays the top five most written answers.
Type !startquiz to start, !finish to finish the quiz. All the chat entries that are written between the time when the quiz starts and ends are accepted as answers.

Dependencies:
The app uses tmi.js and dotenv libraries in order to function. Use the commands below to install tmi.js and dotenv

npm i tmi.js

npm install dotenv

The username and oauth password should be written in a file called .env which is in the same folder as your script. This is made to protect your login credentials from people that you might share the script with. dotenv library makes this work.

For more information about tmi.js library, visit: https://github.com/tmijs/tmi.js
