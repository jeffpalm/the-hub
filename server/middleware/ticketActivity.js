module.exports = async (req, res, next) => {
  const db = req.app.get('db'),
    {activity, sales_id, type, } = req.body,
    {id} = req.params
  

  
  const action = {
    POST: 'created',
    PUT: 'updated', 
    DELETE: 'deleted'
  }


  
}