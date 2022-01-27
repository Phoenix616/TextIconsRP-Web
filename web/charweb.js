/* TextIconsRP-Web (https://github.com/Phoenix616/TextIconsRP-Web)
 * Copyright (C) 2015 Max Lee (https://github.com/Phoenix616/)
 * Converter for the Icon Text Resource Pack by WolfieMario
 *
 * To add your own mapping read the doc in IconMapping.js
 *
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var EMPTY_URL = "empty.png";
var SPRITE_URL = "font/";
var SPRITE_PREFIX = "unicode_page_";
var SPRITE_SUFFIX = ".png";
var SPRITE_DIMENSION = 32; //new Array(16,16,16,16,16,16,16,32,32,32);
var MAPPING = new IconMapping();

var escape = false;

window.onload = function() {
	console.log('Loading Webinterface for Text Icon Resource Packs based on WolfieMario\'s...');
	console.log('Copyright (C) 2022 Max Lee (https://github.com/Phoenix616/)');
	console.log('TextIconsRP-Web (https://github.com/Phoenix616/TextIconsRP-Web)');
	document.body = document.body || document.getElementsByTagName('body')[0];
	
	window.mainList = new IconList(document.getElementById("chars"), "icons");
	
	document.getElementById("loading").remove();
	console.log('Loading finished!');
}


function IconList(container, display) {
	this.container = container;
	this.entries = [];
	this.displaybefore = "";
	for(var i = 0; i < MAPPING.characterNames.length; i++) {
		var entry = new IconEntry([MAPPING.characterNames[i]], MAPPING.unicodeOffset + i, display);
		this.entries.push(entry);
	}
	this.load(display);
}

IconList.prototype.load = function(display) {
	this.container.innerHTML = "";
	this.setDisplay(display);
}

IconList.prototype.toggleDisplay = function() {
	if(this.display == "wide")
		this.setDisplay("icons");
	else if(this.display == "icons")
		this.setDisplay("wide");
}

IconList.prototype.setDisplay = function(display) {
	if(this.display != display) {
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
}

IconList.prototype.search = function(string) {
	if(typeof this.searchthread !== 'undefined')
		clearTimeout(this.searchthread);
	var list = this;
	this.searchthread = setTimeout(function() {
		if(string.length == 0) {
			if(list.display != list.displaybefore)
				list.setDisplay(list.displaybefore);
			list.displaybefore = "";
		} else {
			if(list.displaybefore.length == 0)
				list.displaybefore = list.display;
			list.setDisplay("wide");
			for(var i = 0; i < list.entries.length; i++) {
				list.entries[i].match(string);
			}
			
		}
	}, 400);
}

function IconEntry(names, charCode) {
	this.names = names;
	this.charCode = charCode;
	
	this.display;
	this.element;
	
	this.iconElement = document.createElement("div");
	this.iconElement.classList.add("icon");
	this.iconElement.appendChild(this.getIcon());
	
	this.utf16Element = document.createElement("div");
	this.utf16Element.classList.add("utf16");
	this.utf16Element.innerHTML = this.getSymbol();
	
	this.nameElement = document.createElement("div");
	this.nameElement.classList.add("name");
	this.nameElement.innerHTML = this.names[0].replace("_", " ");
}

IconEntry.prototype.match = function(string) {
	display = "none";
	for(var i = 0; i < this.names.length; i++)
		if(this.names[i].toLowerCase().indexOf(string.toLowerCase()) >= 0) {
			display = "";
			this.nameElement.innerHTML = this.names[i].replace(new RegExp( '(' + string + ')', 'gi' ), '<span class="hilight">$1</span>');
		}
	this.element.style.display = display;
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
	if(this.display != display) {
		var ele = document.createElement("div");
		ele.classList.add("entry");
		ele.classList.add(display);
		
		ele.appendChild(this.iconElement);
		
		if(display == "wide") {
			ele.appendChild(this.utf16Element);
			ele.onclick = function() {selectText(this.getElementsByClassName('utf16')[0])};
			
			ele.appendChild(this.nameElement);
		} else {
			ele.onclick = function(symbol) { return function() { copyPrompt(symbol); }; }(this.getSymbol());
			ele.title = this.names[0].replace("_", " ") + " (Click to get char)";
		}
		
		this.display = display;
		this.element = ele;
		return ele;
	} else {
		return this.element;
	}
}