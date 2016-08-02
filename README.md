# TweenMax svg-particles
Simple javascript SVG particles using TweenMax (GSAP) to handle the animation actions.


## Dependencies
This lid uses TweenMax 1.19.0 to handle all animations. For that, you can use the most recent CDN or load as shown:

```<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js"></script>```



## Installation
Load `emitter.js` and `emitter.css` files

```<link rel="stylesheet" href="emitter.css">```

```<script src="emitter.js"></script>```



## Usage
Add a container object to you HTML with a unique id

```<div id="emitter"></div>```

Add a script tag to initialize your emitter, passing at least the `container unique id`

```javascript
<script type="text/javascript">
    //particle styles to be randomized
    var classes = [ "blue", "blue stroke", "white", "white stroke"],
    //Create emitters
    var eM = new PEmitter( "emitter" , { count:300 } );
    //Set a interval to cast all particles async
    //Pass the interval object as parameter to be cleared once it's done
    var emInterval = window.setInterval( function(){ eM.cast( emInterval ); }, 300);
</script>
```


## Configurations
Once you create a `PEmitter` you can also pass settings to improve it's actions.

**count** `int`      - Number of particles

**classes** `array`  - Classes to be randomized

**radial** `bool`    - If true, will use the same rangeX and rangeY for both directions

**large** `bool`     - Can use large particles

**rangeX** `float`   - Max X distance

**rFromX** `float`   - Min X distance

**rangeY** `float`   - Max Y distance

**rFromY** `float`   - Min Y distance

**life** `float`     - Min particle duration

**lifeVar** `float`  - Range of life variation to sum to duration

**shapes** `array`   - Array of custom shapes `[{size:{w:12,h:11}, points:"3 1 12 5 1 11"},]`

**x** `string`       - Emitter position X

**y** `string`       - Emitter position Y

