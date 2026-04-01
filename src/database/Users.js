export const MOCK_USERS = [
  {
    id:       "USR-001",
    name:     "VIT VELLORE",
    email:    "vit@bhoomi.in",
    password: "vit",
    role:     "user",
    phone:    "9103355700",
    aadhaar:  "XXXX XXXX 4521",
    state:    "Haryana",
    since:    "December 2006",
    address:  "790P Sector 57, Gurgaon - 122003",
  },
  {
    id:       "Registrar ",
    name:     "Narendra Modi",
    email:    "modi@bhoomi.in",
    password: "modi",
    role:     "registrar",
    phone:    "9000012345",
    aadhaar:  "XXXX XXXX 0011",
    state:    "Gujrat",
    since:    "Jan 2002",
    office:   "Registrar Office, Haryana",
    district: "Gurgaon",
  },
];



export const findUserByEmail = (email) =>
  MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;

export const authenticateUser = (email, password) => {
  const user = findUserByEmail(email);
  if (!user) return { success: false, error: "No account found with this email." };
  if (user.password !== password) return { success: false, error: "Incorrect password." };
  
  const { password: _pw, ...safeUser } = user;
  return { success: true, user: safeUser };
};
