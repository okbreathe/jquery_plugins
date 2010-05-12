# okColorPicker
*Simplified Colour Picker (<3kb minified)* 

## Explanation

Most users don't need to pick from 16,777,216 colours. We'll stick with 112.

## Usage

options       | default       | description
------------- | ------------- | -------------
changeEvent   | mouseenter    | Event that triggers a colour change
selectEvent   | click         | Event that triggers selection
afterChange   | null          | Called after colour is changed
afterSelect   | null          | Called after colour is selected
displayColor  | true          | Overlay the color value on top the selected colour
displayHex    | true          | If true will display the colour in hex, otherwise an RGB value;
