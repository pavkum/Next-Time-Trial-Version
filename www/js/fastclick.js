/*
 FastClick: polyfill to remove click delays on browsers with touch UIs.

 @version 0.6.11
 @codingstandard ftlabs-jsv2
 @copyright The Financial Times Limited [All Rights Reserved]
 @license MIT License (see LICENSE.txt)
*/
function FastClick(a){var c,b=this;this.trackingClick=!1;this.trackingClickStart=0;this.targetElement=null;this.lastTouchIdentifier=this.touchStartY=this.touchStartX=0;this.touchBoundary=10;this.layer=a;if(!a||!a.nodeType)throw new TypeError("Layer must be a document node");this.onClick=function(){return FastClick.prototype.onClick.apply(b,arguments)};this.onMouse=function(){return FastClick.prototype.onMouse.apply(b,arguments)};this.onTouchStart=function(){return FastClick.prototype.onTouchStart.apply(b,
arguments)};this.onTouchMove=function(){return FastClick.prototype.onTouchMove.apply(b,arguments)};this.onTouchEnd=function(){return FastClick.prototype.onTouchEnd.apply(b,arguments)};this.onTouchCancel=function(){return FastClick.prototype.onTouchCancel.apply(b,arguments)};FastClick.notNeeded(a)||(deviceIsAndroid&&(a.addEventListener("mouseover",this.onMouse,!0),a.addEventListener("mousedown",this.onMouse,!0),a.addEventListener("mouseup",this.onMouse,!0)),a.addEventListener("click",this.onClick,
!0),a.addEventListener("touchstart",this.onTouchStart,!1),a.addEventListener("touchmove",this.onTouchMove,!1),a.addEventListener("touchend",this.onTouchEnd,!1),a.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(a.removeEventListener=function(b,c,e){var f=Node.prototype.removeEventListener;"click"===b?f.call(a,b,c.hijacked||c,e):f.call(a,b,c,e)},a.addEventListener=function(b,c,e){var f=Node.prototype.addEventListener;"click"===b?f.call(a,b,c.hijacked||
(c.hijacked=function(a){a.propagationStopped||c(a)}),e):f.call(a,b,c,e)}),"function"===typeof a.onclick&&(c=a.onclick,a.addEventListener("click",function(a){c(a)},!1),a.onclick=null))}var deviceIsAndroid=0<navigator.userAgent.indexOf("Android"),deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent),deviceIsIOS4=deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent),deviceIsIOSWithBadTarget=deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);
FastClick.prototype.needsClick=function(a){switch(a.nodeName.toLowerCase()){case "button":case "select":case "textarea":if(a.disabled)return!0;break;case "input":if(deviceIsIOS&&"file"===a.type||a.disabled)return!0;break;case "label":case "video":return!0}return/\bneedsclick\b/.test(a.className)};
FastClick.prototype.needsFocus=function(a){switch(a.nodeName.toLowerCase()){case "textarea":return!0;case "select":return!deviceIsAndroid;case "input":switch(a.type){case "button":case "checkbox":case "file":case "image":case "radio":case "submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}};
FastClick.prototype.sendClick=function(a,c){var b,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur();d=c.changedTouches[0];b=document.createEvent("MouseEvents");b.initMouseEvent(this.determineEventType(a),!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);b.forwardedTouchEvent=!0;a.dispatchEvent(b)};FastClick.prototype.determineEventType=function(a){return deviceIsAndroid&&"select"===a.tagName.toLowerCase()?"mousedown":"click"};
FastClick.prototype.focus=function(a){var c;deviceIsIOS&&a.setSelectionRange&&0!==a.type.indexOf("date")&&"time"!==a.type?(c=a.value.length,a.setSelectionRange(c,c)):a.focus()};FastClick.prototype.updateScrollParent=function(a){var c,b;c=a.fastClickScrollParent;if(!c||!c.contains(a)){b=a;do{if(b.scrollHeight>b.offsetHeight){c=b;a.fastClickScrollParent=b;break}b=b.parentElement}while(b)}c&&(c.fastClickLastScrollTop=c.scrollTop)};
FastClick.prototype.getTargetElementFromEventTarget=function(a){return a.nodeType===Node.TEXT_NODE?a.parentNode:a};
FastClick.prototype.onTouchStart=function(a){var c,b,d;if(1<a.targetTouches.length)return!0;c=this.getTargetElementFromEventTarget(a.target);b=a.targetTouches[0];if(deviceIsIOS){d=window.getSelection();if(d.rangeCount&&!d.isCollapsed)return!0;if(!deviceIsIOS4){if(b.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=b.identifier;this.updateScrollParent(c)}}this.trackingClick=!0;this.trackingClickStart=a.timeStamp;this.targetElement=c;this.touchStartX=b.pageX;
this.touchStartY=b.pageY;200>a.timeStamp-this.lastClickTime&&a.preventDefault();return!0};FastClick.prototype.touchHasMoved=function(a){a=a.changedTouches[0];var c=this.touchBoundary;return Math.abs(a.pageX-this.touchStartX)>c||Math.abs(a.pageY-this.touchStartY)>c?!0:!1};FastClick.prototype.onTouchMove=function(a){if(!this.trackingClick)return!0;if(this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))this.trackingClick=!1,this.targetElement=null;return!0};
FastClick.prototype.findControl=function(a){return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")};
FastClick.prototype.onTouchEnd=function(a){var c,b,d=this.targetElement;if(!this.trackingClick)return!0;if(200>a.timeStamp-this.lastClickTime)return this.cancelNextClick=!0;this.cancelNextClick=!1;this.lastClickTime=a.timeStamp;c=this.trackingClickStart;this.trackingClick=!1;this.trackingClickStart=0;deviceIsIOSWithBadTarget&&(b=a.changedTouches[0],d=document.elementFromPoint(b.pageX-window.pageXOffset,b.pageY-window.pageYOffset)||d,d.fastClickScrollParent=this.targetElement.fastClickScrollParent);
b=d.tagName.toLowerCase();if("label"===b){if(c=this.findControl(d)){this.focus(d);if(deviceIsAndroid)return!1;d=c}}else if(this.needsFocus(d)){if(100<a.timeStamp-c||deviceIsIOS&&window.top!==window&&"input"===b)return this.targetElement=null,!1;this.focus(d);deviceIsIOS4&&"select"===b||(this.targetElement=null,a.preventDefault());return!1}if(deviceIsIOS&&!deviceIsIOS4&&(c=d.fastClickScrollParent)&&c.fastClickLastScrollTop!==c.scrollTop)return!0;this.needsClick(d)||(a.preventDefault(),this.sendClick(d,
a));return!1};FastClick.prototype.onTouchCancel=function(){this.trackingClick=!1;this.targetElement=null};FastClick.prototype.onMouse=function(a){return this.targetElement&&!a.forwardedTouchEvent&&a.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0};
FastClick.prototype.onClick=function(a){if(this.trackingClick)return this.targetElement=null,this.trackingClick=!1,!0;if("submit"===a.target.type&&0===a.detail)return!0;a=this.onMouse(a);a||(this.targetElement=null);return a};
FastClick.prototype.destroy=function(){var a=this.layer;deviceIsAndroid&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0));a.removeEventListener("click",this.onClick,!0);a.removeEventListener("touchstart",this.onTouchStart,!1);a.removeEventListener("touchmove",this.onTouchMove,!1);a.removeEventListener("touchend",this.onTouchEnd,!1);a.removeEventListener("touchcancel",this.onTouchCancel,!1)};
FastClick.notNeeded=function(a){var c,b;if("undefined"===typeof window.ontouchstart)return!0;if(b=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1])if(deviceIsAndroid){if((c=document.querySelector("meta[name=viewport]"))&&(-1!==c.content.indexOf("user-scalable=no")||31<b&&window.innerWidth<=window.screen.width))return!0}else return!0;return"none"===a.style.msTouchAction?!0:!1};FastClick.attach=function(a){return new FastClick(a)};
"undefined"!==typeof define&&define.amd?define(function(){return FastClick}):"undefined"!==typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick;
