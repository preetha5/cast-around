const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Home} = require('./models');

//End points for the dashboard page to get list of saved homes by user
router.get('/:user', (req,res) => {
    const user = req.params.user;
    Home
        .find({"username":user})
        .then(homes=>{
            res.json({
                homes: homes.map(
                    (home) => home.dashboard_serialize())
            });
        })
        .catch(
            err=> {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
            });
    }); //Get endpoint for dashboard page
    
//Delete the record when DELETE request comes with zid in the path
router.delete('/:zid', (req, res) =>{
  console.log("inside delete endpoint", req.params.zid);
  Home
    .findOne({"home_details.zillowId" : req.params.zid})
    .remove()
    .then(() =>{
      console.log(`Deleted home record with ZID ${req.params.zid}`);
      res.status(204).end();
    })
    .catch(
      err=> {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
})

module.exports = router;

