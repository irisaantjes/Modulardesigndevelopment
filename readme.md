# Photomap.js

Display your Instagram photos on Google Maps, just like Instagram's Photo Map.

Download through GitHub or install with Bower: `bower install photomap`. Then just fire it up with:

```js
var photomap = new Photomap({
    elementID: 'map',               // The ID of your element where Photomap will be placed
    instagram_token: 'xxxxxxx',     // Your instagram Access Token, you can generate one here: http://jelled.com/instagram/access-token
    instagram_id: 'xxxxxx',         // The ID of the Instagram user's feed to download
    theme: [ /* ... */ ]            // An optional Google Maps theme, you can find more here: https://snazzymaps.com/
});
```


Things to do:

- Click a photo to open in modal
- Group photos based on close proximity per zoom level
