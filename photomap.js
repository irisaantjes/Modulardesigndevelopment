/*global ActiveXObject*/

this.Photomap = function (params) {

    'use strict';

    // Error without package requirements
    if (!window.google) {
        throw new Error('Photomap requires the Google Maps JS SDK.');
    }

    // Define option defaults
    var defaults = {
        elementID: null,
        instagram: null,
        onMarkerClick: function (map, marker) {
            map.setZoom(8);
            map.setCenter(marker.getPosition());
        },
        theme: [
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f7f1df"
                }]
            }, {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#d0e3b4"
                }]
            }, {
                "featureType": "landscape.natural.terrain",
                "elementType": "geometry",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "poi.medical",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#fbd3da"
                }]
            }, {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#bde6ab"
                }]
            }, {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ffe15f"
                }]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#efd151"
                }]
            }, {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ffffff"
                }]
            }, {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "black"
                }]
            }, {
                "featureType": "transit.station.airport",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#cfb2db"
                }]
            }, {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#a2daf2"
                }]
            }
        ]
    },
        options = {},
        bounds = new google.maps.LatLngBounds();

    // Extend defaults with user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    // Update URL with query.
    function updateURL(url, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"),
            separator = url.indexOf('?') !== -1 ? "&" : "?";
        return url.match(re) ? url.replace(re, '$1' + key + "=" + value + '$2') : url + separator + key + "=" + value;
    }

    // Create a map marker
    function createMarker(photo, map) {
        var marker = new google.maps.Marker({
            title: photo.caption.text,
            position: {
                lat: photo.location.latitude,
                lng: photo.location.longitude
            },
            animation: google.maps.Animation.DROP,
            icon: {
                url: photo.images.standard_resolution.url,
                size: new google.maps.Size(60, 60),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(16, 16),
                scaledSize: new google.maps.Size(60, 60)
            }
        });
        marker.setMap(map);
        marker.addListener('click', function () {
            options.onMarkerClick(map, marker);
        });
        bounds.extend(marker.position);
    }

    // Throw a script.onerror error
    function scriptError(error) {
        throw new URIError("The script " + error.target.src + " is not accessible.");
    }


    // Load photos from Instagram
    function loadImages(map, url, token, callback) {
        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random()),
            script = document.createElement('script');
        url = updateURL(url, 'count', 50);
        url = updateURL(url, 'access_token', token);
        url = updateURL(url, 'callback', callbackName);
        script.src = url;
        script.onerror = scriptError;
        document.body.appendChild(script);

        window[callbackName] = function (photos) {

            // Cleanup the current callback
            delete window[callbackName];
            document.body.removeChild(script);

            // Process the images
            var i = 0;

            for (i = 0; i < photos.data.length; i += 1) {
                createMarker(photos.data[i], map);
            }
            if (photos.pagination && photos.pagination.next_url) {
                loadImages(map, photos.pagination.next_url, token, callback);
            } else {
                return callback();
            }
        };

    }

    // Create a Google Map
    function createMap(callback) {
        var theme = new google.maps.StyledMapType(options.theme, { name: "Photomap" }),
            mapOptions = { scrollwheel: false },
            element = document.getElementById(options.elementID),
            map = new google.maps.Map(element, mapOptions);
        map.mapTypes.set('map_style', theme);
        map.setMapTypeId('map_style');
        return callback(map);
    }

    // Create options by extending defaults with the passed in parameters
    if (params && typeof params === "object") {
        options = extendDefaults(defaults, params);
    } else {
        throw new Error('Please provide a valid configuration');
    }

    // Run Photomap
    createMap(function (map) {

        if (Object.prototype.toString.call(params.instagram) === '[object Array]') {

            var i = 0;
            for (i = 0; i < params.instagram.length; i += 1) {
                createMarker(params.instagram[i], map);
            }
            map.fitBounds(bounds);
        } else if (typeof params.instagram === "object") {
            loadImages(map, 'https://api.instagram.com/v1/users/' + options.instagram.instagram_id + '/media/recent/', options.instagram.instagram_token, function (error) {
                if (error) {
                    throw new Error(error);
                }
                map.fitBounds(bounds);
            });
        }

    });

};
