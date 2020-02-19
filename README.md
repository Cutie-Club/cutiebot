# Cutiebot

The Cutie Club Discord Server Bot.

## Requirements

- `git` [version control](https://git-scm.com/).
- `node` [version 8.0.0 or higher](https://nodejs.org).

You will also need a token, if you want to stage the bot on your own server for testing. Create an application in the [Discord Developer Portal](https://discordapp.com/developers) and create a Bot User.

## Installation

In your terminal, run the following command;

```
git clone https://github.com/amberstarlight/cutiebot.git
```

Once finished, run `cd cutiebot`, followed by `npm install`.

To start the bot, run `node index.js`.
Optionally, run `npm run dev:start` to run the bot under `nodemon` for development.

## Inviting to a Server

To add the bot to a server, generate an OAuth2 invite URL on your application's OAuth2 page, on the Discord Developer Portal.

You can select as many permissions as you require for testing, but the following permissions are given for the production bot;

Manage Roles  
Kick Members  
Ban Members  
View Channels  
Send Messages  
Manage Messages  
Embed Links  
Attach Files  
Read Message History  
Add Reactions

Here's an OAuth2 link with these permissions set; https://discordapp.com/api/oauth2/authorize?client_id=633716546568585216&permissions=268561478&scope=bot

(You will need Administrator permissions on the server you wish to add Cutiebot to!)

## Contributing

Please read the [Discord.js documentation](https://discord.js.org)! If you are not used to developer documentation, this may be daunting at first, but may have the answers you are looking for.
