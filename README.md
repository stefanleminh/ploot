<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/stefanleminh/ploot">
    <img src="images/ploot.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">Ploot</h3>
  <p align="center">
    A bot to help you with your team-building needs in PvP games!
    <br />
    <a href="https://github.com/stefanleminh/ploot/issues">Report Bug</a>
    ·
    <a href="https://github.com/stefanleminh/ploot/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#credits">Credits</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Ploot will help you create teams for PvP-games like Overwatch in your discord server. You can add, remove players or spectators, randomize two teams of 6 people and move them into designated voice channels when you start/end the match.
No more using randomize websites and moving each player back and forth one by one!

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/stefanleminh/ploot.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your configuration in `config.json`
4. Run with

   ```sh
   npm run start
   ```

<!-- USAGE EXAMPLES -->

## Usage

Start a new session with `=newsession` - You can now add/remove players or any other functionality that comes with ploot. Add a player or spectator (or multiple!) with `=addplayer @DiscordUser ...` or `=addspectator @DiscordUser ...` respectively or remove them with `=remove @DiscordUser ...`.
You can then create your teams by using the `=randomizer` command - It will purge any players not present in the lobby. Then you can use `=startmatch` to move every player in the lobby to their designated voice-channel and back to the lobby with `=endmatch`.
Finally, you can end the session with `=endsession`.

For more commands, check out the `=help` command!

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/stefanleminh/ploot/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- ACKNOWLEDGEMENTS -->

## Credits

- [Icon artist](https://twitter.com/mizururu?lang=en)
