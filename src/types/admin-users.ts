import type { User } from "@/types/schema"
import type { Media } from "@prisma/client"

export interface AdminUsersResponse {
    users: User[]
    pagination: {
        page: number
        limit: number
        totalCount: number
        totalPages: number
    }
}

// Make sure all required properties from User remain required
export interface UserDetailsResponse extends Omit<User, "password"> {
    Media: Media[]
    emailVerified?: Date | null
    verificationToken: string | null
    lastLogin?: Date | null
    lastPasswordChange?: Date | null
    active: boolean
    locked: boolean
    description: string | null
    language: string // Required as in User type
    theme: string // Required as in User type
}

export interface UserFilters {
    searchQuery: string
    roleFilter: string[]
    verificationFilter: string | null
    statusFilter: string | null
    startDate: string
    endDate: string
    sortBy: string
    sortDirection: "asc" | "desc"
}
