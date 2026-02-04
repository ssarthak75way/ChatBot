import mongoose from "mongoose";
import dotenv from 'dotenv'
import { app } from "./app";
dotenv.config()

const PORT = process.env.PORT ?? 4000;

async function bootstrap(): Promise<void> {
    await mongoose.connect(process.env.MONGO_URI as string).then(() => {
        console.log("Connected DB!")

    }).catch((err) => {
        console.error(err);

    })
    app.listen(PORT, () => {
        console.log(`Server is listening on port:${PORT}`);

    })
}

bootstrap()
