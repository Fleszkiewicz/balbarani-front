export type UserInfo = {
    id?: string
    username?: string
    email?: string
    isAdmin?: boolean
}

export type UserContextValue = {
    userInfo: UserInfo
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
    loading: boolean
    checkSession: () => Promise<void>
    getUserId: () => string | null
    isAuthenticated: () => boolean
    isAdmin: () => boolean
}
