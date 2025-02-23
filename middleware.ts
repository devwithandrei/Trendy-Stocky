import { authMiddleware } from "@clerk/nextjs";

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
    "/api/webhook",
    "/api/create-payment-intent(.*)",
    "/api/users(.*)",
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
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
    }
  },
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ]
};
