import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

export type CartActions = 
    { type : 'add-to-cart', payload : {item : Guitar} } |
    { type : 'remove-from-cart', payload : {id : Guitar['id']} } |
    { type : 'decrease-quantity', payload : {id : Guitar['id']} } |
    { type : 'increased-quantity', payload : {id : Guitar['id']} } |
    { type : 'clear-cart'}
    
export type Cartstate = {
    data : Guitar[]
    cart : CartItem[]
}

const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : [] //JSON.parce lo convierte a un arreglo
}

export const initialState : Cartstate = {
    data : db,
    cart : initialCart()
}

const MAX_ITEMS = 5
const MIN_ITEMS = 1

export const cartReducer = (
    state : Cartstate = initialState, 
    action : CartActions
) => {
    if(action.type === 'add-to-cart') {

        const itemsE = state.cart.find((guitar) => guitar.id === action.payload.item.id)
        let updateCart : CartItem[] = []
        if(itemsE){
            updateCart = state.cart.map(item => {
                if(item.id === action.payload.item.id) {
                    if(item.quantity < MAX_ITEMS) {
                        return {...item, quantity: item.quantity + 1}
                    }else {
                        return item
                    }
                }else {
                    return item
                }
            })
        }else {
            const newItem : CartItem = {...action.payload.item, quantity : 1}
            updateCart = [...state.cart, newItem]
        }

        return {
            ...state,
            cart : updateCart
        }
    }

    if(action.type === 'remove-from-cart') {
        
        const updatedCart = state.cart.filter( item => item.id !== action.payload.id)
        return {
            ...state,
            cart : updatedCart
        }
    }

    if(action.type === 'decrease-quantity') {

        const updatedCart = state.cart.map((item) => {
            if(item.id === action.payload.id && item.quantity > MIN_ITEMS){
                return {
                    ...item, 
                    quantity: item.quantity - 1}
            }
            return item
        }) 

        return {
            ...state,
            cart : updatedCart
        }
    }

    if(action.type === 'increased-quantity') {
        const updatedCart = state.cart.map((item) => {
            if(item.id === action.payload.id && item.quantity < MAX_ITEMS){
                return {
                    ...item, 
                    quantity: item.quantity + 1}
            }
            return item
        }) 
        return {
            ...state,
            cart : updatedCart
        }
    }

    if(action.type === 'clear-cart') {
        return {
            ...state,
            cart : []
        }
    }

    return state
}