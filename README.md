# Datetime Card
A minimalistic card for [Home Assistant]( https://github.com/home-assistant/core) Lovelace UI which shows how many days it has been between any input_datetime and today.

Useful to remind you how many days it has been since you replaced your water filter or you watered your favoirite plants.

![chinese_money](https://raw.githubusercontent.com/a-p-z/datetime-card/main/images/chinese_money.png "Chinese money")
## Installation

You can download [datetime-card.js](https://github.com/a-p-z/datetime-card/releases/download/1.0.0/datetime-card.js) to your `configuration/www` folder and cofigure Lovelace to load it:
```yaml
lovelace:
  mode: yaml
  resources:
    - url: /local/datetime-card.js
      type: module
```

## TODO
- [ ] Add the repository to HACS
- [ ] Add autocomplete in the editor for entities
- [ ] Add dnd in the editor for entities