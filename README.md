# Cutiebot

The Cutie Club Discord Server bot, written using [Discord.js](https://discord.js.org/#/).

## Inviting to a Server

To add the bot to a server, click the following link; https://discordapp.com/api/oauth2/authorize?client_id=633716546568585216&permissions=268561478&scope=bot

Cutiebot requires the following permissions;

```diff
+ Manage Roles  
+ Kick Members  
+ Ban Members  
+ View Channels  
+ Send Messages  
+ Manage Messages  
+ Embed Links  
+ Attach Files  
+ Read Message History  
+ Add Reactions
```

(Please note that you *will* need the `Administrator` permission on the server you wish to add Cutiebot to!)

# Contributing

If you would like to open a PR, please check [the contributing guide](https://github.com/amberstarlight/cutiebot/blob/master/CONTRIBUTING.md).

## Development Requirements

- `git` [version control](https://git-scm.com/).
- `node` [version 12.0.0 or higher](https://nodejs.org).

You will also need a token, if you want to stage the bot on your own server for testing. Create an application in the [Discord Developer Portal](https://discordapp.com/developers) and create a Bot User.

## Installation

In your terminal, run the following command;

```
git clone https://github.com/Cutie-Club/cutiebot.git
```

Once finished, run `cd cutiebot`, followed by `npm install`.

You can start the bot using `npm run dev:start`, which starts the bot using Nodemon.
