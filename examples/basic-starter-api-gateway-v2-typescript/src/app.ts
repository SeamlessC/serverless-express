// import cors from "cors";
// import express, { Request, Response } from "express";
// import path from "path";
// import compression from "compression";
// import { getCurrentInvoke } from "@vendia/serverless-express";
// import { IndexRoutes } from "./routes/index.routes";
// import { MongoConnection } from "./configurations/mongo";
// import dotenv from 'dotenv';
// const app = express();
// const router = express.Router();


// class App {
//   public app: express.Application;
//   private index_routes: IndexRoutes = new IndexRoutes();
//   private mongo_connection: MongoConnection = new MongoConnection();

//   constructor() {
//       this.app = express();
//       this.app.use(cors({ origin: true }))
//       this.config();
//       dotenv.config();
//       this.mongo_connection.connect();
//       this.index_routes.route(this.app);

//   }

//   private config(): void {
//       // support application/json type post data
//       this.app.use(express.json({ limit: '5mb' }));
//       // support application/x-www-form-urlencoded post data
//       this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));

//       this.app.use((req, res, next) => {
//           res.setHeader('Access-Control-Allow-Origin', "*");

//           res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');

//           res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

//           res.setHeader('Access-Control-Allow-Credentials', 'true');

//           if (req.url.substr(0, 4) === '/api') {
//               req.url = req.url.substr(4);
//           }

//           next();
//       });
//   }

// }


// router.use(compression());
// router.use(cors());
// router.use(express.json());
// router.use(express.urlencoded({ extended: true }));

// // NOTE: tests can't find the views directory without this
// app.set("views", path.join(__dirname, "views"));

// router.get("/", (req: Request, res: Response) => {
//   const currentInvoke = getCurrentInvoke();
//   const { event = {} } = currentInvoke;
//   const { requestContext = {} } = event;
//   const { domainName = "localhost:3000" } = requestContext;
//   const apiUrl = `https://${domainName}`;
//   return res.render("index", {
//     apiUrl,
//   });
// });

// router.get("/vendia", (req: Request, res: Response) => {
//   return res.sendFile(path.join(__dirname, "vendia-logo.png"));
// });

// router.get("/users", (req: Request, res: Response) => {
//   return res.json(users);
// });

// router.get("/users/:userId", (req: Request, res: Response) => {
//   const user = getUser(req.params.userId);

//   if (!user) return res.status(404).json({});

//   return res.json(user);
// });

// router.post("/users", (req: Request, res: Response) => {
//   const user = {
//     id: ++userIdCounter,
//     name: req.body.name,
//   };
//   users.push(user);
//   return res.status(201).json(user);
// });

// router.put("/users/:userId", (req: Request, res: Response) => {
//   const user = getUser(req.params.userId);

//   if (!user) return res.status(404).json({});

//   user.name = req.body.name;
//   return res.json(user);
// });

// router.delete("/users/:userId", (req: Request, res: Response) => {
//   const userIndex = getUserIndex(req.params.userId);

//   if (userIndex === -1) return res.status(404).json({});

//   users.splice(userIndex, 1);
//   return res.json(users);
// });

// router.get("/cookie", (req: Request, res: Response) => {
//   res.cookie("Foo", "bar");
//   res.cookie("Fizz", "buzz");
//   return res.json({});
// });

// const getUser = (userId: string) =>
//   users.find((u) => u.id === parseInt(userId));

// const getUserIndex = (userId: string) =>
//   users.findIndex((u) => u.id === parseInt(userId));

// // Ephemeral in-memory data store
// const users = [
//   {
//     id: 1,
//     name: "Joe",
//   },
//   {
//     id: 2,
//     name: "Jane",
//   },
// ];

// let userIdCounter = users.length;

// // The serverless-express library creates a server and listens on a Unix
// // Domain Socket for you, so you can remove the usual call to app.listen.
// // app.listen(3000)
// app.use("/", router);

// export { app };
