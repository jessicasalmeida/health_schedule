import app from "./server";
import { connectToDataBase } from "./external/data-sources/mongodb/db-connect";
import { router } from "./external/api/routers/schedule-router";

const port = 8003;

connectToDataBase()
    .then(()=> {
        app.listen(port, () => {
            app.use('/', router);
            console.log(`Server is listening on port: ${port}`)
        });
    })
    
.catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
});