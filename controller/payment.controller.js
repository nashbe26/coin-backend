const stripe = require('stripe')("sk_test_51HEvaHLlNX7wORuBfcF6maeJ60yhJn3E7EWjKO7nAKKpgSoXo0IMUvVS04zQTbuVbHmcuriGxw8ORX1U7wGICybC00eeGtxOih");
const Transaction = require('../models/transactions')
const User = require('../models/user')
const Produit = require('../models/produit')

const getUserTrans = async (req,res) =>{
    let id = req.route.meta.user._id;

    const Trans = await Transaction.find({user_id:id});
    
    if(!Trans)
        return res.status(500).json({ error: "failed to change status" });
    
    return res.status(200).json(Trans);

  }

const chargeStripe = async (req, res) => {
    try {
        
        const { amount } = req.body;
        let user = req.route.meta.user
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, 
            currency: 'eur', 
        });
      
        let newTrans = {
            price: amount,
            method: "Card",
            transactionDoneDate: new Date(),
            user_id: user._id,
            seller_id: req.body.seller_id,
            prod_id:req.body.prod_id ,
            pay_int:paymentIntent.id,
            status:"pending"
        }

        let trans = new Transaction(newTrans);
        await trans.save();

        if(!trans)
            return res.status(500).json('failed to create trans id');

        return res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  };

  const acceptedPayement = async (req,res) =>{

    try{

        let id = req.params.id;
        let user = req.route.meta.user._id;
    
        const Trans = await Transaction.findOne({pay_int:id});
        Trans.status = "Accepté";
        await Trans.save();
    
        const users = await User.findById(user);
        users.transactions.push(Trans._id);
        users.achete.push(Trans.prod_id);
        await users.save();
        
        const sell = await User.findById(Trans.seller_id);
        sell.vendu.push(Trans.prod_id);
        await sell.save();
        
        const prod = await Produit.findById(Trans.prod_id)
        prod.statusProd = "Vendu";
        await prod.save();
    
        return res.status(200).json(Trans);

    }catch(err){

        console.log(err);
        return res.status(500).json({ error: "failed to change status" });
    }

 

  }
  
  const refusedPayement = async (req,res) =>{
    try{
        let id = req.params.id;

        const Trans = await Transaction.findOne({pay_int:id});
        Trans.status = "refusé"
        Trans.save()
        if(!Trans)
        return res.status(500).json({ error: "failed to change status" });
        return res.status(200).json(Trans);
    }catch(err){
        return res.status(500).json({ error: "failed to change status" });

    }


  }

  module.exports={
    chargeStripe,
    acceptedPayement,
    refusedPayement,
    getUserTrans
} 

