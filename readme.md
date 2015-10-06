# Photomap

Display your Instagram photos on Google Maps, just like Instagram's Photo Map.

Download through GitHub or install with Bower: `bower install photomap`. Reference the `photomap.js` script in your HTML then just fire it up with:

```js
var photomap = new Photomap({
    elementID: 'map',                       // The ID of your element where Photomap will be placed
    instagram: [] || {},                    // Array or object, we'll talk about this in a minute
    onMarkerClick: function(map, marker)    // The function to call when a marker is clicked
    theme: [ /* ... */ ]                    // An optional Google Maps theme, you can find more here: https://snazzymaps.com/
});
```

With the instagram property, you can either pass it:

1. An array of photos that you already have (probably from an existing Instagram request, a random list of photos with the wrong properties won't work):

```js
instagram: [
    { /* Photo 1 */ },
    { /* Photo 2 */ },
    { /* Photo 3 */ }
]
```

2. Or an object containing your Instagram access token / ID and we'll do the AJAX work for you:

```js
instagram: {
    instagram_token: 'xxxxxxx',     // Your Instagram Access Token, you can generate one at: http://jelled.com/instagram/access-token
    instagram_id: 'xxxxxx'          // The ID of the Instagram user's feed to download
}
```
