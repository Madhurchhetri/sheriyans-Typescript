import { setUser, setLoading, setError } from '../state/auth.slice'
import { register, login } from '../service/auth.api'
import { useDispatch } from 'react-redux'

export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({ email, password, fullname, contact, isSeller = false }) {
        dispatch(setLoading(true))
        try {
            const data = await register({ email, password, fullname, contact, isSeller })
            dispatch(setUser(data.user))
            return data
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || 'Registration failed'))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        dispatch(setLoading(true))
        try {
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return data
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || 'Login failed'))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister,
        handleLogin,
    }
}