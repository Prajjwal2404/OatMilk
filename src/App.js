import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Nav from './Nav/Nav'
import Home from './Home/HomePage'
import Product from './Product/Product'
import Process from './Process/ProcessPage'
import Environment from './Environment/EnvironmentPage'
import FAQ from './FAQ/FAQPage'
import About from './About/About'
import Buy from './Buy/Buy'
import More from './Buy/More/More'
import Listing from './Listing/Listing'
import Details from './Details/Details'
import SubscribeNav from './Subscribe/SubscribeNav/SubscribeNav'
import SubCheckout from './Subscribe/SubCheckout/SubCheckout'
import SubAddress from './Subscribe/SubAddress/SubAddress'
import SubPayment from './Subscribe/SubPayment/SubPayment'
import Subscriptions from './Subscriptions/Subscriptions'
import CartNav from './Cart/CartNav/CartNav'
import CartCheckout from './Cart/CartCheckout/CartCheckout'
import CartAddress from './Cart/CartAddress/CartAddress'
import CartPayment from './Cart/CartPayment/CartPayment'
import Account from './Account/Account'
import OrdersList from './Orders/OrdersList/OrdersList'
import OrderDetails from './Orders/OrderDetails/OrderDetails'
import OrderDetailsMob from './Orders/OrderDetailsMob/OrderDetailsMob'
import Addresses from './Addresses/Addresses'
import Login from './Login/Login'
import Terms from './Policies/Terms'
import Privacy from './Policies/Privacy'
import Shipping from './Policies/Shipping'
import ReturnRefund from './Policies/ReturnRefund'
import NotFound from './NotFoundPage/NotFoundPage'
import { loader as BuyLoader } from './Buy/Buy'
import { loader as ListingLoader } from './Listing/Listing'
import { loader as DetailsLoader } from './Details/Details'
import { loader as SubscribeNavLoader } from './Subscribe/SubscribeNav/SubscribeNav'
import { loader as SubCheckoutLoader } from './Subscribe/SubCheckout/SubCheckout'
import { loader as SubAddressLoader } from './Subscribe/SubAddress/SubAddress'
import { loader as SubPaymentLoader } from './Subscribe/SubPayment/SubPayment'
import { loader as SubscriptionsLoader } from './Subscriptions/Subscriptions'
import { loader as CartNavLoader } from './Cart/CartNav/CartNav'
import { loader as CartCheckoutLoader } from './Cart/CartCheckout/CartCheckout'
import { loader as CartAddressLoader } from './Cart/CartAddress/CartAddress'
import { loader as CartPaymentLoader } from './Cart/CartPayment/CartPayment'
import { loader as AccountLoader } from './Account/Account'
import { loader as OrdersListLoader } from './Orders/OrdersList/OrdersList'
import { loader as AddressesLoader } from './Addresses/Addresses'
import { loader as LoginLoader } from './Login/Login'
import { action as MessageAction } from './Components/Message/Message'
import { action as DetailsAction } from './Details/Details'
import { action as SubAddressAction } from './Subscribe/SubAddress/SubAddress'
import { action as SubPaymentAction } from './Subscribe/SubPayment/SubPayment'
import { action as SubscriptionsAction } from './Subscriptions/Subscriptions'
import { action as CartCheckoutAction } from './Cart/CartCheckout/CartCheckout'
import { action as CartAddressAction } from './Cart/CartAddress/CartAddress'
import { action as CartPaymentAction } from './Cart/CartPayment/CartPayment'
import { action as AccountAction } from './Account/Account'
import { action as AddressesAction } from './Addresses/Addresses'
import { action as LoginAction } from './Login/Login'
import Error from './Components/Error/Error'

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
          <Route index element={<SubCheckout />} loader={SubCheckoutLoader} />
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

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}