// https://github.com/kaiomedau

//*****************************************************************
//HELPERS
//*****************************************************************
//Return a number btween given values eg.: Math.randMinMax(-10, 10);
Math.randMinMax = function(t,n,a){
  var r= t + Math.random() * (n-t);
  return a && ( r = Math.round( r ) ) , r;
}
//Return a random object from given array
function getRandom( arrayObj ){
  //Sort and return a shape
  return arrayObj[(Math.floor(Math.random() * arrayObj.length) % (arrayObj.length))];
}
//*****************************************************************
// EMITTER
//*****************************************************************

var tweens = [];//Collection container. Will hold all created tweens to handle mouse interacions

//All particle shapes
function particleShapes( allowLargePaths ){
  var smallShapes = [
    {size:{w:85,h:21}, points:"80 0 0 0 25 20"},
    {size:{w:51,h:41}, points:"0 0 50 0 25 40"},
    {size:{w:11,h:9},  points:"10 0 0 0 6 8"},
    {size:{w:47,h:21}, points:"0 0 45 11 10 20"},
    {size:{w:23,h:16}, points:"2 6 23 0 21 14"},
    {size:{w:22,h:17}, points:"4 3 21 1 2 16"},
    {size:{w:24,h:21}, points:"10 2 2 21 23 13"},
    {size:{w:13,h:12}, points:"3 1 12 5 1 11"},
    {size:{w:11,h:17}, points:"9 2 11 11 2 16"},
  ];
  //Large shapes coords
  var largeShapes = [
    {size:{w:100,h:141}, points:"10 14 90 21 100 140"},
  ];
  //return it
  return allowLargePaths ? smallShapes.concat( largeShapes ) : smallShapes;
}

//**************
//Emitter class
window.PEmitter = function( container , data){
    data = !data ? {} : data;
    //**************************************************
    this.emter  = document.getElementById(container?container:"emitter"); //Get the emitter container
    //**************************************************
    this.clsses     = data.classes  ? data.classes  : classes; //Classes to randomize
    this.pCount     = data.count    ? data.count    : 30, //Number of particles
    this.pRangeX    = data.rangeX   ? data.rangeX   : 800, //Max distance X (btween 0 and given number)
    this.pRFromX    = data.rFromX   ? data.rFromX   : 0,
    this.pRangeY    = data.rangeY   ? data.rangeY   : 800, //Max Y position (btween pRangeFromY and given number)
    this.pRFromY    = data.rFromY   ? data.rFromY   : 0, //Min Y position
    this.pLife      = data.life     ? data.life     : 15,  //Min particle life
    this.pLifeVar   = data.lifeVar  ? data.lifeVar  : 15,  //Random life variation increase
    this.radial     = data.radial   ? data.radial   : false, //If emitter will emitte to all sides
    this.allowLarge = data.large    ? data.large    : false,
    this.shapes     = data.shapes   ? data.shapes   : null,
    this.pz         = data.z        ? data.z        : 0,
    this.opacity    = data.alpha    ? data.alpha    : 1,
    this.rotation   = data.rotate!=null ? data.rotate : true,
    this.rotVel     = data.rVelo    ? data.rVelo    : 10,
    this.rotVelVar  = data.rVeloVar ? data.rVeloVar : 30,
    this.rotDirect  = data.rotDir   ? data.rotDir   : "cw",
    this.static     = data.static!=null ? data.static : false,
    this.particles  = 0;   //Controll var, contains loaded particles

    //If new position given
    if(data.x){
      this.emter.style.left = data.x;
    }
    if(data.y){
      this.emter.style.top = data.y;
    }
}

PEmitter.prototype.create = function(){
  //Get particle class
  var clss  = this.clsses[(Math.floor(Math.random() * this.clsses.length) % (this.clsses.length))],
      nx    = Math.randMinMax(this.radial ? -(this.pRangeX + this.pRFromX) : this.pRFromX, this.pRangeX),
      ny    = Math.randMinMax(this.radial ? -(this.pRangeY + this.pRFromY) : this.pRFromY, this.pRangeY),
      fx    = nx > 0 ? this.pRFromX : -this.pRFromX,
      fy    = ny > 0 ? this.pRFromY : -this.pRFromY,
      time  = (Math.random() * this.pLifeVar) + this.pLife;

    //Get random path coordinates
    var pshape = this.shapes ? getRandom( this.shapes ) : getRandom( particleShapes( this.allowLarge ) );

    //Create SVG
    var svg   = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        svgNS = svg.namespaceURI,
        rect  = document.createElementNS(svgNS,'polygon');
        //Set attributes
        rect.setAttribute('points',  pshape.points);
        svg.setAttribute( 'width',   pshape.size.w);
        svg.setAttribute( 'height',  pshape.size.h);
        svg.setAttribute( 'class',   "particle " + clss);
        //Add rect to SVG
        svg.appendChild(rect);

    //Add svg to HTML container
    this.emter.appendChild( svg );

    //Get emitter opacity for seek interaction
    var emitterOpacity = this.emter.style.opacity;

    if(this.static){
      svg.style.transform = "translate3d("+ nx +"px,"+ ny +"px,0)";
      new TimelineMax().fromTo(svg, 0.8, { alpha:0 }, {alpha:this.opacity}); //Fade int
    }else{
      //Add moviment tween
      new TimelineMax({repeat:-1})
      .fromTo(svg, 0.8,  { alpha:0 }, {alpha:this.opacity}) //Fade int
      .fromTo(svg, time, {x:fx, y:fy}, { delay:0.2, x:nx, y:ny, z:this.pz, force3D:true, ease:Linear.easeNone}, "-=0.7")
      .to(svg, 0.8,  { alpha:0 })//Fade out
      // .seek(emitterOpacity > 0 ? 0 : Math.random() * time, false)
    }

    //Add rotation tween to collection
    var rotX, rotY, rotZ;
    switch(this.rotation){
      case "x":
        rotX = 360; rotY = rotZ = 0;
      break;
      case "y":
        rotY = 360; rotX = rotZ = 0;
      break;
      case 'z':
        rotZ = 360; rotY = rotX = 0;
      break;
      case false:
        rotZ = rotY = rotX = 0;
      break;
      default:
      rotX = rotY = rotZ = 360;
      break;
    }

    var rD = this.rotDirect == "cw" ? 1: -1;
    tweens.push(
      TweenMax.to(svg, (Math.random() * this.rotVelVar) + this.rotVel, { repeat: -1, rotationZ:(rotZ*rD), rotationX:(rotX*rD), rotationY:(rotY*rD), ease:Linear.easeNone})
    );
}

//Check and create new particle
PEmitter.prototype.cast = function( emitterInterval ){
  //Check if all particles have been created
  if(this.particles >= this.pCount){
    window.clearInterval( emitterInterval );
    return;
  }
  //Create new particle
  this.create();
  //Increase particles count
  this.particles ++;
}

//************************************************
//MOUSE
window.addEventListener("mousemove", function( e ){
  var mRatio          = 150; //Mouse action range
  var hoverTimeScale  = 15; //Time scale multiplyer
  //Check interaction
  for (var i in tweens) {
      var tBounding = tweens[i].target.getBoundingClientRect(), //Target bouding box
          a = ( tBounding.top  + (tBounding.height/2)) - (e.clientY - (mRatio/2) ), //Target point A
          b = ( tBounding.left + (tBounding.width/2))  - (e.clientX - (mRatio/2) ), //Target point B
          distance = Math.sqrt( a*a + b*b ); //Distance btween the two points

        if( distance < mRatio ){ //Mouse is inside given ratio
            if (tweens[i].timeScale() != hoverTimeScale) {
                tweens[i].timeScale(hoverTimeScale); //Change rotation velocity
                TweenMax.to(tweens[i].target, 0.5, {scale: .5 }); //Change particle scale
            };
        }else{
            if (tweens[i].timeScale() != 1) {
                tweens[i].timeScale(1); //Return to original velocity
                TweenMax.to(tweens[i].target, 0.8, { scale:1 }); //Return to original scale
            };
        }
    };
});
//************************************************
