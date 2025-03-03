
//Definimos el base
export type User = {
    name: string;
    email: string;
    handle: string;
    _id: string;
    description: string;
    image?: string;
    links: string;
}

export type userHandle = Pick<User, 'description' | 'handle' | 'image' | 'links' | 'name'>

export type RegisterForm = Pick<User, 'name' | 'email' | 'handle'> & {
    password: string;
    password_confirmation: string
}

export type LoginForm = Pick<User, 'email'> & {
    password: string
}

export type ProfileForm = Pick<User, 'handle' | 'description' | 'image'>

//esta sera la estructura de la BD
export type SocialNetork = {
    id: number;
    name: string;
    url: string;
    enabled: boolean;
}

//Estructura para loginView
export type DevTreeLink = Pick<SocialNetork, 'name' | 'url' | 'enabled'>