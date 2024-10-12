import { configureStore } from '@reduxjs/toolkit';
import counterSlice  from './counterStore';
import { count } from 'console';

export const store = configureStore({
    reducer : counterSlice
}) 