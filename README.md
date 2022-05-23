# Cutiebot

The Cutie Club Discord Server bot, written using [Discord.js](https://discord.js.org/#/).

## Inviting to a Server

To add the bot to a server, click the following link; <https://discord.com/api/oauth2/authorize?client_id=633716546568585216&permissions=1376805841990&scope=bot%20applications.commands>

Cutiebot requires the following permissions;

```diff
+ Manage Roles
+ Kick Members
+ Ban Members
+ View Channels
+ Send Messages
+ Send Messages in Threads
+ Manage Messages
+ Embed Links
+ Attach Files
+ Read Message History
+ Read Messages / View Channels
+ Add Reactions
+ Use External Emojis
+ Add Reactions
```

(Please note that you *will* need the `Administrator` permission on the server you wish to add Cutiebot to!)

## Development Requirements

- `git` [version control](https://git-scm.com/).
- `node` [version 16.14.0 or higher](https://nodejs.org).

You will also need a token, if you want to stage the bot on your own server for testing. Create an application in the [Discord Developer Portal](https://discordapp.com/developers) and create a Bot User.

## Installation

In your terminal, run the following command;

```sh
git clone https://github.com/Cutie-Club/cutiebot.git
```

Once finished, run `cd cutiebot`, followed by `yarn install`. You may need to switch your local node install to 16.14 using `nvm` to avoid issues installing `better-sqlite3`, as prebuilt binaries are provided for node's LTS versions.

You can start the bot using `npm run dev:start`, which starts the bot using Nodemon.

## Docker

To run the bot via Docker, install Docker on your machine.

To pull the pre-published Docker image:

```sh
docker pull ghcr.io/cutie-club/cutiebot:latest
```

Run the following to build the image:

```sh
docker build -t cutiebot .
```

You can run the image with the following command:

```sh
docker run -d \
  --env DISCORD_TOKEN=yourTokenHere \
  --name cutiebot \
  --mount type=bind,source="$(pwd)/database",target=/usr/cutiebot/database \
  cutiebot:latest
```
