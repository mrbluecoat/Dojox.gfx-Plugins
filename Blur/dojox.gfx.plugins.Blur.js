/*
Dojox.gfx Blur plugin v1.0

Copyright (c) 2010, Stela 5
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * Neither the name of Stela 5 nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

dojo.provide("dojox.gfx.plugins.Blur");

dojo.require("dojox.gfx");

dojo.requireIf(dojox.gfx.renderer == "svg", "dojox.gfx.svg");
dojo.requireIf(dojox.gfx.renderer == "vml", "dojox.gfx.vml");
dojo.requireIf(dojox.gfx.renderer == "silverlight", "dojox.gfx.silverlight")

dojo.addOnLoad(function() {

	if(!dojox.gfx.renderer) return this;

	switch(dojox.gfx.renderer){

		case "svg":
			var g = dojox.gfx, svg = g.svg;
			// extend shape to include SVG setBlur
			dojo.extend(dojox.gfx.Shape, {
				setBlur: function(blur){
					//	summary:
					//		sets a blur effect (SVG) - see http://www.w3.org/TR/SVG/filters.html#feGaussianBlurElement
					//	blur: Object
					// 		size: String - can be float or "none" (default = 2.5)
					//		sizeType: String - can be "stdDeviation" (from SVG), "radius" (from Silverlight), 
					//					"pixelRadius" (from VML) (default = "stdDeviation")

					if (!blur) blur = {"size":"2.5","sizeType":"stdDeviation"};
					if (!blur.size) blur.size = "2.5";
					if (!blur.sizeType) blur.sizeType = "stdDeviation";
					if (blur.size == "none"){
						if (this.rawNode.getAttribute("filter")){
							var rawNodeFilter = this.rawNode.getAttribute("filter");
							this._getParentSurface().defNode.removeChild(svg.getRef(rawNodeFilter));
							this.rawNode.removeAttribute("filter");
						}
					} else if (parseFloat(blur.size)){
						var size = parseFloat(blur.size);
						if (blur.sizeType == "radius") size = (size / 3.0);
	        		                var svgns = svg.xmlns.svg,
	        		                surface = this._getParentSurface(),
	        		                defNode = surface.defNode,
						blurNode = _createElementNS(svgns, "filter"),
						blurFilter = _createElementNS(svgns, "feGaussianBlur");
						blurNode.setAttribute("id", g._base._getUniqueId());
						blurFilter.setAttribute("id", g._base._getUniqueId());
	        		                blurFilter.setAttribute("stdDeviation", size);
	        		                blurNode.appendChild(blurFilter);
						defNode.appendChild(blurNode);
	        		        	surface.rawNode.appendChild(defNode);  
	        		        	this.rawNode.setAttribute("filter", "url(#" + blurNode.getAttribute("id") +")");
					}
                		        return this;
                		}
			});
			break;

		case "silverlight":
			// extend shape to include Silverlight setBlur
			dojo.extend(dojox.gfx.Shape, {
				setBlur: function(blur){
					//	summary:
					//		sets a blur effect (Silverlight) - see http://msdn.microsoft.com/en-us/library/system.windows.media.effects.blureffect%28VS.95%29.aspx
					//	blur: Object
					// 		size: String - can be float or "none" (default = 2.5)
					//		sizeType: String - can be "stdDeviation" (from SVG), "radius" (from Silverlight), 
					//					"pixelRadius" (from VML) (default = "stdDeviation")
					//
					//	notes:	Requires Silverlight 3 or higher
					//		Silverlight nodes only support a maximum of one effect
					//		(TODO: add additional effects to a Border node with background="no brush")

					if (!blur) blur = {"size":"2.5","sizeType":"stdDeviation"};
					if (!blur.size) blur.size = "2.5";
					if (!blur.sizeType) blur.sizeType = "stdDeviation";
					if (blur.size == "none"){
							this.rawNode.effect = null;
					} else if (parseFloat(blur.size)){
						var size = parseFloat(blur.size);
						if (blur.sizeType != "radius") size = (size * 3.0);
						var xamlFragment = "<BlurEffect Radius='" + size + "'/>";
						var blurEffect = this.rawNode.getHost().content.createFromXaml(xamlFragment);
						this.rawNode.effect = blurEffect;
					}
	                		return this;
        			}
			});
			break;

		case "vml":
			// extend shape to include VML setBlur
			dojo.extend(dojox.gfx.Shape, {
				setBlur: function(blur){
					//	summary:
					//		sets a blur effect (VML) - see http://msdn.microsoft.com/en-us/library/ms532979%28VS.85%29.aspx
					//	blur: Object
					// 		size: String - can be float or "none" (default = 2.5)
					//		sizeType: String - can be "stdDeviation" (from SVG), "radius" (from Silverlight), 
					//					"pixelRadius" (from VML) (default = "stdDeviation")
					//
					//	note: For VML, if setFill occurs *after* setBlur, it will override the blur opacity.  
					//		To fix this, add two lines to the Dojo.gfx vml.js file ('setFill' function) as shown
					//		in this diff:
					//		...
					//		  fo.type = "solid";
					//		  fo.opacity = this.fillStyle.a;
					//		+ var alphaFilter = this.rawNode.filters["DXImageTransform.Microsoft.Alpha"];
					//		+ if(alphaFilter) alphaFilter.opacity = this.fillStyle.a * 100;
					//		  this.rawNode.fillcolor = this.fillStyle.toHex();
					//		  this.rawNode.filled = true;
					//		...

					var r = this.rawNode,
						s = r.style,
						regExpBlur = / progid:\S+Blur\([^\)]+\)/g,
						regExpAlpha = / progid:\S+Alpha\([^\)]+\)/g,
						filterWithoutBlur = s.filter.replace(regExpBlur, "").replace(regExpAlpha, "");
					if (!blur) blur = {"size":"2.5","sizeType":"stdDeviation"};
					if (!blur.size) blur.size = "2.5";
					if (!blur.sizeType) blur.sizeType = "stdDeviation";
					if (blur.size == "none"){
						s.filter = filterWithoutBlur;
                				s.margin = 0;
					} else if (parseFloat(blur.size)){
                                		var size = parseFloat(blur.size);
						if (blur.sizeType == "radius") size = (size / 3.0);
						var alphaFilter = r.filters["DXImageTransform.Microsoft.Alpha"];
						var blurFilter = r.filters["DXImageTransform.Microsoft.Blur"];
                      				if(blurFilter){
							if(r.fill.opacity && alphaFilter) alphaFilter.opacity = r.fill.opacity * 100;
                                			blurFilter.pixelradius = size;
                        			} else {
							if(r.fill.opacity) {
								var o = r.fill.opacity * 100;
								s.filter = filterWithoutBlur + 
										" progid:DXImageTransform.Microsoft.Alpha(opacity=" + o + 
										") progid:DXImageTransform.Microsoft.Blur(pixelRadius=" + size + ")";
							} else {
								s.filter = filterWithoutBlur + 
										" progid:DXImageTransform.Microsoft.Blur(pixelRadius=" + size + ")";
							}
							s.margin = dojo.replace("-{0}px 0 0 -{0}px", [Math.round(size)]);
						}
					}
                        		return this;
                		}
			});
			break;
		default:
			dojo.extend(dojox.gfx.Shape, {
				setBlur: function(blur){
					// Canvas does not support a stand-alone blur effect
					return this;
				}
			});
	}

	var _createElementNS = function(ns, nodeType){
		// summary:
		//		Internal helper to deal with creating elements that
		//		are namespaced.  Mainly to get SVG markup output
		//		working on IE.
		if(dojo.doc.createElementNS){
			return dojo.doc.createElementNS(ns,nodeType);
		}else{
			return dojo.doc.createElement(nodeType);
		}
	}

});

