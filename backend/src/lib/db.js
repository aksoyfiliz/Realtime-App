import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`DB is connected with: ${conn.connection.host}`)
    } catch (error) {
        console.log("MogoDB connection error:", error)
        process.exit(1)
    }
    


}