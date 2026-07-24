import { NextResponse, type NextRequest } from "next/server";
import { ROUTE_HINT_COOKIE, parseRouteHint } from "@/lib/auth/route-hint";
import { ROUTES, homeForRole } from "@/constants/routes";

/**
 * Edge middleware for early, portal-aware routing.
 *
 * Two isolated portals:
 *   • Student Portal    (/student)  → students only (email OTP)
 *   • Management Portal (/portal)   → recruiters & admins (email + password)
 *
 * It reads a NON-sensitive routing-hint cookie (role + flags). This is UX
 * routing, NOT the security boundary — Firestore Security Rules + server-set
 * custom claims enforce real authorization, and client guards (RequireAuth)
 * plus the login services re-check the role on every sign-in.
 */

const STUDENT_PATHS = [
  "/dashboard",
  "/profile",
  "/placement-drives",
  "/companies",
  "/applications",
  "/interviews",
  "/resume",
  "/documents",
  "/skills",
  "/notifications",
  "/announcements",
  "/settings",
  "/help",
];

// Guest (unauthenticated) entry points — signed-in users get bounced home.
const GUEST_PATHS: string[] = [
  ROUTES.studentLogin, // /student
  ROUTES.portal, // /portal
  ROUTES.portalRegister, // /portal/register
  ROUTES.forgotPassword, // /forgot-password
];

// Old URLs → new portal URLs (keep bookmarks & inbound links working).
const LEGACY_REDIRECTS: Record<string, string> = {
  "/login": ROUTES.studentLogin,
  "/admin/login": ROUTES.portal,
  "/recruiter/login": ROUTES.portal,
  "/recruiter/register": ROUTES.portalRegister,
};

const isUnder = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const redirect = (to: string) => {
    const url = req.nextUrl.clone();
    url.pathname = to;
    url.search = "";
    return NextResponse.redirect(url);
  };

  // 0) Legacy URL redirects — run before any auth logic.
  const legacy = LEGACY_REDIRECTS[pathname];
  if (legacy) return redirect(legacy);

  const hint = parseRouteHint(req.cookies.get(ROUTE_HINT_COOKIE)?.value);

  // Protected areas. With the login pages moved to /student and /portal, the
  // ENTIRE /admin and /recruiter trees are private.
  const isStudentArea =
    pathname === ROUTES.onboarding || STUDENT_PATHS.some((p) => isUnder(pathname, p));
  const isAdminArea = isUnder(pathname, ROUTES.admin.home); // /admin/**
  const isRecruiterArea = isUnder(pathname, ROUTES.recruiter.home); // /recruiter/**
  const isManagementArea = isAdminArea || isRecruiterArea;
  const isProtected = isStudentArea || isManagementArea;

  // 1) Unauthenticated → send to the correct portal login.
  if (!hint) {
    if (isProtected) {
      return redirect(isManagementArea ? ROUTES.portal : ROUTES.studentLogin);
    }
    return NextResponse.next();
  }

  const role = hint.role;

  // 2) Wrong role for the area → 403. (Students can never reach /portal-side areas;
  //    recruiters can never reach /admin, and vice-versa.)
  if (isStudentArea && role !== "student") return redirect(ROUTES.unauthorized);
  if (isRecruiterArea && role !== "recruiter") return redirect(ROUTES.unauthorized);
  if (isAdminArea && role !== "admin") return redirect(ROUTES.unauthorized);

  // 3) Student must finish onboarding before using student pages.
  if (
    role === "student" &&
    isStudentArea &&
    pathname !== ROUTES.onboarding &&
    !hint.profileCompleted
  ) {
    return redirect(ROUTES.onboarding);
  }

  // 4) Unapproved recruiters are confined to the landing + pending screens.
  if (
    role === "recruiter" &&
    isRecruiterArea &&
    hint.approvalStatus !== "approved" &&
    pathname !== ROUTES.recruiter.pending &&
    pathname !== ROUTES.recruiter.home
  ) {
    return redirect(ROUTES.recruiter.pending);
  }

  // 5) Signed-in users should not sit on guest auth pages → send them home.
  //    This also enforces "students can never access /portal": a signed-in
  //    student landing on /portal is bounced to their dashboard.
  if (GUEST_PATHS.includes(pathname)) {
    return redirect(homeForRole(role));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|woff2?)$).*)",
  ],
};
