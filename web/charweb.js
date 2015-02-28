/* WebChar page by Phoenix616
 * For the Custom Icon Text Resource Pack by WolfieMario
 *
 * To add your own mapping read the doc in IconMapping.js
 */

var EMPTY_URL = "empty.png";
var SPRITE_URL = "font/";
var SPRITE_PREFIX = "unicode_page_";
var SPRITE_SUFFIX = ".png";
var SPRITE_DIMENSION = 32; //new Array(16,16,16,16,16,16,16,32,32,32);
var MAPPING = new IconMapping();

var escape = false;

window.onload = function() {
	console.log('onload');
	document.body = document.body || document.getElementsByTagName('body')[0];
	
	window.mainList = new IconList(document.getElementById("chars"), "icons");
	
	document.getElementById("loading").remove();
}


function IconList(container, display) {
	this.container = container;
	this.display = display;
	this.entries = [];
	for(var i = 0; i < MAPPING.characterNames.length; i++) {
		var entry = new IconEntry([MAPPING.characterNames[i]], MAPPING.unicodeOffset + i, display);
		this.entries.push(entry);
	}
	this.load();
}

IconList.prototype.load = function() {
	this.container.innerHTML = "";
	this.setDisplay(this.display);
}

IconList.prototype.toggleDisplay = function() {
	if(this.display == "wide")
		this.setDisplay("icons");
	else if(this.display == "icons")
		this.setDisplay("wide");
}

IconList.prototype.setDisplay = function(display) {
	this.display = display;
	this.container.innerHTML = "";
	for(var i = 0; i < this.entries.length; i++) {
		if(i != 0 && this.display == "icons" && i % 256 == 0) {
			var breakEle = document.createElement("div");
			breakEle.classList.add("break");
			this.container.appendChild(breakEle);
		}
		this.container.appendChild(this.entries[i].getElement(this.display));
	}
}

function IconEntry(names, charCode) {
	this.names = names;
	this.charCode = charCode;
	
	this.iconElement = document.createElement("div");
	this.iconElement.classList.add("icon");
	this.iconElement.appendChild(this.getIcon());
	
	this.hanElement = document.createElement("div");
	this.hanElement.classList.add("han");
	this.hanElement.innerHTML = this.getSymbol();
	
	this.nameElement = document.createElement("div");
	this.nameElement.classList.add("name");
	this.nameElement.innerHTML = this.names[0];
}
 
IconEntry.prototype.getIconPath = function() {
	if((this.charCode - MAPPING.unicodeOffset) < 0)
		return null;
	var hex = this.charCode.toString(16);
	return SPRITE_URL + SPRITE_PREFIX + hex.slice(0,-2) + SPRITE_SUFFIX;
};

IconEntry.prototype.getIcon = function() {
	var ele = document.createElement("div");
	ele.classList.add("icon-image");
	var path = this.getIconPath();
	var offsetX = 0;
	var offsetY = 0;
	if(path != null) {
		var spriteChar = this.charCode % 256;
		offsetX = (spriteChar % 16) * SPRITE_DIMENSION;//dimension;
		offsetY = ((spriteChar / 16) | 0) * SPRITE_DIMENSION;//dimension;
	} else {
		path = EMPTY_URL;
	}
	ele.style.backgroundImage = "url(" + path + ")";
	ele.style.backgroundPosition = "-" + offsetX + "px -" + offsetY + "px";
	return ele;
};

IconEntry.prototype.getSymbol = function() {
	return String.fromCharCode(this.charCode);
}

IconEntry.prototype.getElement = function(display) {
	var ele = document.createElement("div");
	ele.classList.add("entry");
	ele.classList.add(display);
	
	ele.appendChild(this.iconElement);
	
	if(display == "wide") {
		ele.appendChild(this.hanElement);
		ele.onclick = function() {selectText(this.getElementsByClassName('han')[0])};
		
		ele.appendChild(this.nameElement);
	} else {
		ele.onclick = function(symbol) { return function() { copyPrompt(symbol); }; }(this.getSymbol());
		ele.title = this.names[0] + " (Click to get char)";
	}
	
	return ele;
}