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

### User Actions

These actions are usually executed by the users (Host & Guest).

### pick
select one of the civilisations for play

### ban
prevent the opponent from picking the selected civilisation in 
a future turn

### global pick
select one of the civilisations for play, it cannot be
picked again by any player in a future turn 

### global ban
prevent any player from picking the selected 
civilisation in a future turn

### exclusive pick
select one of the civilisations for play; it cannot
be picked again by the same player in a future turn

### exclusive ban
prevent the opponent from picking the selected 
civilisation in a future turn; it cannot be banned again by the same 
player in a future turn

### hidden pick
select one of the civilisations for play without showing
it to the opponent yet

### hidden ban
prevent the opponent from picking the selected 
civilisation in a future turn without showing it to the opponent yet

### hidden global ban
prevent any player from picking the selected 
civilisation in a future turn without showing it to the opponent yet

### exclusive hidden pick
select one of the civilisations for play
without showing it to the opponent yet; it cannot be picked again by 
the same player in a future turn

### exclusive hidden ban
prevent the opponent from picking the selected 
civilisation in a future turn without showing it to the opponent yet;
it cannot be banned again by the same player in a future turn

### snipe
Ban one of the opponent's picks; the same pick cannot be sniped twice

### hidden snipe
Ban one of the opponent's picks without showing it to 
the opponent yet; the same pick cannot be sniped twice

### Admin actions

These actions can only be executed by the server.

### reveal all
reveal picks, bans, and snipes

## Validations

Each action gets validated by the server before it is broadcasted.
If one or more validations fail, an error is returned to the player and the
action is not broadcasted.

### Validations for all actions:
- `VLD_000`: Draft is currently expecting actions 
- `VLD_001`: Acting user is supposed to act according to preset 
- `VLD_002`: Action is expected according to preset

### Validations for PICKs: 
- `VLD_100`: Civilisation has not been banned globally before
- `VLD_101`: Civilisation has not been banned before for same player
- `VLD_102`: Civilisation has not been exclusively picked before by the same player
- `VLD_103`: Civilisation has not been globally picked before by either player

### Validations for BANs:
- `VLD_200`: Civilisation has not been exclusively banned before by same player

### Validations for SNIPEs:
- `VLD_300`: Civilisation has been picked before by opponent
- `VLD_301`: The opponent has a non-sniped pick of the civilisation


## Messages

![Sequence diagram of a session](session.png)

