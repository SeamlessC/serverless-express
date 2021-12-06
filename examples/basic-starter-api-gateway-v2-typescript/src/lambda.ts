import "source-map-support/register";
import serverlessExpress from "@vendia/serverless-express";
import app from "./configurations/server-config";

export const handler = serverlessExpress({ app });
