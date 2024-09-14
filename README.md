# Bastion

_The Watchers Lament_

# Game description and functionality

Bastion is a Tower Defense type of game.

The game offers the player various missions that he can play.
In each mission the player is tasked to defend a path going from the entrance of the map to exit of the map.
Each mission is split into multiple rounds. Each round consists of two phases:

1. Phase 1 (Buy phase) - The player can buy towers and place them on the map.
2. Phase 2 (Combat phase) - In this phase there the enemies spawn at the entrance of the map and start moving towards the exit. The towers will attack the enemies and try to stop them from reaching the exit. More enemies may spawn during the combat phase.

For every creep killed by the player, the player will receive Gold resource.
Every time a level is finished (Combat phase completes) the player will also receive one Gem.
The player can use the Gold to buy more towers or upgrade the existing ones.
If a creep reaches the exit, the player will lose a some health points (HP).
If the player loses all his HP, the game is over and the player has lost.
If the player completes all the rounds of a mission, the player wins and receives a Score which places him at a leaderboard.

# Functional description

## Game start

The game starts with a Main menu screen.

## Main menu screen

The main menu has the following options (buttons):

1. Play - Starts the game by going to the Mission selection screen
2. Exit - Exits the game

## Mission selection screen

The mission selection screen has the following content:

1. List of missions where the player can choose one mission to play by going to the Mission screen
2. Back button - Goes back to the Main menu screen

## Mission screen

Mission screen is reached when the player selects a mission from the Mission selection screen.
The Mission screen has the following content:

1. The map of the mission (image representation)
2. The path of the creeps (line on the map)
3. Amount of waves in the mission
4. The entrance and exit of the map (marked on the map)
5. Leaderboard - Shows the top 10 players with the highest score for the current mission
6. Starting Gold - The amount of Gold the player starts with
7. Starting Gems - The amount of Gems the player starts with
8. Button to start the mission (Game screen - Buy phase)
9. Button to go back to the Mission selection screen

## Game screen

Every game screen (Buy or Combat phase) has the following content:

### Game map

The map is covering the majority of the screen (80%). There is no zooming or panning. Depending on the map aspect ratio, the map may be cropped on the sides.

### Options Panel

The options panel is opened by pressed the options button located on the top left corner. The options panel allows the player to:

- Restart current wave
- Restart mission
- Return to main menu
- Close panel (opening it automatically pauses the game)

### Sidebar

The side bar is located on the right side of the screen and takes up a lesser amount of the screen (20%). It's functionality changes based on whether you are in the buy phase or combat phase.

### Topbar

The top bar is located to the left of the sidebar and shows you your current HP, Gold, Score and Wave/Total Waves.

## Game screen - Buy phase

During the buy phase (has no time limit), the player may spend their Gold to purchase towers and use their Gems to empower their towers in specific ways depending on the gems used.
After the player has finished spending their resources/strategizing, they may end the Buy phase by pressing the "GO" button in the bottom right corner (sidebar).

### Sidebar - Buy phase

During the buy phase the sidebar is split into 2 tabs, the Tower menu and the Gem bag. The tower menu contains towers which you can place on the map grid taking up 1x1 space. You may purchase towers with Gold, and certain towers can be empowered with Gems while others can not. Towers themselves can not be upgraded instead you upgrade your Gems.

## Game screen - Combat phase

## Towers

## Resources

### Gold

Gold is the resource you get per every creep killed. Every creep decides how much Gold it gives upon its death. Gold is used to purchase towers and alter the map.

### Gems

Gems are not a number resource like Gold is, rather you earn one of the possible Gems upon completing a round. They are placed in your Gem bag which is accessible via the sidebar.
Currently there are 6 Gems:

1. Fire Gem (#FF0000) (fire)
   - Description: A firey gem found inside the ancient ruins of a lost volcano dwelling civilization, this gem is infused with many eons of firey, quicky, volcanic energy to deliver fast and burning blows to all creeps.
2. Yeti Gem (#0000FF) (ice)
   - Description: A cold and wet gem rarely found worn by Yeti leaders in the tundra biome, this gem [WIP]
3. Titalium Gem (#FFFFFF) (white)
   - Description: [WIP]
4. Soulforge Gem (#00FFFF) (cyan)
   - Description: [WIP]
5. Rift Gem (#FF00FF) (purple)
   - Description: [WIP]
6. Divinity Gem (#00FF00) (green)
   - Description: [WIP]

(idealno 6 \* 5 combos)
(impossible combos:
fire + yeti
soulforge + divinity
rift + titalium
)
(kasnija ideja svakih 5 rundi dobit "utility" gem koji mozda ubrzava attack speed ili daje neke specificnije buffove)
(ideja: merchanting gem, gemovi koji su kombinirani s ovim gemom kostaju 10% manje, round down)

### HP

HP (Health Points) is the resource that you always start with 100 of and you must keep it >0 upon finishing the final round to win the mission.

### Score

# Data structures and algorithms
