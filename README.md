# Datetime Card
A minimalistic card for [Home Assistant]( https://github.com/home-assistant/core) Lovelace UI which shows how many days it has been between any input_datetime and today.

Useful to remind you how many days it has been since you replaced your water filter or you watered your favoirite plants.

![chinese_money](https://raw.githubusercontent.com/a-p-z/datetime-card/main/images/chinese_money.png "Chinese money")

## Installation
[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

Or you can download [datetime-card.js](https://github.com/a-p-z/datetime-card/releases/latest) to your `configuration/www` folder and cofigure Lovelace to load it:
```yaml
lovelace:
  mode: yaml
  resources:
    - url: /local/datetime-card.js
      type: module
```

## Configuration
- Open a dashboard in edit mode
- Click on add a card
- Search datetime-card
- Click on the card preview
- Use the visual or the code editor to configure your card, as below

![configuration](https://raw.githubusercontent.com/a-p-z/datetime-card/main/images/configuration.png "Configuration")

```yaml
type: custom:datetime-card
title: Chinese money
image: /local/plant_chinese_money.png
show_names: false
flex_direction: row
entities:
  - id: input_datetime.plant_chinese_money_w
    max: 9
  - id: input_datetime.plant_chinese_money_m
    max: 5
  - id: input_datetime.plant_chinese_money_f
    max: 17
```
> **_NOTE:_** [lovelace-card-mod](https://github.com/thomasloven/lovelace-card-mod) and [lovelace-layout-card](https://github.com/thomasloven/lovelace-layout-card) makes the visual editor crash because it tries to overwrite setConfig method, which in datetime-card is read-only. The code editor works, just ignore the error.

## Actions
- reset date: just press and hold down the mouse button on the bar or on the days label to reset the entity to the current date.

## Notifications when items are expired
Erkr wrote a PyScript: https://gist.github.com/erkr/45d6d82053d20001976b29e19ae2e7de. It adds a service that looks-up all cards based on this custom:datetime-card. the script can parse one dashboard pointed out by a dashboardUrl variable. There it evaluates all entities defined in de datetime-card and then checks if they exceed the max time configured. If that is the case, it sends a notification for each of them. You can simply call the script in a time-triggered automation (i.e. once a day at noon)

Note: the script needs tailoring for 3 things:
- the token variable: assign a 'long lived token' (can be created via your profile in the UI)
- the dashboardUrl variable: define a working default for your setup (can always be overruled when calling the sevice)
- Change the hard coded notifier to one of yours 
I run the service once a day in a time-triggered automation
