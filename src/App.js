import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Nav from './Nav/Nav'
import Home from './Home/HomePage'
import About from './About/About'
import Product from './Product/Product'
import Process from './Process/ProcessPage'
import Environment from './Environment/EnvironmentPage'
import FAQ from './FAQ/FAQPage'
import { action as MessageAction } from './Components/Message/Message'
import Buy, { loader as BuyLoader } from './Buy/Buy'
import More from './Buy/More/More'
import Listing, { loader as ListingLoader } from './Listing/Listing'
import Details, { loader as DetailsLoader, action as DetailsAction } from './Details/Details'
import SubscribeNav, { loader as SubscribeNavLoader } from './Subscribe/SubscribeNav/SubscribeNav'
import SubCheckout, { loader as SubCheckoutLoader, action as SubCheckoutAction } from './Subscribe/SubCheckout/SubCheckout'
import SubAddress, { loader as SubAddressLoader, action as SubAddressAction } from './Subscribe/SubAddress/SubAddress'
import SubPayment, { loader as SubPaymentLoader, action as SubPaymentAction } from './Subscribe/SubPayment/SubPayment'
import Subscriptions, { loader as SubscriptionsLoader, action as SubscriptionsAction } from './Subscriptions/Subscriptions'
import CartNav, { loader as CartNavLoader } from './Cart/CartNav/CartNav'
import CartCheckout, { loader as CartCheckoutLoader, action as CartCheckoutAction } from './Cart/CartCheckout/CartCheckout'
import CartAddress, { loader as CartAddressLoader, action as CartAddressAction } from './Cart/CartAddress/CartAddress'
import CartPayment, { loader as CartPaymentLoader, action as CartPaymentAction } from './Cart/CartPayment/CartPayment'
import Account, { loader as AccountLoader, action as AccountAction } from './Account/Account'
import OrdersList, { loader as OrdersListLoader } from './Orders/OrdersList/OrdersList'
import OrderDetails from './Orders/OrderDetails/OrderDetails'
import OrderDetailsMob from './Orders/OrderDetailsMob/OrderDetailsMob'
import Addresses, { loader as AddressesLoader, action as AddressesAction } from './Addresses/Addresses'
import Login, { loader as LoginLoader, action as LoginAction } from './Login/Login'
import Terms from './Policies/Terms'
import Privacy from './Policies/Privacy'
import Shipping from './Policies/Shipping'
import ReturnRefund from './Policies/ReturnRefund'
import NotFound from './NotFoundPage/NotFoundPage'
import Error from './Components/Error/Error'
import PreloadImg from './Utils/PreloadImg'

export default function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Nav />} errorElement={<Error />}>
      <Route index element={<Home />} action={MessageAction} errorElement={<Error />} />
      <Route path='about' element={<About />} action={MessageAction} errorElement={<Error />} />
      <Route path='product' element={<Product />} action={MessageAction} errorElement={<Error />} />
      <Route path='process' element={<Process />} action={MessageAction} errorElement={<Error />} />
      <Route path='environment' element={<Environment />} action={MessageAction} errorElement={<Error />} />
      <Route path='faq' element={<FAQ />} action={MessageAction} errorElement={<Error />} />
      <Route path='buy' element={<Buy />} loader={BuyLoader} errorElement={<Error />}>
        <Route index element={<Listing />} loader={ListingLoader} />
        <Route path='details/:id' element={<Details />} loader={DetailsLoader} action={DetailsAction} />
        <Route path='details/:id/subscribe' element={<SubscribeNav />} loader={SubscribeNavLoader}>
          <Route index element={<SubCheckout />} loader={SubCheckoutLoader} action={SubCheckoutAction} />
          <Route path='address' element={<SubAddress />} loader={SubAddressLoader} action={SubAddressAction} />
          <Route path='payment' element={<SubPayment />} loader={SubPaymentLoader} action={SubPaymentAction} />
        </Route>
        <Route path='subscriptions' element={<Subscriptions />} loader={SubscriptionsLoader} action={SubscriptionsAction} />
        <Route path='cart' element={<CartNav />} loader={CartNavLoader}>
          <Route index element={<CartCheckout />} loader={CartCheckoutLoader} action={CartCheckoutAction} />
          <Route path='address' element={<CartAddress />} loader={CartAddressLoader} action={CartAddressAction} />
          <Route path='payment' element={<CartPayment />} loader={CartPaymentLoader} action={CartPaymentAction} />
        </Route>
        <Route path='account' element={<More />}>
          <Route index element={<Account />} loader={AccountLoader} action={AccountAction} />
          <Route path='orders' element={<OrdersList />} loader={OrdersListLoader}>
            <Route index element={<OrderDetailsMob />} />
            <Route path=':orderId' element={<OrderDetails />} />
          </Route>
          <Route path='addresses' element={<Addresses />} loader={AddressesLoader} action={AddressesAction} />
        </Route>
        <Route path='login' element={<Login />} loader={LoginLoader} action={LoginAction} />
      </Route>
      <Route path='terms' element={<Terms />} errorElement={<Error />} />
      <Route path='privacy' element={<Privacy />} errorElement={<Error />} />
      <Route path='shipping' element={<Shipping />} errorElement={<Error />} />
      <Route path='returnrefund' element={<ReturnRefund />} errorElement={<Error />} />
      <Route path='*' element={<NotFound />} errorElement={<Error />} />
    </Route>
  ))

  PreloadImg()

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}