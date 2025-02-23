import { authMiddleware } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/products",
    "/products/(.*)",
    "/product/(.*)",
    "/category",
    "/category/(.*)",
    "/cart",
    "/cart/(.*)",
    "/api/products(.*)",
    "/api/categories(.*)",
    "/api/create-payment-intent(.*)",
    "/orders",
    "/orders/(.*)",
    "/api/stripe/(.*)",
    "/api/stripe-webhook",
    "/api/payment/(.*)",
    "/api/stripe/payment_intents(.*)",
    "/api/stripe/setup_intents(.*)",
    "/api/stripe/elements/(.*)",
    "/api/create-payment-intent"
  ],
  afterAuth(auth, req) {
    // Handle auth state
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
