import { JWT } from "@fastify/jwt";
declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
    authenticateAdmin: any;
    optionalAuth: any;
  }
}
type UserPayload = {
  id: string;
  email: string;
  fullName: string;
};
type AdminPayload = {
  id: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserPayload;
    admin: AdminPayload;
  }
}
