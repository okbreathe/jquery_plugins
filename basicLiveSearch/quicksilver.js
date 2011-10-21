// qs_score - Quicksilver Score
//
// The MIT License
// 
// Copyright (c) 2008 Lachie Cox, Modified by Asher Van Brunt
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var Quicksilver = {
  score: function(string, abrev, offset) {
    var sub_abrev, index, next_string, next_abrev, remaining_score,score,c;
    offset = (offset || 0);
   
    if(abrev.length === 0)  {
      return 0.9;
    } else if (abrev.length > string.length)  {
      return 0.0;
    }

    for (var i = abrev.length; i > 0; i--) {
      sub_abrev = abrev.substring(0,i);
      index     = string.indexOf(sub_abrev);

      if(index < 0 || (index + abrev.length > string.length + offset)) { continue; }

      next_string       = string.substring(index+sub_abrev.length);
      next_abrev = null;

      if(i >= abrev.length) {
        next_abrev = '';
      } else {
        next_abrev = abrev.substring(i);
      }
   
      remaining_score = Quicksilver.score(next_string,next_abrev,offset+index);
   
      if (remaining_score > 0) {
        score = string.length-next_string.length;

        if (index !== 0) {
          c = string.charCodeAt(index-1);
          if (c == 32 || c == 9) {
            for (var j=(index-2); j >= 0; j--) {
              c = string.charCodeAt(j);
              score -= ((c == 32 || c == 9) ? 1 : 0.15);
            }
          } else {
            score -= index;
          }
        }
        score += remaining_score * next_string.length;
        score /= string.length;
        return score;
      }
    }
    return 0.0;
  }
};

String.prototype.score = function(abbreviation,offset) {
  return Quicksilver.score(this,abbreviation);
};
