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

// Continue following entering First and Last Name

router.post('/v1/step-1-name', function (req, res) {

    res.redirect('/v1/step-2-nhsnumber');

})

// Continue following entering NHS Number

router.post('/v1/step-2-nhsnumber', function (req, res) {

    res.redirect('/v1/step-3-dob');

})

// Continue following entering date of birth

router.post('/v1/step-3-dob', function (req, res) {

    res.redirect('/v1/step-4-previous-address');

})


// Find your previous address

router.get('/v1/step-4-previous-address', function (req, res) {

    var postcodeLookupPrevious = req.session.data['postcodePrevious']

    const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

    if (postcodeLookupPrevious) {

        if (regex.test(postcodeLookupPrevious) === true) {

            axios.get("https://api.os.uk/search/places/v1/postcode?postcode=" + postcodeLookupPrevious + "&key=" + process.env.POSTCODEAPIKEY)
                .then(response => {
                    var previousAddresses = response.data.results.map(result => result.DPA.ADDRESS);

                    const previoustitleCaseAddresses = previousAddresses.map(previousAddresses => {
                        const previousparts = previousAddresses.split(', ');
                        const previousformattedParts = previousparts.map((part, index) => {
                            if (index === previousparts.length - 1) {
                                // Preserve postcode (DL14 0DX) in uppercase
                                return part.toUpperCase();
                            }
                            return part
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ');
                        });
                        return previousformattedParts.join(', ');
                    });

                    req.session.data['previousAddresses'] = previoustitleCaseAddresses;

                    res.redirect('/v1/select-previous-address')
                })
                .catch(error => {
                    console.log(error);
                    res.redirect('/v1/no-previous-address-found')
                });

        }

    } else {
        res.redirect('/v1/step-4-previous-address')
    }

})

router.post('/v1/previous-address', function (req, res) {

    var previousAddressLine1 = req.session.data['previous-address-line-1'];
    var previousTownOrCity = req.session.data['previous-address-level2'];
    var previousPostcodeManual = req.session.data['previous-address-postcode'];


    if (previousAddressLine1 && previousTownOrCity && previousPostcodeManual) {
        res.redirect('/v1/step-1-name');
    } else {
        res.redirect('/v1/step-5-new-address');
    }

})

router.post('/v1/select-previous-address', function (req, res) {

    var previousAddress = req.session.data['previousAddress'];

    if (previousAddress) {
        res.redirect('/v1/step-5-new-address');
    } else {
        res.redirect('/v1/select-previous-address');
    }

})


// Find your new address

router.get('/v1/step-5-new-address', function (req, res) {

    var postcodeLookupNew = req.session.data['postcodeNew']

    const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

    if (postcodeLookupNew) {

        if (regex.test(postcodeLookupNew) === true) {

            axios.get("https://api.os.uk/search/places/v1/postcode?postcode=" + postcodeLookupNew + "&key=" + process.env.POSTCODEAPIKEY)
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
        res.redirect('/v1/step-5-new-address')
    }

})

router.post('/v1/new-address', function (req, res) {

    var newAddressLine1 = req.session.data['new-address-line-1'];
    var newTownOrCity = req.session.data['new-address-level2'];
    var newPostcodeManual = req.session.data['new-address-postcode'];


    if (newAddressLine1 && newTownOrCity && newPostcodeManual) {
        res.redirect('/v1/step-1-name');
    } else {
        res.redirect('/v1/confirm');
    }

})

router.post('/v1/select-new-address', function (req, res) {

    var newAddress = req.session.data['newAddress'];

    if (newAddress) {
        res.redirect('/v1/confirm');
    } else {
        res.redirect('/v1/select-new-address');
    }

})

router.post('/v1/confirm', function (req, res) {

    var confirmAddress = req.session.data['confirm-address'];

    if (confirmAddress == "Yes") {
        res.redirect('/v1/step-6-supporting-document');
    } else {
        res.redirect('/v1/confirm');
    }

})

router.post('/v1/new-address', function (req, res) {

    res.redirect('/v1/confirm');

})

// Supporting Documents

router.post('/v1/step-6-supporting-document', function (req, res) {

    res.redirect('/v1/step-7-documents-added');

})

router.post('/v1/step-7-documents-added', function (req, res) {

    res.redirect('/v1/step-review');

})

// Review to Contact Method

router.post('/v1/step-review', function (req, res) {
    res.redirect('/v1/contact-method');
})

// Preferred Method of Contact


router.post('/v1/contact-method', function (req, res) {

    var contactMethod = req.session.data['contact'];

    if (contactMethod == "By Email") {
        res.redirect('/v1/step-completion');

    } 
    if (contactMethod == "By Telephone") {
        res.redirect('/v1/step-completion');
    } 
    if (contactMethod == "By Text Message") {
        res.redirect('/v1/step-completion');
    } 
    if (contactMethod == "By Post") {
        res.redirect('/v1/step-completion');
    }

})

// Email to Completion

router.post('/v1/contact-email', function (req, res) {
    res.redirect('/v1/step-completion');
})

// Telephone to Completion

router.post('/v1/contact-telephone', function (req, res) {
    res.redirect('/v1/step-completion');
})

// Mobile Text to Completion

router.post('/v1/contact-textmsg', function (req, res) {
    res.redirect('/v1/step-completion');
})

module.exports = router;