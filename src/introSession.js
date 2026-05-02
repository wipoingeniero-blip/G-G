export const INTRO_SESSION_KEY = "gg-intro-shown"

function readIntroSeen() {
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === "1"
  } catch {
    return false
  }
}

export function writeIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1")
  } catch {
    /* private mode */
  }
}

export function hasIntroBeenSeenThisSession() {
  return readIntroSeen()
}
