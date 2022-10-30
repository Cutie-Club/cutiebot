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

(Please note that you _will_ need the `Administrator` permission on the server you wish to add Cutiebot to!)

## Development Requirements

- `git` [version control](https://git-scm.com/).
- `node` [lts/hydrogen](https://nodejs.org).

You will also need a token, if you want to stage the bot on your own server for testing. Create an application in the [Discord Developer Portal](https://discordapp.com/developers) and create a Bot User.

## Installation

In your terminal, run the following command:

```sh
git clone https://github.com/Cutie-Club/cutiebot.git
```

Once finished, run `cd cutiebot`, followed by `yarn install`. You may need to switch your local node install to `lts/hydrogen` using `nvm` to avoid issues installing `better-sqlite3`, as prebuilt binaries are provided for node's LTS versions.

You can start the bot using `npm run dev:start`, which starts the bot using nodemon.

## Environment Variables

| Env Var          | Description                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `DISCORD_TOKEN`  | The Discord token for the bot user.                                                             |
| `CLIENT_ID`      | The ID of the bot user.                                                                         |
| `GUILD_ID`       | Development guild ID for testing slash commands.                                                |
| `GIT_SHA`        | Git SHA of the latest commit at build time. Can be sourced from `git rev-parse HEAD`            |
| `COMMIT_MESSAGE` | Message of the latest commit at build time. Can be sourced from `git log --format=%B -n 1 HEAD` |

The first three environment variables are not optional. The last two, `GIT_SHA` and `COMMIT_MESSAGE`, are required for the metadata command; useful for quickly verifying the build commit in production, but not required for development.
