import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Nav from './Nav/Nav'
import Home from './Home/HomePage'
import Product from './Product/Product'
import Process from './Process/ProcessPage'
import Environment from './Environment/EnvironmentPage'
import FAQ from './FAQ/FAQPage'
import Buy from './Buy/Buy'
import More from './Buy/More/More'
import Listing from './Listing/Listing'
import Details from './Details/Details'
import Subscribe from './Subscribe/Subscribe'
import Cart from './Components/Cart'
import Login from './Login/Login'
import NotFound from './NotFoundPage/NotFoundPage'
import { loader as ListingLoader } from './Listing/Listing'
import { loader as DetailsLoader } from './Details/Details'
import { loader as SubscribeLoader } from './Subscribe/Subscribe'
import { action as LoginAction } from './Login/Login'
import { action as SubscribeAction } from './Subscribe/Subscribe'
import RequireAuth from './Utils/HandleUser'

export default function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Nav />}>
      <Route index element={<Home />} />
      <Route path='product' element={<Product />} />
      <Route path='process' element={<Process />} />
      <Route path='environment' element={<Environment />} />
      <Route path='faq' element={<FAQ />} />
      <Route path='buy' element={<Buy />}>
        <Route index element={<Listing />} loader={ListingLoader} />
        <Route path='details/:id' element={<Details />} loader={DetailsLoader} />
        <Route path='details/:id/subscribe' element={<Subscribe />} loader={SubscribeLoader} action={SubscribeAction} />
        <Route path='subscriptions' element={<div style={{ width: '100%', height: '100%' }} />} />
        <Route path='cart' element={<Cart />} />
        <Route path='account' element={<More />} loader={async ({ request }) => await RequireAuth(request)}>
          <Route index element={<div style={{ width: '100%', height: '100%' }} />} />
          <Route path='orders' element={<div style={{ width: '100%', height: '100%' }} />} />
          <Route path='addresses' element={<div style={{ width: '100%', height: '100%' }} />} />
        </Route>
        <Route path='login' element={<Login />} action={LoginAction} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Route>
  ))

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}