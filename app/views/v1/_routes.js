// ********************************
// TEST V1 - KATIE TWINN
// ********************************

// External dependencies
const express = require('express');
const router = express.Router();

// API
const axios = require('axios');


router.post('/v1/start', function (req, res) {

    res.redirect('/v1/step-1-name');

})

router.post('/v1/step-1-name', function (req, res) {

    res.redirect('/v1/step-2-nhsnumber');

})

router.post('/v1/step-2-nhsnumber', function (req, res) {

    res.redirect('/v1/step-3-dob');

})

router.post('/v1/step-3-dob', function (req, res) {

    res.redirect('/v1/step-4-previous-address');

})


// Find your previous address

router.get('/v1/step-4-previous-address', function (req, res) {

    // Get the 'postcode' data from the submitted form
    var postcodeLookup = req.session.data['postcode']

    // Define a 'regular expression' to validate the postcode format
    const regex = RegExp('^([A-PR-UWYZ](([0-9](([0-9]|[A-HJKSTUW])?)?)|([A-HK-Y][0-9]([0-9]|[ABEHMNPRVWXY])?)) ?[0-9][ABD-HJLNP-UW-Z]{2})$', 'i');

    // Check if 'postcodeLookup' has a value
    if (postcodeLookup) {

        // Check if the 'postcodeLookup' matches the specified 'regular expression'
        if (regex.test(postcodeLookup) === true) {

            // Make an HTTP GET request to an external API (OS UK) to retrieve address data based on the postcode
            axios.get("https://api.os.uk/search/places/v1/postcode?postcode=" + postcodeLookup + "&key="+ process.env.POSTCODEAPIKEY)
            .then(response => {
                // Extract and map the addresses from the API response
                var addresses = response.data.results.map(result => result.DPA.ADDRESS);

                // Format the addresses in title case
                const titleCaseAddresses = addresses.map(address => {
                    const parts = address.split(', ');
                    const formattedParts = parts.map((part, index) => {
                        if (index === parts.length - 1) {
                            // Preserve postcode (SW1A 2AA) in uppercase
                            return part.toUpperCase();
                        }
                        return part
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(' ');
                    });
                    return formattedParts.join(', ');
                });

                // Store the formatted addresses in the session data
                req.session.data['addresses'] = titleCaseAddresses;

                // Redirect to the 'Select Address' page
                res.redirect('/v1/select-previous-address')
            })
            .catch(error => {
                // Redirect in case of an error
                res.redirect('/v1/no-previous-address-found')
            });

        } else {
            // Redirect if 'postcodeLookup' doesn't match the specified 'regular expression'
            res.redirect('/v1/step-4-previous-address')
        }

    } else {
        // Redirect if 'postcodeLookup' is empty
        res.redirect('/v1/step-4-previous-address')
    }

})

// Find your new address

router.get('/v1/step-5-new-address', function (req, res) {

    var postcodeLookupNew = req.session.data['postcodeNew']
    
    const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');
    
    if (postcodeLookupNew) {
    
        if (regex.test(postcodeLookupNew) === true) {
    
            axios.get("https://api.os.uk/search/places/v1/postcode?postcode=" + postcodeLookupNew + "&key="+ process.env.POSTCODEAPIKEY)
            .then(response => {
                var newAddresses = response.data.results.map(result => result.DPA.ADDRESS);

                const newtitleCaseAddresses = newAddresses.map(newAddresses => {
                    const newparts = newAddresses.split(', ');
                    const newformattedParts = newparts.map((part, index) => {
                      if (index === newparts.length - 1) {
                        // Preserve postcode (DL14 0DX) in uppercase
                        return part.toUpperCase();
                      }
                      return part
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                    });
                    return newformattedParts.join(', ');
                  });
    
                req.session.data['newAddresses'] = newtitleCaseAddresses;

                res.redirect('/v1/select-new-address')
            })
            .catch(error => {
                console.log(error);
                res.redirect('/v1/no-new-address-found')
            });
    
        }
    
    } else {
        res.redirect('/v1/step-5--new-address')
    }
    
})
    
 router.post('/v1/new-address', function (req, res) {
    
    var newAddressLine1 = req.session.data['new-address-line-1'];
    var newTownOrCity = req.session.data['new-address-level2'];
    var newPostcodeManual = req.session.data['new-address-postcode'];
    
    
    if (newAddressLine1 && newTownOrCity && newPostcodeManual) {
        res.redirect('/v1/name');
    } else {
        res.redirect('/v1/new-address');
    }
    
})
    
router.post('/v1/select-new-address', function (req, res) {
    
    var newAddress = req.session.data['newAddress'];

    if (newAddress) {
        res.redirect('/v1/confirm-address');
    } else {
        res.redirect('/v1/select-new-address');
    }
    
})


module.exports = router;