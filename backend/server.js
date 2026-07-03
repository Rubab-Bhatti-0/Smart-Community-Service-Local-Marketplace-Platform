require('dotenv').config()
const getConnection=require('./config/db/db')
const PORT=process.env.PORT || 5000
const app=require('./src/App')

getConnection()

try {
    app.listen(PORT,()=>{
        console.log(`Server is listening on port ${PORT}`)
    })

    
} catch (error) {
    console.log(error)
    
}