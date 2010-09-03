# Dojox.gfx Plugins

Dojox.gfx Plugins are a collection of effects that are designed to work with <a href="http://www.dojotoolkit.org/reference-guide/dojox/gfx.html">dojox.gfx</a>.

## Installation

Add the desired effect javascript file to your project.  See the examples for more help.

## Usage

    blur: Object
        size: String - can be float or "none" (default = 2.5)
        sizeType: String - can be "stdDeviation" (from SVG), "radius" (from Silverlight), "pixelRadius" (from VML) (default = "stdDeviation")

    shadow: Object
        dx: Integer - sets x-axis offset (default = 4)
        dy: Integer - sets y-axis offset (default = 4)
        size: String - sets shadow size, can be float or "none" (default = 2.5)
        sizeType: String - can be "stdDeviation" (from SVG), "radius" (from Silverlight), "pixelRadius" (from VML) (default = "stdDeviation")
        color: Array|String|Object (dojo.Color) - sets shadow color (default = [0,0,0,0.5])

## FAQ

**Q:** Why does the blur effect not work with the Canvas renderer?  
**A:** Canvas doesn't support a stand-alone blur effect.

**Q:** Why doesn't my Silverlight blur work?  
**A:** Silverlight version 3 or higher is required for blur.

**Q:** Why doesn't my Silverlight object show multiple effects?  
**A:** Silverlight currently only supports one effect per object.

**Q:** Why is my opacity missing with the VML renderer?  
**A:** If setFill occurs after setBlur, it will override the opacity.  Make sure to use setBlur *after* setFill.  See dojox.gfx.plugins.Blur.js file for a workaround fix.

**Q:** Why doesn't the blur effect work in Safari?  
**A:** Safari doesn't currently implement feGaussianBlur properly.  Use WebKit nightly instead.

**Q:** Why isn't the shadow blurred using the VML renderer?  
**A:** VML doesn't support shadow blur.

**Q:** Why does the shadow sometimes appear through the original object using the Canvas renderer?  
**A:** Good question.  Setting globalCompositeOperation="lighter" helps a little but I'm sure there's a better answer.

## License

<a href="http://www.opensource.org/licenses/bsd-license.php">New BSD License</a>

Copyright (c) 2010, Stela 5
All rights reserved.
 
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 
* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Stela 5 nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
