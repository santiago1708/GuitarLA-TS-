
import type { Guitar, CartItem } from './../types/index'; 
import { db } from "../data/db"
import { useState , useEffect, useMemo} from "react"

export const useCart = () => {

    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : [] //JSON.parce lo convierte a un arreglo
    }

    //State 
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item : Guitar) {
        const itemsE = cart.findIndex((guitar) => guitar.id === item.id)
        if(itemsE < 0 ){
            const newItem : CartItem = {...item, quantity : 1}
            setCart([...cart, newItem])
        }else {
            if(cart[itemsE].quantity >= MAX_ITEMS) return 
            const updateCart = [...cart]
            updateCart[itemsE].quantity++
            setCart(updateCart)
        }
    }

    function removeFromCart(id : Guitar['id']) {
        setCart((prevCart) => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuanquity(id : Guitar['id']) {
        const updatedCart = cart.map((item) => {
            if(item.id === id && item.quantity < MAX_ITEMS){
                return {
                    ...item, 
                    quantity: item.quantity + 1}
            }
            return item
        }) 
        setCart(updatedCart)
    }

    function DecreaseQuanquity(id : Guitar['id']) {
        const updatedCart = cart.map((item) => {
            if(item.id === id && item.quantity > MIN_ITEMS){
                return {
                    ...item, 
                    quantity: item.quantity - 1}
            }
            return item
        }) 
        setCart(updatedCart)
    }

    function cleanCart() {
        setCart([])
    }

    
    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuanquity,
        DecreaseQuanquity,
        cleanCart,
        isEmpty,
        cartTotal,
    }
}