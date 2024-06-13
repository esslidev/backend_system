import bcrypt from 'bcrypt'

// Generate a salted and hashed password
export const saltAndHashPassword = async (password: string): Promise<string> => {
  // Generate a salt with a complexity of 10
  const salt = await bcrypt.genSalt(10)

  // Hash the password with the generated salt
  const hashedPassword = await bcrypt.hash(password, salt)

  return hashedPassword
}

// Verify a hashed password
export const verifyPassword = async (password: string | null, hashedPassword: string | null): Promise<boolean> => {
  if (password == null || hashedPassword == null) return false
  const match = await bcrypt.compare(password, hashedPassword)
  return match
}

// Calculate JWT expiry time based on lifespan
export const getJwtExpiryTime = (envLifeSpanInSeconds: string | undefined): number | undefined => {
  if (envLifeSpanInSeconds && !isNaN(Number(envLifeSpanInSeconds))) {
    return parseInt(envLifeSpanInSeconds)
  }
  return undefined
}

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isPasswordValid = (password: string): boolean => {
  // Check if password length is at least 8 characters
  if (password.length < 8) {
    return false
  }

  // Check if password contains both letters and numbers
  const containsLetters = /[a-zA-Z]/.test(password)
  const containsNumbers = /\d/.test(password)

  return containsLetters && containsNumbers
}

// Function to check if token is expired
export const isTokenExpired = (exp: number | undefined): boolean => {
  if (typeof exp !== 'number') {
    return true // Handle case where exp is not a number (e.g., undefined)
  }
  const currentTimestamp = Math.floor(Date.now() / 1000)
  return exp < currentTimestamp
}
