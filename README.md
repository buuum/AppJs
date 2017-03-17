AppJs - Simple app js
===========================

## Install

### Bower

Buuum is available on Bower and can be installed using:

```
bower install appjs
```

## Initialize
### create Your App
```coffeescript
class App extends Appjs
  constructor: ->
    # define controllers
    @controllers = [
      'Menu'
    ]
  ini: ->
    @addControllers @controllers
```
### create controllers
```coffeescript
class Menu extends Controller
  constructor: ->
    # add event
    @addEvent 'click', '.blockload', @clickfunction
    # remove event
    @removeEvent 'resize', 'window'

  clickfunction: (element) =>
    console.log 'click .blockload'
```

#### Controller methods
##### addEvent
```coffeescript
# addEvent: (event, target, callback, preventdefault = true) ->
# callback method has call with a jquery element param
# example
@addEvent 'click', '.blockload', @clickfunction
@addEvent 'click', '.blockload', (element) ->
  console.log element
  return
@addEvent 'click', '.blockload', @click, false
@addEvent 'resize', 'window'
```

##### removeEvent
```coffeescript
# removeEvent: (event, target) ->
# example
@removeEvent 'click', '.blockload'
@removeEvent 'resize', 'window'
```

### Initialize in your html
```html
<script src="jquery.js"></script>
<script src="appjs.min.js"></script>
<script>
    $(function(){ 
        App = new App(); 
        App.ini()
    });
</script>
```

## Utilities

### Config
#### set
```coffeescript
# set: (attr, value, persist = false) ->
# example
Config.set 'name', 'my name'
```
if persist is true the config is save in localstorage

#### get
```coffeescript
# get: (attr) ->
# example
Config.get 'name'
```
return value or false

### LocalData
save data on local storage
#### add
```coffeescript
# add: ($key, $value) ->
LocalData.add 'name', 'my name'
```
#### get
```coffeescript
# get: ($key) ->
LocalData.get 'name'
```
#### remove
```coffeescript
# remove: ($key) ->
LocalData.remove 'name'
```
#### clear
```coffeescript
# clear: ->
LocalData.clear()
```

### Ajax

#### get, post, put, delete
```coffeescript
# default options
# options:
#    timeout: 0
#    headers: false
#    method: method
#    url: '' (required)
#    params: {}

# example

Ajax.post
  url: 'ajax.php'
  params:
    id: 12
, (response, request_error) ->
    if request_error
      console.log response.statusText
    else
      console.log response
    return

```


### Utils
```coffeescript
# @merge: (obj1 = {}, obj2 = {}) ->
Utils.merge obj1, obj2
# @round: (value, precision, mode) ->
Utils.round 423, 30
# @realSizes: (obj, objsize = false) ->
Utils.realSizes $('a.size_me')
# @get_class_methods: (name) ->
Utils.get_class_methods 'ClassName'
# @serializeObject: (obj) ->
Utils.serializeObject obj1
```