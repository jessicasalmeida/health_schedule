import app from "./server";
import { connectToDataBase } from "./external/data-sources/mongodb/db-connect";
import { routes } from "./external/api/routers";

const port = 8000;

connectToDataBase()
    .then(()=> {
        app.listen(port, () => {
            app.use('/', routes);
            console.log(`Server is listening on port: ${port}`)
        });
    })
    
.catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
});