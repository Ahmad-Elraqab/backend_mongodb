const express = require('express')
const router = express.Router()
const User = require('../models/user')
const ServiceProvider = require('../models/service_provider')
var cors = require('cors')

router.get('/', cors(), async (req, res) => {

    try {
        let user;
        user = await User.find();
        res.status(201).json(user);


    } catch (err) {
        res.status(500).json({ message: err.message });
    }

})
router.get('/categories', cors(), async (req, res) => {

    try {
        let user;
        user = await User.find({ isServiceProvider: true });
        res.status(201).json(user);


    } catch (err) {
        res.status(500).json({ message: err.message });
    }

})

router.get('/serviceprovider', cors(), async (req, res) => {

    console.log(req.query)
    try {
        let user;

        // user = await User.find({ isServiceProvider: true,fullName:req.query.fullName });
        user = await User.find({ $and: [{ isServiceProvider: true }, { fullName:req.query.fullName }] })
            
        res.status(201).json(user);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

})

router.post('/login/auth', cors(), async (req, res) => {

    try {
        let user;
        if (Object.keys(req.body).length == 0) {

            res.status(500).json({ message: "lost of required data" });

        } else {
            user = await User.find({
                email: req.body.email,
                password: req.body.password
            });
            if (Object.keys(user).length == 0) {

                res.status(500).json({ message: "invalid email or password" });
            } else {
                res.status(200).json(user);
            }
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/signup/auth', cors(), async (req, res) => {

    try {
        let user;
        if (Object.keys(req.body).length == 0) {
            res.status(500).json({ message: "lost of required data" });
        } else {

            user = await User.find({
                email: req.body.email,
            });
        }
        if (Object.keys(user).length == 0) {

            console.log((req.body.firstName+req.body.lastName))
            user = new User({
                id: req.body.id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                fullName:req.body.firstName + req.body.lastName,
                imgSrc: req.body.imgSrc,
                email: req.body.email,
                password: req.body.password,
                gender: req.body.gender,
                city: req.body.city,
                country: req.body.country,
                phoneNumber: req.body.phoneNumber,
                postalCode: req.body.postalCode,
                long: req.body.long,
                lat: req.body.lat,
                displayLanguage: req.body.displayLanguage,
                token: req.body.token,
                isServiceProvider: req.body.isServiceProvider,
                isCashPaymentActive: req.body.isCashPaymentActive,
                jobName: req.body.jobName,
                jobDescription: req.body.jobDescription,
                rate: req.body.rate,
                diagnosingFees: req.body.diagnosingFees,
                notification: {
                    showNotificatoin: req.body.showNotificatoin,
                    allowNotificationDot: req.body.allowNotificationDot,
                    excutivePrograms: req.body.excutivePrograms,
                    discountsDeals: req.body.discountsDeals
                },
            })
            res.status(200).json(user);
            user.save();
        } else {
            res.status(500).json({ message: "email already exist" });
        }

    } catch (err) {
        res.status(500).json({ message: "flow is not right" });
    }
})

router.get('/:id', getUser, (req, res) => {
    res.json(res.user)
})

router.post('/', async (req, res) => {


    user = new User({
        id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        fullName:req.body.firstName + req.body.lastName,
        imgSrc: req.body.imgSrc,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        city: req.body.city,
        country: req.body.country,
        phoneNumber: req.body.phoneNumber,
        postalCode: req.body.postalCode,
        long: req.body.long,
        lat: req.body.lat,
        displayLanguage: req.body.displayLanguage,
        token: req.body.token,
        isServiceProvider: req.body.isServiceProvider,
        isCashPaymentActive: req.body.isCashPaymentActive,
        notification: {
            showNotificatoin: req.body.showNotificatoin,
            allowNotificationDot: req.body.allowNotificationDot,
            excutivePrograms: req.body.excutivePrograms,
            discountsDeals: req.body.discountsDeals
        },
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
router.post('/service-provider/create', async (req, res) => {
    const user = new ServiceProvider({
        // add attributes
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getUser, async (req, res, next) => {
    try {
        await res.user.remove()
        res.json({ message: 'Deleted user' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.patch('/:id', async (req, res) => {


    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(req.body);
        // console.log(updateUser);
        res.json(updateUser)

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id);

        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()
}
module.exports = router