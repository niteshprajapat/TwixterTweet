const BASE_CASE = "http://127.0.0.1:5000/api/v1"

export const routes = {
    REGISTER: `${BASE_CASE}/auth/register`,
    LOGIN: `${BASE_CASE}/auth/login`,
    LOGOUT: `${BASE_CASE}/auth/logout`,
    MEPROFILE: `${BASE_CASE}/user/me`,
}

