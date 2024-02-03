const express = require('express');
const router = express.Router();
const User = require('../model/model');

//create
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({error : error.message});
  }
});

//read 
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({error : error.message});
  }
});

// update
router.put('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'age', 'country', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).send({error : "user not found"});
    }
    res.send(user);
  } catch (error) {
    res.status(400).send({error : error.message});
  }
});

//delete
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({error : error.message});
  }
});


//aggregation
router.get('/aggregated_users', async (req, res) => {
    try {
      const aggregationResult = await User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            averageAge: { $avg: "$age" },
            countries: {
              $addToSet: "$country"
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalUsers: 1,
            averageAge: 1,
            countriesCount: { $size: "$countries" }
          }
        }
      ]);
  
      res.json(aggregationResult);
    } catch (error) {
      console.error(error);
      res.status(500).send({error : 'Internal Server Error'});
    }
  });
  

module.exports = router;