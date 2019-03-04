# aoe2cm
Captains Mode for Age of Empires II

**This is a work in progress, not yet a functioning application**

## Setup

```bash
npm install
npm run build
npm run build-server
node dist/server.js
```

Visit `localhost:3000` then.

## Presets

A preset defines the order and modes in which host and guest pick and ban 
civilisations.

A preset is simply a list of turns that is being processed turn by turn.
The preset also has a name and defines the set of civilisations that can
be picked, like AoC only or everything up to RotR.

A turn consists of an acting player (host, guest, or none for technical 
turns such as revealing hidden picks/bans) and an action.

The following actions are available:

- **pick**: select one of the civilisations for play
- **ban**: prevent the opponent from picking the selected civilisation in 
  a future turn
- **global pick**: select one of the civilisations for play, it cannot be
  picked again by any player in a future turn 
- **global ban**: prevent any player from picking the selected 
  civilisation in a future turn
- **exclusive pick**: select one of the civilisations for play; it cannot
  be picked again by the same player in a future turn
- **exclusive ban**: prevent the opponent from picking the selected 
  civilisation in a future turn; it cannot be banned again by the same 
  player in a future turn
- **hidden pick**: select one of the civilisations for play without showing
  it to the opponent yet
- **hidden ban**: prevent the opponent from picking the selected 
  civilisation in a future turn without showing it to the opponent yet
- **hidden global ban**: prevent any player from picking the selected 
  civilisation in a future turn without showing it to the opponent yet
- **exclusive hidden pick**: select one of the civilisations for play
  without showing it to the opponent yet; it cannot be picked again by 
  the same player in a future turn
- **exclusive hidden ban**: prevent the opponent from picking the selected 
  civilisation in a future turn without showing it to the opponent yet;
  it cannot be banned again by the same player in a future turn
- **snipe**: Ban one of the opponent's picks; the same pick cannot be 
  sniped twice
- **hidden snipe**: Ban one of the opponent's picks without showing it to 
  the opponent yet; the same pick cannot be sniped twice
- **reveal picks**: show all hidden picks to all players
- **reveal bans**: show all hidden bans to all players; should be done 
  after hidden bans before the next picks
- **reveal snipes**: show all hidden snipes to all players
- **reveal all**: reveal picks, bans, and snipes


## Messages

### Clients

Request: `create()`  
Response: `SUCCESS(draft_id)` | `ERROR`

Request: `join(draft_id)`  
Response: `SUCCESS(host/guest)` | `ERROR(Draft not found)` | `ERROR(Draft full)`

Request: `act(action{pick/ban/snipe}, civilisation)`  
Response: `SUCCESS` | `ERROR(Invalid action according to preset)` | 
`ERROR(Invalid Civilisation for action according to preset)`

### Server

Request: `start()`  
Response: `ACK` | `ERROR`

Request: `turn(player, action{pick/ban/snipe}, civilisation{civ/hidden}, is_random)`  
Response: `ACK` | `ERROR(Unexpected action according to preset)`

Request: `abort(message)`  
Response: `ACK`


