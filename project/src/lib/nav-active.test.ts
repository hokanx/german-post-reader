import { isNavItemActive } from "./nav-active";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

assert(isNavItemActive("/dashboard", "/dashboard") === true, "exact match is active");
assert(isNavItemActive("/letters/abc-123", "/dashboard") === false, "unrelated path is not active");
assert(
  isNavItemActive("/letters/abc-123", "/letters") === true,
  "a sub-path of a nav item's href is active (e.g. a letter detail page highlights a '/letters' tab)",
);
assert(isNavItemActive("/settings", "/settings") === true, "exact match on settings is active");
assert(isNavItemActive("/upload", "/dashboard") === false, "sibling top-level route is not active");
assert(isNavItemActive("/dashboardextra", "/dashboard") === false, "must not match on unrelated string prefix");
