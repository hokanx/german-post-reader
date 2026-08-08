/**
 * A nav item is active on an exact path match, or on any sub-path of it
 * (e.g. "/letters/abc-123" should highlight a "/letters" tab) - but never on
 * an unrelated path that merely shares a string prefix (e.g. "/dashboardextra"
 * must not match "/dashboard"), so sub-path matching requires the boundary
 * slash, not just startsWith.
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
