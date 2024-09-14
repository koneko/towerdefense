Bastion 
A Tower Defense game

# Game description and functionality
Bastion is a Tower Defense type of game.

The game offers the player various missions that he can play. 
In each mission the player is tasked to defend a path going from the entrance of the map to exit of the map.
Each mission is split into multiple waves. Each level consists of two phases:
1. Phase 1 (Buy phase) - The player can buy towers and place them on the map.
2. Phase 2 (Combat phase) - In this phase there the enemies spawn at the entrance of the map and start moving towards the exit. The towers will attack the enemies and try to stop them from reaching the exit. More enemies may spawn during the combat phase.
For every creep killed by the player, the player will receive Gold resource. 
Every time a level is finished (Combat phase completes) the player will also receive one Gem resource.
The player can use the Gold to buy more towers or upgrade the existing ones.
If a creep reaches the exit, the player will lose a some health points (HP). 
If the player loses all his HP, the game is over and the player has lost.
If the player completes all the waves of a level, the player wins and receives a Score which places him at a leaderboard.

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
The map is covering the majority of the screen. There is no zooming or panning. Depending on the map aspect ratio, the map may be cropped on the sides.


## Game screen - Buy phase


## Game screen - Combat phase

## Resources

### Gold

### Gems

### HP

### End Game Score



# Data structures and algorithms